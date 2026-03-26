import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const PostPropertyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  
  const [formData, setFormData] = useState({
    category: 'pg',
    title: '',
    description: '',
    propertyType: '',
    area: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    lift: false,
    waterType: 'tap',
    ownerPhone: ''
  });

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const amenitiesList = ['WiFi', 'TV', 'AC', 'Fridge', 'Water'];
  
  const propertyTypes = {
    pg: ['Single Room', 'Double Sharing', 'Triple Sharing'],
    rent: ['Apartment', 'House', 'Villa'],
    sell: ['Apartment', 'House', 'Villa', 'Plot']
  };

  const needsAadhaar = formData.category === 'rent' || formData.category === 'sell';

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setAadhaarFile(file);
      toast.success('Aadhaar document uploaded');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (needsAadhaar && !aadhaarFile) {
      toast.error('Please upload Aadhaar document for rent/sell properties');
      setLoading(false);
      return;
    }

    if (!formData.ownerPhone || formData.ownerPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    const newListing = {
      id: Date.now().toString(),
      ...formData,
      price: parseInt(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
      ownerPhone: formData.ownerPhone,
      status: 'pending',
      createdAt: new Date().toISOString(),
      aadhaarUploaded: needsAadhaar
    };

    setTimeout(() => {
      const existingListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
      existingListings.push(newListing);
      localStorage.setItem('propertyListings', JSON.stringify(existingListings));
      
      toast.success('Property posted successfully! Waiting for admin approval.');
      navigate('/my-listings');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <Card className="shadow-elegant-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Post Your Property</CardTitle>
            <CardDescription>
              Fill in the details below to list your property. Properties require admin approval before going live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value, propertyType: ''})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pg">Paying Guest (PG)</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="sell">Buy/Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => setFormData({...formData, propertyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes[formData.category].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Spacious 2BHK in Koregaon Park"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              {/* Area & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Select 
                    value={formData.area} 
                    onValueChange={(value) => setFormData({...formData, area: value})}
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
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street, landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price * {formData.category !== 'sell' && '(per month)'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price in rupees"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              {/* Bedrooms & Bathrooms */}
              {formData.category !== 'pg' && (
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
              )}

              {/* Amenities */}
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

              {/* Water Type */}
              <div className="space-y-2">
                <Label htmlFor="waterType">Water Type</Label>
                <Select 
                  value={formData.waterType} 
                  onValueChange={(value) => setFormData({...formData, waterType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tap">Tap Water</SelectItem>
                    <SelectItem value="ro">RO Purifier</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lift */}
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

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Contact Phone Number *</Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                  required
                  maxLength={10}
                />
              </div>

              {/* Aadhaar Upload for Rent/Sell */}
              {needsAadhaar && (
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Document * (for verification)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      id="aadhaar"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="aadhaar" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {aadhaarFile ? aadhaarFile.name : 'Click to upload Aadhaar (PDF, JPG, PNG - Max 5MB)'}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PostPropertyPage;