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
import { User, Briefcase, MapPin, IndianRupee, Calendar } from 'lucide-react';

const PostFlatmatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: 'male',
    occupation: '',
    preferredArea: '',
    budget: '',
    hasPlace: false,
    lookingFor: 'any',
    vegetarian: false,
    smoking: false,
    drinking: false,
    petFriendly: false,
    description: '',
    phone: ''
  });

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

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

    const newProfile = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age),
      budget: parseInt(formData.budget),
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
            <CardTitle className="text-3xl">Post Your Flatmate Profile</CardTitle>
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

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Accommodation Preferences</h3>
                
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasPlace"
                    checked={formData.hasPlace}
                    onCheckedChange={(checked) => setFormData({...formData, hasPlace: checked})}
                  />
                  <Label htmlFor="hasPlace" className="font-normal cursor-pointer">
                    I already have a place (looking for someone to share)
                  </Label>
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