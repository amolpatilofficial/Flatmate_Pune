# Admin Access Credentials

## Admin Registration

To create an admin account, you need the secret code.

### Admin Secret Code
```
amolrushalisanjeevpratibha
```

## How to Register as Admin

1. Navigate to: http://localhost:3000/admin/register
2. Fill in the registration form:
   - **Full Name**: Your name
   - **Admin Email**: Your email address
   - **Password**: Choose a secure password (min 6 characters)
   - **Confirm Password**: Re-enter your password
   - **Admin Secret Code**: `amolrushalisanjeevpratibha`
3. Click "Create Admin Account"
4. You will be automatically logged in and redirected to the admin dashboard

## Admin Login

After registration, you can login at: http://localhost:3000/admin/login
- Use your registered email and password
- No secret code needed for login (only for registration)

## Admin Dashboard Access

Once logged in as admin:
- Navigate to: http://localhost:3000/admin
- View analytics graphs and manage listings
- Approve/reject property listings
- Monitor platform statistics

## Security Note

⚠️ **Keep the admin secret code confidential!**
- Only share with authorized administrators
- This code prevents unauthorized admin registration
- Regular users cannot access admin features without this code

## Admin Features

As an admin, you can:
- ✅ View comprehensive analytics dashboard with 4 graphs
- ✅ Monitor all property listings (PG, Rent, Sell)
- ✅ Approve pending listings
- ✅ Reject inappropriate listings
- ✅ Delete any listing
- ✅ View detailed owner information
- ✅ Track trends and statistics
- ✅ Manage platform content

## Regular User vs Admin

### Regular User Access
- Register at: /register
- No secret code required
- Can post properties and flatmate profiles
- Limited to own listings

### Admin Access
- Register at: /admin/register
- **Requires secret code**: `amolrushalisanjeevpratibha`
- Full platform access
- Can manage all listings
- Access to analytics dashboard
