import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import api from '@/api';
import { User, Briefcase, MapPin, IndianRupee, Calendar, Upload, X, Loader2 } from 'lucide-react';

const PostFlatmatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [roomPhotos, setRoomPhotos] = useState([]); // Stores {id, url, isExisting}
  const [photoFiles, setPhotoFiles] = useState([]); // Stores actual File objects for new uploads
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: 'male',
    occupation: '',
    preferredArea: '',
    budget: '',
    role: 'roommate_seeker',
    roomType: 'pg',
    lookingFor: 'any',
    vegetarian: false,
    smoking: false,
    drinking: false,
    petFriendly: false,
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    lift: false,
    waterType: 'tap',
    address: '',
    description: '',
    phone: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProfile = async () => {
        try {
          const res = await api.get(`/profiles/${id}`);
          const data = res.data;
          setFormData({
            ...data,
            age: data.age.toString(),
            budget: data.budget.toString(),
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
          });
          if (data.roomPhotos) {
            setRoomPhotos(data.roomPhotos.map(url => ({ id: Math.random(), url, isExisting: true })));
          }
        } catch (e) {
          toast.error('Failed to load profile');
          navigate('/my-flatmate-profile');
        } finally {
          setFetching(false);
        }
      };
      fetchProfile();
    }
  }, [id, isEditMode, navigate]);

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const amenitiesList = ['WiFi', 'TV', 'AC', 'Fridge', 'Water'];

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (roomPhotos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    const newPhotoFiles = [...photoFiles];
    const newRoomPhotos = [...roomPhotos];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (>5MB)`);
        return;
      }
      newPhotoFiles.push(file);
      newRoomPhotos.push({
        id: Math.random(),
        url: URL.createObjectURL(file),
        isExisting: false,
        fileIndex: newPhotoFiles.length - 1
      });
    });

    setPhotoFiles(newPhotoFiles);
    setRoomPhotos(newRoomPhotos);
  };

  const removePhoto = (id) => {
    const photoToRemove = roomPhotos.find(p => p.id === id);
    if (!photoToRemove) return;

    if (!photoToRemove.isExisting) {
      // If it was a new file, we should ideally remove it from photoFiles too
      // but simpler to just filter it out during submit based on roomPhotos state
    }
    setRoomPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.phone || formData.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // 1. Handle Image Uploads
      let finalPhotoUrls = roomPhotos.filter(p => p.isExisting).map(p => p.url);
      const newFilesToUpload = roomPhotos.filter(p => !p.isExisting).map((p, idx) => {
        // Find the actual file from the original upload event
        // (Assuming we kept them in sync or just take from photoFiles)
        // A better way is to store the File object directly in roomPhotos
        return photoFiles[p.fileIndex];
      }).filter(Boolean);

      if (newFilesToUpload.length > 0) {
        const imageFormData = new FormData();
        newFilesToUpload.forEach(file => imageFormData.append('images', file));
        
        const uploadRes = await api.post('/upload/images', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalPhotoUrls = [...finalPhotoUrls, ...uploadRes.data];
      }

      // If owner, photos are mandatory (at least 1 for profile, but let's say 4 for consistency if possible)
      if ((formData.role === 'flat_owner' || formData.role === 'pg_owner') && finalPhotoUrls.length === 0) {
        throw new Error('Please upload at least one photo of your room');
      }

      const payload = {
        ...formData,
        id: isEditMode ? id : undefined, // Let backend generate if new
        age: parseInt(formData.age),
        budget: parseFloat(formData.budget),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        roomPhotos: finalPhotoUrls,
        userId: user.id,
        userEmail: user.email,
        status: isEditMode ? formData.status : 'pending',
        createdAt: formData.createdAt || new Date().toISOString()
      };

      if (isEditMode) {
        await api.put(`/profiles/${payload.id}`, payload);
        toast.success('Profile updated successfully!');
      } else {
        await api.post('/profiles', payload);
        toast.success('Profile posted successfully! Waiting for admin approval.');
      }
      
      navigate('/my-flatmate-profile');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to submit profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <Card className="shadow-elegant-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Post Your Flatmate Profile</CardTitle>
            <CardDescription>
              Create your profile to find the perfect flatmate. Your profile will be reviewed by admin before going live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                
                {/* Profile Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Your Photo (Optional - helps build trust)</Label>
                  <div className="flex items-center gap-4">
                    {profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={profilePhoto} 
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setProfilePhoto(null)}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                      />
                      <label htmlFor="profilePhoto" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG - Max 5MB. Optional but recommended.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any" className="font-normal cursor-pointer">Prefer not to say</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      placeholder="e.g., Software Engineer, Student"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Room Status */}
              <div className="space-y-4 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                <h3 className="text-lg font-semibold text-foreground">Your Accommodation Status</h3>
                
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value})}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roommate_seeker" id="ns-seeker" />
                    <Label htmlFor="ns-seeker" className="font-normal cursor-pointer text-base">
                      I am looking for a room or flatmate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flat_owner" id="ns-flat" />
                    <Label htmlFor="ns-flat" className="font-normal cursor-pointer text-base">
                      I have a private flat/room and need a flatmate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pg_owner" id="ns-pg" />
                    <Label htmlFor="ns-pg" className="font-normal cursor-pointer text-base">
                      I run a Paying Guest (PG) accommodation
                    </Label>
                  </div>
                </RadioGroup>

                {(formData.role === 'flat_owner' || formData.role === 'pg_owner') && (
                  <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border border-border">
                    <h4 className="font-semibold text-accent">Room Details</h4>
                    


                    {/* Photo Upload - MANDATORY for room owners */}
                    <div className="space-y-2">
                      <Label htmlFor="photos">Room Photos * (Mandatory - Max 5 photos)</Label>
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="photos"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <label htmlFor="photos" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload room photos (JPG, PNG - Max 5MB each)
                          </p>
                        </label>
                      </div>
                      
                      {roomPhotos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {roomPhotos.map(photo => (
                            <div key={photo.id} className="relative group">
                              <img 
                                src={photo.url} 
                                alt="Room"
                                className="w-full h-32 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="Number of bedrooms"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="Number of bathrooms"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenitiesList.map(amenity => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox 
                              id={amenity}
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={() => handleAmenityToggle(amenity)}
                            />
                            <Label htmlFor={amenity} className="font-normal cursor-pointer">
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Input
                        id="address"
                        placeholder="Street, landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required={formData.role !== 'roommate_seeker'}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lift"
                        checked={formData.lift}
                        onCheckedChange={(checked) => setFormData({...formData, lift: checked})}
                      />
                      <Label htmlFor="lift" className="font-normal cursor-pointer">
                        Lift Available
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredArea">Preferred Area *</Label>
                    <Select 
                      value={formData.preferredArea} 
                      onValueChange={(value) => setFormData({...formData, preferredArea: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {puneAreas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (per month) *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="Your budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Looking for flatmate of gender</Label>
                  <RadioGroup value={formData.lookingFor} onValueChange={(value) => setFormData({...formData, lookingFor: value})}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="lookingMale" />
                        <Label htmlFor="lookingMale" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="lookingFemale" />
                        <Label htmlFor="lookingFemale" className="font-normal cursor-pointer">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="lookingAny" />
                        <Label htmlFor="lookingAny" className="font-normal cursor-pointer">Any</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Lifestyle Preferences</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vegetarian"
                      checked={formData.vegetarian}
                      onCheckedChange={(checked) => setFormData({...formData, vegetarian: checked})}
                    />
                    <Label htmlFor="vegetarian" className="font-normal cursor-pointer">
                      Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="smoking"
                      checked={formData.smoking}
                      onCheckedChange={(checked) => setFormData({...formData, smoking: checked})}
                    />
                    <Label htmlFor="smoking" className="font-normal cursor-pointer">
                      Smoking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="drinking"
                      checked={formData.drinking}
                      onCheckedChange={(checked) => setFormData({...formData, drinking: checked})}
                    />
                    <Label htmlFor="drinking" className="font-normal cursor-pointer">
                      Social Drinking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="petFriendly"
                      checked={formData.petFriendly}
                      onCheckedChange={(checked) => setFormData({...formData, petFriendly: checked})}
                    />
                    <Label htmlFor="petFriendly" className="font-normal cursor-pointer">
                      Pet Friendly
                    </Label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">About You *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about yourself, your interests, work schedule, etc."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  maxLength={10}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Submitting...' : 'Submit Profile for Approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PostFlatmatePage;
