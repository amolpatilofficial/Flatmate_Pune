# Quick Reference - Admin Account Creation

## 🔐 Admin Secret Code
```
amollrushalisanjeevpratibha
```

## 📍 Where to Create Admin Account

### Step 1: Navigate to Admin Registration
Open your browser and go to:
```
http://localhost:3000/admin/register
```

### Step 2: Fill in the Form
- **Full Name**: Enter your name (e.g., "Admin User")
- **Admin Email**: Enter your email (e.g., "admin@flatmate.com")
- **Password**: Choose a password (minimum 6 characters)
- **Confirm Password**: Re-enter the same password
- **Admin Secret Code**: Enter exactly: `amollrushalisanjeevpratibha`

### Step 3: Submit
Click the "Create Admin Account" button

### Step 4: You're In!
After successful registration, you'll be automatically logged in and redirected to the admin dashboard at:
```
http://localhost:3000/admin
```

## 🎯 What You'll See in Admin Dashboard

Once logged in, you'll have access to:
1. **4 Analytics Graphs**:
   - Listings Trend Chart (Area Chart)
   - Category Distribution (Pie Chart)
   - Status Distribution (Bar Chart)
   - Top Areas by Listings (Horizontal Bar Chart)

2. **Stats Cards**:
   - Total Listings
   - Pending Approvals
   - Approved Listings
   - Rejected Listings

3. **Property Management**:
   - View all listings with tabs (Pending, Approved, Rejected)
   - Approve/Reject pending listings
   - Delete any listing
   - View owner contact details

## 🔄 Login Again Later

If you logout, you can login again at:
```
http://localhost:3000/admin/login
```
Use your email and password (NO secret code needed for login, only for registration)

## ⚠️ Important Notes

- The secret code is **case-sensitive**: `amollrushalisanjeevpratibha` (lowercase)
- Notice the double 'l' in "amoll"
- Keep this code confidential
- Only share with authorized administrators
- Each admin needs this code ONLY during registration

## 🚨 Troubleshooting

**Error: "Invalid admin secret code"**
- Make sure you typed: `amollrushalisanjeevpratibha` (exactly as shown)
- Check for typos (especially the double 'l')
- Copy-paste the code to avoid mistakes

**Can't access admin dashboard after login**
- Make sure you registered via `/admin/register` (not regular `/register`)
- Navigate directly to: `http://localhost:3000/admin`
- Check that you're logged in (look for user menu in top-right)

**Want to create another admin account**
- Each person can create their own admin account
- Everyone needs the same secret code: `amollrushalisanjeevpratibha`
- Each admin will have their own email/password

---

## 📝 Complete Admin URLs

| Purpose | URL |
|---------|-----|
| **Create Admin Account** | http://localhost:3000/admin/register |
| **Admin Login** | http://localhost:3000/admin/login |
| **Admin Dashboard** | http://localhost:3000/admin |

---

**Secret Code (Copy this):**
```
amollrushalisanjeevpratibha
```
