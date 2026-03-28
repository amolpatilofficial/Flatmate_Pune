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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Briefcase, Phone, MapPin, FileText } from 'lucide-react';

const CreateProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    occupation: '',
    phone: '',
    city: 'Pune',
    area: '',
    bio: '',
    hasRoom: 'no' // Default: user doesn't have a room to rent
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.age || !formData.gender || !formData.occupation || !formData.phone || !formData.area) {
      toast.error('Please fill all required fields');
      return;
    }

    // Save profile to localStorage
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
    
    const newProfile = {
      id: `profile-${user.id}`,
      userId: user.id,
      userEmail: user.email,
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Remove existing profile for this user if any
    const updatedProfiles = profiles.filter(p => p.userId !== user.id);
    updatedProfiles.push(newProfile);
    
    localStorage.setItem('userProfiles', JSON.stringify(updatedProfiles));

    toast.success('Profile created successfully!');
    
    // Redirect based on whether they have a room to rent
    if (formData.hasRoom === 'yes') {
      navigate('/post-property');
    } else {
      navigate('/browse-flats');
    }
  };

  const puneAreas = [
    'Hinjewadi', 'Koregaon Park', 'Baner', 'Viman Nagar', 'Aundh', 
    'Kharadi', 'Wakad', 'Kothrud', 'Shivajinagar', 'Deccan', 
    'Pimpri', 'Chinchwad', 'Hadapsar', 'Magarpatta', 'Undri'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gradient-hero py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Create Your Profile</CardTitle>
              <CardDescription className="text-base">
                Let's set up your profile to help others know you better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({...formData, gender: value})}
                      className="flex gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      placeholder="e.g., Software Engineer, Student, etc."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="10-digit mobile number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <Label htmlFor="area">Preferred Area in Pune *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.area}
                      onValueChange={(value) => setFormData({...formData, area: value})}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {puneAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell others about yourself, your interests, lifestyle preferences..."
                      className="pl-10 min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Do you have a room to rent? */}
                <div className="space-y-3 bg-secondary/30 p-4 rounded-lg">
                  <Label className="text-base font-semibold">Do you have a room/flat to rent out?</Label>
                  <RadioGroup
                    value={formData.hasRoom}
                    onValueChange={(value) => setFormData({...formData, hasRoom: value})}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="hasRoom-yes" />
                      <Label htmlFor="hasRoom-yes" className="cursor-pointer">
                        Yes, I want to list my property
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hasRoom-no" />
                      <Label htmlFor="hasRoom-no" className="cursor-pointer">
                        No, I'm looking for a room
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    {formData.hasRoom === 'yes' 
                      ? "You'll be redirected to post your property after creating your profile"
                      : "You'll be able to browse available rooms after creating your profile"
                    }
                  </p>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                  Create Profile & Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateProfilePage;
