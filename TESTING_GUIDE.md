# Testing Guide - Flatmate Pune App

## Automated Test Data Overview

This app now includes comprehensive seed data that automatically populates when you first load the application. No manual data entry needed!

## Test Users Created

### 1. Property Owners (Posting Flats)

#### Onkar
- **Email**: `onkar@example.com`
- **Password**: `password123`
- **Properties**: 2 listings
  - Modern 2BHK Apartment in Hinjewadi (₹12,000/month)
  - Single Room PG Near Tech Park (₹9,500/month)
- **Phone**: 9876501234

#### Faiz
- **Email**: `faiz@example.com`
- **Password**: `password123`
- **Properties**: 2 listings
  - Luxury 3BHK Flat in Koregaon Park (₹45,000/month)
  - Premium Double Sharing PG (₹11,000/month)
- **Phone**: 9876502345

#### Rajat
- **Email**: `rajat@example.com`
- **Password**: `password123`
- **Properties**: 2 listings
  - Affordable 1BHK in Baner (₹15,000/month)
  - Budget Triple Sharing PG (₹7,000/month)
- **Phone**: 9876503456

#### Junied
- **Email**: `junied@example.com`
- **Password**: `password123`
- **Properties**: 2 listings
  - Spacious 2BHK Family Apartment in Viman Nagar (₹22,000/month)
  - 3BHK Villa in Aundh (₹38,000/month)
- **Phone**: 9876504567

### 2. Room Seekers (Searching for Rooms)

#### Yogesh
- **Email**: `yogesh@example.com`
- **Password**: `password123`
- **Occupation**: Software Engineer
- **Preferred Area**: Hinjewadi
- **Budget**: ₹12,000
- **Preferences**: Vegetarian, Non-smoker, Pet-friendly
- **Phone**: 9876505678

#### Prashant
- **Email**: `prashant@example.com`
- **Password**: `password123`
- **Occupation**: Marketing Professional
- **Preferred Area**: Koregaon Park
- **Budget**: ₹15,000
- **Preferences**: Non-vegetarian, Social drinker
- **Phone**: 9876506789

#### Shahwat
- **Email**: `shahwat@example.com`
- **Password**: `password123`
- **Occupation**: Data Analyst
- **Preferred Area**: Baner
- **Budget**: ₹10,000
- **Preferences**: Non-vegetarian, Organized, Gamer
- **Phone**: 9876507890

## Testing Scenarios

### Scenario 1: Browse Property Listings
1. Open http://localhost:3000
2. Click "Find Rooms"
3. You should see 8 property listings with photos
4. Properties include:
   - Onkar's 2 properties (Hinjewadi)
   - Faiz's 2 properties (Koregaon Park)
   - Rajat's 2 properties (Baner)
   - Junied's 2 properties (Viman Nagar & Aundh)
   - 2 pending properties for admin testing

### Scenario 2: View Flatmate Profiles
1. Navigate to "Find Rooms" (homepage sections)
2. Browse flatmate profiles
3. You should see profiles for:
   - Yogesh (Software Engineer, Hinjewadi)
   - Prashant (Marketing Professional, Koregaon Park)
   - Shahwat (Data Analyst, Baner)
   - Plus 2 additional demo profiles

### Scenario 3: Login as Property Owner
1. Click "Login"
2. Use credentials:
   - Email: `onkar@example.com`
   - Password: `password123`
3. Once logged in, navigate to "My Listings"
4. You should see Onkar's 2 properties

### Scenario 4: Login as Room Seeker
1. Click "Login"
2. Use credentials:
   - Email: `yogesh@example.com`
   - Password: `password123`
3. Navigate to flatmate profiles
4. You can view contact details of other profiles

### Scenario 5: Admin Dashboard with Graphs
1. Create an admin account:
   - Go to http://localhost:3000/admin/register
   - Fill in details (name and email)
   - Password: any (remember it!)
   - **Admin Secret Code**: `amollrushalisanjeevpratibha` (required!)
   - Admin users are created with admin privileges only with correct secret code
2. Login at http://localhost:3000/admin/login
3. Navigate to http://localhost:3000/admin
4. View the enhanced admin dashboard with 4 graphs:
   - **Listings Trend Chart**: Shows listing activity over last 7 days
   - **Category Distribution Pie Chart**: PG vs Rent vs Sell breakdown
   - **Status Distribution Bar Chart**: Pending, Approved, Rejected counts
   - **Top Areas Chart**: Shows most popular areas for listings

