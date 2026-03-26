import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  MapPin, Briefcase, Calendar, Home, Phone, Mail, User, ArrowLeft,
  IndianRupee, CheckCircle, X
} from 'lucide-react';

const FlatmateDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
    const found = profiles.find(p => p.id === id);
    if (found) {
      setProfile(found);
    } else {
      toast.error('Profile not found');
      navigate('/find-flatmate');
    }
  }, [id, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleViewContact = () => {
    if (!user) {
      toast.error('Please login to view contact details');
      navigate('/login');
      return;
    }
    setShowContact(true);
    toast.success('Contact details revealed');
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-700' : 
           gender === 'female' ? 'bg-pink-100 text-pink-700' : 
           'bg-purple-100 text-purple-700';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profiles
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="shadow-elegant-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getGenderColor(profile.gender)}>
                        {profile.gender === 'any' ? 'No Preference' : profile.gender}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {profile.age} years
                      </Badge>
                      {profile.status === 'approved' && (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{profile.occupation}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.preferredArea}, Pune</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.description}
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Preferences */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Budget</div>
                      <div className="font-semibold">₹{profile.budget.toLocaleString()}/month</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Looking for</div>
                      <div className="font-semibold">
                        {profile.lookingFor === 'any' ? 'Any Gender' : profile.lookingFor}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Accommodation</div>
                      <div className="font-semibold">
                        {profile.hasPlace ? 'Has place' : 'Looking for place'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Preferred Area</div>
                      <div className="font-semibold">{profile.preferredArea}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Lifestyle */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Lifestyle</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                    {profile.vegetarian ? (
                      <CheckCircle className="h-6 w-6 text-success mb-2" />
                    ) : (
                      <X className="h-6 w-6 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm font-medium">Vegetarian</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                    {profile.smoking ? (
                      <CheckCircle className="h-6 w-6 text-warning mb-2" />
                    ) : (
                      <X className="h-6 w-6 text-success mb-2" />
                    )}
                    <span className="text-sm font-medium">Smoking</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                    {profile.drinking ? (
                      <CheckCircle className="h-6 w-6 text-warning mb-2" />
                    ) : (
                      <X className="h-6 w-6 text-success mb-2" />
                    )}
                    <span className="text-sm font-medium">Drinking</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                    {profile.petFriendly ? (
                      <CheckCircle className="h-6 w-6 text-success mb-2" />
                    ) : (
                      <X className="h-6 w-6 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm font-medium">Pet Friendly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-elegant-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold">Contact</h3>
                
                {showContact ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Name</div>
                          <div className="font-medium">{profile.name}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{profile.phone}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium break-all">{profile.userEmail}</div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={`tel:${profile.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${profile.userEmail}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Login to view contact details and connect with this person.
                    </p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleViewContact}
                    >
                      View Contact Details
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Safety Tip:</strong> Always meet in a public place and verify identity before sharing personal information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlatmateDetailPage;