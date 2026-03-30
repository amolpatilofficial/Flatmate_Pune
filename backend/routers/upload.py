import os
import uuid
import boto3
from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
from botocore.exceptions import ClientError

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Configure S3 client for Supabase
s3_client = boto3.client(
    's3',
    endpoint_url=os.environ.get('SUPABASE_S3_ENDPOINT'),
    aws_access_key_id=os.environ.get('SUPABASE_S3_ACCESS_KEY'),
    aws_secret_access_key=os.environ.get('SUPABASE_S3_SECRET_KEY'),
    region_name=os.environ.get('SUPABASE_S3_REGION', 'ap-south-1')
)

BUCKET_NAME = os.environ.get('SUPABASE_BUCKET', 'roomyaar_posting_photos')

@router.post("/images", response_model=List[str])
async def upload_images(images: List[UploadFile] = File(...)):
    uploaded_urls = []
    
    # We construct the base public URL for Supabase standard storage access
    # Given endpoint: https://tkvwhqxcnmmioqjrgvka.storage.supabase.co/storage/v1/s3
    # Public URL is: https://tkvwhqxcnmmioqjrgvka.supabase.co/storage/v1/object/public/{bucket_name}/{object_path}
    
    endpoint = os.environ.get('SUPABASE_S3_ENDPOINT', '')
    
    try:
        for file in images:
            if not file.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not an image")
            
            # Generate unique filename
            ext = file.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{ext}"
            
            # Upload to Supabase using boto3
            s3_client.upload_fileobj(
                file.file,
                BUCKET_NAME,
                unique_filename,
                ExtraArgs={"ContentType": file.content_type}
            )
            
            # Construct public URL
            if '.storage.' in endpoint:
                project_url = endpoint.split('.storage.')[0]
                public_url = f"{project_url}.supabase.co/storage/v1/object/public/{BUCKET_NAME}/{unique_filename}"
            else:
                public_url = f"{endpoint.replace('s3', 'object/public')}/{BUCKET_NAME}/{unique_filename}"
            uploaded_urls.append(public_url)
            
    except ClientError as e:
        print(f"Boto3 Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload images to storage")
    except Exception as e:
        print(f"Generic Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    return uploaded_urls
