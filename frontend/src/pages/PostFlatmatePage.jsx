import React, { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { User, Briefcase, MapPin, IndianRupee, Calendar, Upload, X } from 'lucide-react';

const PostFlatmatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomPhotos, setRoomPhotos] = useState([]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: 'male',
    occupation: '',
    preferredArea: '',
    budget: '',
    hasPlace: false,
    roomType: 'pg', // pg or rent
    lookingFor: 'any',
    vegetarian: false,
    smoking: false,
    drinking: false,
    petFriendly: false,
    // Room details (if hasPlace)
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    lift: false,
    waterType: 'tap',
    address: '',
    description: '',
    phone: ''
  });

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

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each photo should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          url: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setRoomPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      toast.error('Please enter a valid age (18-100)');
      setLoading(false);
      return;
    }

    // If user has a place, photos are mandatory
    if (formData.hasPlace && roomPhotos.length === 0) {
      toast.error('Please upload at least one photo of your room');
      setLoading(false);
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age),
      budget: parseInt(formData.budget),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      roomPhotos: roomPhotos,
      userId: user.id,
      userEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      const existingProfiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
      existingProfiles.push(newProfile);
      localStorage.setItem('flatmateProfiles', JSON.stringify(existingProfiles));
      
      toast.success('Profile posted successfully! Waiting for admin approval.');
      navigate('/my-flatmate-profile');
      setLoading(false);
    }, 1000);
  };

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
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasPlace"
                    checked={formData.hasPlace}
                    onCheckedChange={(checked) => setFormData({...formData, hasPlace: checked})}
                  />
                  <Label htmlFor="hasPlace" className="font-normal cursor-pointer text-base">
                    I already have a place and looking for a flatmate to share
                  </Label>
                </div>

                {formData.hasPlace && (
                  <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border border-border">
                    <h4 className="font-semibold text-accent">Room Details</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roomType">Type of Accommodation *</Label>
                      <RadioGroup value={formData.roomType} onValueChange={(value) => setFormData({...formData, roomType: value})}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pg" id="pg" />
                            <Label htmlFor="pg" className="font-normal cursor-pointer">PG (Paying Guest)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rent" id="rent" />
                            <Label htmlFor="rent" className="font-normal cursor-pointer">Rental Property</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

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
                                alt={photo.name}
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
                        required={formData.hasPlace}
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