### Scenario 6: Test Property Posting
1. Login as any user (e.g., `onkar@example.com`)
2. Click "Post Your Room"
3. Fill in property details
4. Submit
5. View in "My Listings"
6. Login as admin to approve/reject

### Scenario 7: Search and Filter
1. Go to "Find Rooms"
2. Use search bar to search for specific areas:
   - "Hinjewadi" - should show Onkar's properties
   - "Koregaon" - should show Faiz's properties
   - "Baner" - should show Rajat's properties
3. Test area filters using dropdown

### Scenario 8: Admin Property Management
1. Login as admin
2. Go to admin dashboard (http://localhost:3000/admin)
3. See stats cards showing:
   - Total Listings
   - Pending (2 properties)
   - Approved (8 properties)
   - Rejected (0 initially)
4. Use tabs to filter: Pending | Approved | Rejected
5. Approve/Reject pending listings
6. Observe graphs update in real-time

## Admin Dashboard Graph Details

### Graph 1: Listings Trend (Area Chart)
- **Purpose**: Track listing growth over time
- **Data**: Last 7 days of listing creation
- **Features**:
  - Gradient blue fill
  - Shows total listings per day
  - Interactive tooltips

### Graph 2: Category Distribution (Pie Chart)
- **Purpose**: Understand property type mix
- **Data**: Distribution of PG, Rent, and Sell listings
- **Features**:
  - Color-coded segments (Purple, Pink, Orange)
  - Percentage labels
  - Interactive hover effects

### Graph 3: Status Distribution (Bar Chart)
- **Purpose**: Monitor admin workload
- **Data**: Count of Pending, Approved, Rejected listings
- **Features**:
  - Color-coded bars (Orange, Green, Red)
  - Shows exact counts
  - Helps prioritize approvals

### Graph 4: Top Areas (Horizontal Bar Chart)
- **Purpose**: Identify popular neighborhoods
- **Data**: Top 6 areas by listing count
- **Features**:
  - Rainbow color scheme
  - Geographic insights
  - Market analysis tool

## Expected Results

### Homepage
- Clean, modern UI with gradient hero section
- Stats showing 500+ Active Users, 200+ Successful Matches
- "Find Rooms" and "Post Your Room" CTA buttons
- "How It Works" section with 3 steps

### Browse Listings Page
- Grid of property cards with photos (from Unsplash)
- Each card shows:
  - Property image
  - Title
  - Price
  - Area (with map pin icon)
  - Category badge (PG/Rent/Sell)
  - Owner details

### Admin Dashboard
- 4 colorful stat cards with icons
- 4 interactive graphs (2x2 grid layout)
- Tabs for filtering (Pending, Approved, Rejected)
- Property cards with Approve/Reject actions
- Delete functionality with confirmation dialog

## Data Persistence

All data is stored in browser's localStorage:
- `registeredUsers` - All user accounts
- `propertyListings` - All property listings
- `flatmateProfiles` - All flatmate profiles

**Note**: Clearing browser cache will reset all data. Simply refresh the page to reseed.

## Photos

All property listings include high-quality photos from Unsplash:
- Modern interiors
- Well-lit rooms
- Professional photography
- 800x600px resolution

## Common Issues & Solutions

### Issue: No data showing
**Solution**: Refresh the page. The seedMockData() function runs on app load.

### Issue: Can't access admin dashboard
**Solution**: 
- Make sure you registered via /admin/register with the correct secret code: `amollrushalisanjeevpratibha`
- Login via /admin/login
- Navigate directly to /admin (not /admin/dashboard)

### Issue: Graphs not showing
**Solution**:
- Wait 2-3 seconds for graphs to render
- Check browser console for errors
- Recharts library should be installed (already in package.json)

### Issue: Can't see other users' properties
**Solution**: 
- Properties are linked to specific user IDs
- Login as the correct user to see their listings
- Or login as admin to see all listings

## Quick Test Credentials

For quick testing, use any of these:
```
onkar@example.com / password123
faiz@example.com / password123  
rajat@example.com / password123
junied@example.com / password123
yogesh@example.com / password123
prashant@example.com / password123
shahwat@example.com / password123
```

## Next Steps

After testing, you can:
1. Clear localStorage to start fresh
2. Create new listings with your own data
3. Customize the UI colors/theme
4. Add more graph types
5. Implement backend API integration
6. Add real database storage (MongoDB)
