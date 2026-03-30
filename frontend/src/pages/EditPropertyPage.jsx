import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import api from '@/api';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const EditPropertyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
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
    ownerPhone: '',
    images: []
  });

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const amenitiesList = ['WiFi', 'TV', 'AC', 'Fridge', 'Water'];
  
  const propertyTypes = {
    pg: ['Single Room', 'Double Sharing', 'Triple Sharing'],
    private_flat: ['1 BHK', '2 BHK', '3 BHK', 'Studio']
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get('/properties');
        const found = res.data.find(p => p.id === id);
        
        if (!found) {
          toast.error('Listing not found');
          navigate('/my-listings');
          return;
        }

        if (found.ownerId !== user?.id) {
          toast.error('You do not have permission to edit this listing');
          navigate('/my-listings');
          return;
        }

        setFormData({
          category: found.category || 'pg',
          title: found.title || '',
          description: found.description || '',
          propertyType: found.propertyType || '',
          area: found.area || '',
          address: found.address || '',
          price: found.price || '',
          bedrooms: found.bedrooms || '',
          bathrooms: found.bathrooms || '',
          amenities: found.amenities || [],
          lift: found.lift || false,
          waterType: found.waterType || 'tap',
          ownerPhone: found.ownerPhone || '',
          images: found.images || []
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load listing');
        navigate('/my-listings');
      } finally {
        setFetching(false);
      }
    };

    if (user?.id) {
      fetchListing();
    }
  }, [id, user, navigate]);

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.ownerPhone || formData.ownerPhone.toString().length < 10) {
      toast.error('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    const updatedListing = {
      id: id,
      ...formData,
      price: parseInt(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
      ownerPhone: formData.ownerPhone,
      status: 'pending', // re-approve upon edit
      createdAt: new Date().toISOString(), // Optional: can keep old if we fetch it
      aadhaarUploaded: false
    };

    try {
      await api.put(`/properties/${id}`, updatedListing);
      toast.success('Property updated successfully! Sent for admin re-approval.');
      navigate('/my-listings');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading listing details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <Card className="shadow-elegant-lg border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Edit Property Listing</CardTitle>
            <CardDescription>
              Update your listing details. Note that changes will require admin re-approval.
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
                    <SelectItem value="pg">PG</SelectItem>
                    <SelectItem value="private_flat">Private Flat</SelectItem>
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
                  Price * (per month)
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
              {formData.category === 'private_flat' && (
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

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/my-listings')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default EditPropertyPage;