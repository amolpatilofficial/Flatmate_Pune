import api from '../api';

export const seedMockData = async () => {
  // First, create test users
  const users = [
    // 4 users posting flats
    {
      id: 'user-onkar',
      name: 'Onkar',
      email: 'onkar@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-faiz',
      name: 'Faiz',
      email: 'faiz@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-rajat',
      name: 'Rajat',
      email: 'rajat@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-junied',
      name: 'Junied',
      email: 'junied@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    // 3 users searching for rooms
    {
      id: 'user-yogesh',
      name: 'Yogesh',
      email: 'yogesh@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-prashant',
      name: 'Prashant',
      email: 'prashant@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-shahwat',
      name: 'Shahwat',
      email: 'shahwat@example.com',
      password: 'password123',
      isAdmin: false,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Only send the payload to seed if we haven't already
  if (localStorage.getItem('db_seeded')) return;

  // Property listings posted by Onkar, Faiz, Rajat, and Junied
  const mockListings = [
    // Onkar's property - Modern 2BHK
    {
      id: 'listing-onkar-1',
      category: 'rent',
      title: 'Modern 2BHK Apartment in Hinjewadi with Flatmate',
      description: 'Hi, I\'m Onkar and I have a spacious 2BHK apartment in Hinjewadi Phase 1. Looking for a clean and responsible flatmate to share this beautiful space. The apartment is fully furnished with WiFi, AC, and all modern amenities. Located close to IT parks and has great connectivity.',
      propertyType: 'Apartment',
      area: 'Hinjewadi',
      address: 'Phase 1, Rajiv Gandhi Infotech Park Road',
      price: 12000,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'TV', 'AC', 'Fridge', 'Water'],
      lift: true,
      waterType: 'ro',
      ownerId: 'user-onkar',
      ownerName: 'Onkar',
      ownerEmail: 'onkar@example.com',
      ownerPhone: '9876501234',
      status: 'approved',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    },
    {
      id: 'listing-onkar-2',
      category: 'pg',
      title: 'Single Room PG Near Tech Park - Onkar\'s Place',
      description: 'Comfortable single room in a well-maintained PG. I\'m Onkar, the owner, and I ensure clean, peaceful environment for working professionals. All meals included, high-speed WiFi, and regular housekeeping.',
      propertyType: 'Single Room',
      area: 'Hinjewadi',
      address: 'Phase 2, Near Wipro Circle',
      price: 9500,
      amenities: ['WiFi', 'TV', 'AC', 'Fridge', 'Water'],
      lift: true,
      waterType: 'ro',
      ownerId: 'user-onkar',
      ownerName: 'Onkar',
      ownerEmail: 'onkar@example.com',
      ownerPhone: '9876501234',
      status: 'approved',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    },
    
    // Faiz's properties - Luxury spaces
    {
      id: 'listing-faiz-1',
      category: 'rent',
      title: 'Luxury 3BHK Flat in Koregaon Park - Faiz',
      description: 'Hello, I\'m Faiz! Offering a premium 3BHK apartment in the heart of Koregaon Park. Perfect for families or professionals looking for upscale living. Features include clubhouse access, swimming pool, gym, and 24/7 security. This property has a modern aesthetic with smart home features.',
      propertyType: 'Apartment',
      area: 'Koregaon Park',
      address: 'North Main Road, Lane 6',
      price: 45000,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['WiFi', 'TV', 'AC', 'Fridge', 'Water'],
      lift: true,
      waterType: 'ro',
      ownerId: 'user-faiz',
      ownerName: 'Faiz',
      ownerEmail: 'faiz@example.com',
      ownerPhone: '9876502345',
      status: 'approved',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    },
    {
      id: 'listing-faiz-2',
      category: 'pg',
      title: 'Premium Double Sharing PG by Faiz',
      description: 'Hi, Faiz here! Running a premium PG with double sharing rooms. Each room is well-furnished with attached bathrooms, personal wardrobes, and study tables. Home-cooked meals, laundry service, and housekeeping included. Perfect for students and working professionals.',
      propertyType: 'Double Sharing',
      area: 'Koregaon Park',
      address: 'East Street, Near Osho Garden',
      price: 11000,
      amenities: ['WiFi', 'TV', 'AC', 'Fridge', 'Water'],
      lift: true,
      waterType: 'ro',
      ownerId: 'user-faiz',
      ownerName: 'Faiz',
      ownerEmail: 'faiz@example.com',
      ownerPhone: '9876502345',
      status: 'approved',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop'
    },
    
    // Rajat's properties - Budget-friendly options
    {
      id: 'listing-rajat-1',
      category: 'rent',
      title: 'Affordable 1BHK in Baner - Rajat\'s Property',
      description: 'I\'m Rajat, and I have a cozy 1BHK available for rent in Baner. Great for young professionals or students. The flat comes semi-furnished with basic amenities. Very close to restaurants, shops, and has excellent public transport connectivity.',
      propertyType: 'Apartment',
      area: 'Baner',
      address: 'Baner Road, Near Symbiosis',
      price: 15000,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Fridge', 'Water'],
      lift: true,
      waterType: 'tap',
      ownerId: 'user-rajat',
      ownerName: 'Rajat',
      ownerEmail: 'rajat@example.com',
      ownerPhone: '9876503456',
      status: 'approved',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    },
    {
      id: 'listing-rajat-2',
      category: 'pg',
      title: 'Budget Triple Sharing PG - By Rajat',
      description: 'Hey, Rajat here! Offering affordable triple sharing accommodation perfect for students. Clean rooms, nutritious meals, and a friendly environment. Located in a safe neighborhood with easy access to colleges and IT companies.',
      propertyType: 'Triple Sharing',
      area: 'Baner',
      address: 'Sus Road, Baner',
      price: 7000,
      amenities: ['WiFi', 'Water'],
      lift: false,
      waterType: 'tap',
      ownerId: 'user-rajat',
      ownerName: 'Rajat',
      ownerEmail: 'rajat@example.com',
      ownerPhone: '9876503456',
      status: 'approved',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop'
    },
    
    // Junied's properties - Family-friendly spaces
    {
      id: 'listing-junied-1',
      category: 'rent',
      title: 'Spacious 2BHK Family Apartment - Junied',
      description: 'Hi, I\'m Junied! This 2BHK apartment is perfect for small families. Located in a peaceful society in Viman Nagar with children\'s play area, gym, and park. The apartment is well-ventilated with ample natural light. Pet-friendly society!',
      propertyType: 'Apartment',
      area: 'Viman Nagar',
      address: 'Near Phoenix Market City',
      price: 22000,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'TV', 'AC', 'Water'],
      lift: true,
      waterType: 'both',
      ownerId: 'user-junied',
      ownerName: 'Junied',
      ownerEmail: 'junied@example.com',
      ownerPhone: '9876504567',
      status: 'approved',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    },
    {
      id: 'listing-junied-2',
      category: 'rent',
      title: '3BHK Villa in Aundh - Premium Family Home by Junied',
      description: 'Hello! Junied here. Offering a beautiful 3BHK independent villa with private garden and parking. Perfect for families who value privacy and space. The villa features modern interiors, a terrace with great views, and is located in a gated community.',
      propertyType: 'House',
      area: 'Aundh',
      address: 'Aundh Gaon, Near ITI Road',
      price: 38000,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['WiFi', 'TV', 'AC', 'Fridge', 'Water'],
      lift: false,
      waterType: 'ro',
      ownerId: 'user-junied',
      ownerName: 'Junied',
      ownerEmail: 'junied@example.com',
      ownerPhone: '9876504567',
      status: 'approved',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    },
    
    // Additional diverse listings for variety
    {
      id: 'mock-3',
      category: 'sell',
      title: 'Modern 3BHK Apartment for Sale in Kharadi',
      description: 'Brand new 3BHK apartment with all modern amenities. Ready to move in. Great investment opportunity in rapidly developing area.',
      propertyType: 'Apartment',
      area: 'Kharadi',
      address: 'Eon Free Zone, Kharadi',
      price: 8500000,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'AC', 'Water'],
      lift: true,
      waterType: 'ro',
      ownerId: 'demo-owner-5',
      ownerName: 'Vikram Singh',
      ownerEmail: 'vikram.singh@example.com',
      ownerPhone: '9876543214',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      aadhaarUploaded: true,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    },
    {
      id: 'mock-4',
      category: 'pg',
      title: 'Triple Sharing PG in Wakad',
      description: 'Affordable PG accommodation with homely food. Close to IT parks and shopping areas.',
      propertyType: 'Triple Sharing',
      area: 'Wakad',
      address: 'Dange Chowk Road',
      price: 6500,
      amenities: ['WiFi', 'Water'],
      lift: true,
      waterType: 'tap',
      ownerId: 'demo-owner-6',
      ownerName: 'Anjali Mehta',
      ownerEmail: 'anjali.mehta@example.com',
      ownerPhone: '9876543215',
      status: 'pending',
      createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop'
    }
  ];

  try {
    await api.post('/seed', {
      users: users,
      properties: mockListings,
      profiles: mockFlatmates
    });
    localStorage.setItem('db_seeded', 'true');
    console.log('Database seeded successfully from backend via API!');
  } catch (error) {
    console.error('Failed to seed DB', error);
  }
};
