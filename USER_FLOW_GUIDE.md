# New User Flow - FlatMate Pune

## Overview
The application has been restructured to provide a clearer, more intuitive user journey for both flat owners and room seekers.

## User Journeys

### 🏠 For Flat Owners (People with rooms to rent)

**Step 1: Sign Up**
- Navigate to http://localhost:3000
- Click "Sign Up" or "List Your Flat"
- Create account with email and password
- Automatically redirected to profile creation

**Step 2: Create Profile**
- Fill in personal details:
  - Full Name
  - Age & Gender
  - Occupation
  - Phone Number
  - Preferred Area in Pune
  - About You (bio)
- Select "Yes, I want to list my property"
- Automatically redirected to post property page

**Step 3: Post Your Flat**
- Add flat details with photos
- Include amenities, price, location
- Submit for admin approval

**Step 4: Manage Listings**
- View your listings in "My Listings"
- Track approval status
- Edit or delete listings

### 🔍 For Room Seekers (People looking for flats)

**Step 1: Browse Flats (No login needed)**
- Navigate to http://localhost:3000
- Click "Browse Flats"
- View all available flats with:
  - Photos
  - Price
  - Location
  - Basic details
- Use filters to search by area, category

**Step 2: Find Interesting Flat**
- Click on any flat to see full details
- View complete property information
- See owner's profile summary

**Step 3: Sign Up to Contact**
- When ready to contact owner, click "View Contact Details"
- System prompts to sign up
- Create account
- Redirected to create profile

**Step 4: Complete Profile**
- Fill in your details
- Select "No, I'm looking for a room"
- Profile helps build trust with flat owners

**Step 5: View Owner Details & Contact**
- Now you can see owner's:
  - Full profile with background
  - Contact details (phone, email)
  - Verification status
- Contact owner directly

## Key Features

### Profile System
- **Mandatory after signup**: Everyone must create a profile
- **Builds trust**: Both owners and seekers have verified profiles
- **Background check**: View occupation, age, area, bio
- **Verification badge**: Admin-verified profiles

### Browse Without Login
- Anyone can browse available flats
- See photos, prices, locations
- Filter by area and category
- Only need login to contact owners

### Owner Profile Display
- Each flat shows owner's profile
- See owner's background before contacting
- Verification status visible
- Builds trust and transparency

### Smart Redirects
- Sign up → Create Profile → Based on choice:
  - Has room → Post Property
  - Looking for room → Browse Flats
- Try to contact without login → Sign up → Create Profile → Back to flat

## Navigation

### Homepage
- **Browse Flats**: See all listings (no login needed)
- **List Your Flat**: Start signup process for owners

### Navbar (When Logged In)
- **Browse Flats**: View all listings
- **List Your Flat**: Post new property
- **User Menu**:
  - My Listings: Manage your properties
  - My Profile: View/edit your profile
  - Admin Panel (if admin)
  - Logout

## URLs

| Page | URL | Login Required |
|------|-----|----------------|
| Homepage | / | No |
| Browse Flats | /browse-flats | No |
| Flat Details | /flat/:id | No |
| Sign Up | /register | No |
| Login | /login | No |
| Create Profile | /create-profile | Yes |
| Post Property | /post-property | Yes |
| My Listings | /my-listings | Yes |
| Admin Dashboard | /admin | Yes (Admin only) |

## Data Storage

### userProfiles
Stores all user profiles with:
- userId (linked to user account)
- fullName, age, gender
- occupation, phone
- area, bio
- hasRoom (yes/no)

### propertyListings
Stores all flat listings with:
- Owner details
- Property information
- Photos
- Amenities
- Status (pending/approved/rejected)

## Security Features

1. **Contact Protection**: Must be logged in with profile to see contact details
2. **Profile Verification**: Admin approval for listings
3. **User Verification**: Profile badges show verified users
4. **Admin Secret Code**: `amollrushalisanjeevpratibha`

## Benefits of New Flow

### For Flat Owners
✅ Profile shows credibility to potential tenants
✅ Clear process: Sign up → Profile → Post Flat
✅ Manage all listings in one place

### For Room Seekers
✅ Browse without commitment (no login needed)
✅ See owner background before contacting
✅ Only create profile when serious
✅ Trust through transparency

### For Platform
✅ Higher quality interactions
✅ Both parties verified
✅ Reduced spam
✅ Better matching through profiles

## Testing the Flow

### Test as Flat Owner
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Register with: owner1@test.com / password123
4. Complete profile (choose "Yes, I want to list my property")
5. Add flat details with photos
6. View in "My Listings"

### Test as Room Seeker
1. Go to http://localhost:3000
2. Click "Browse Flats"
3. View any flat (no login)
4. Click "View Contact Details"
5. Sign up when prompted: seeker1@test.com / password123
6. Complete profile (choose "No, I'm looking for a room")
7. Now you can see owner's contact details

## Migration from Old Flow

Old routes automatically redirect to new structure:
- `/find-rooms` → `/browse-flats`
- `/post-flatmate` → `/create-profile`
- `/my-flatmate-profile` → `/my-listings`
- `/room/:id` → `/flat/:id`

All existing data and users continue to work seamlessly!
