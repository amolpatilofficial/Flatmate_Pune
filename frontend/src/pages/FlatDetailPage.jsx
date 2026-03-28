import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, MapPin, Home as HomeIcon, Bed, Bath, Wifi, Tv, 
  Wind, Refrigerator, Droplets, User, Briefcase, Phone, Mail,
  Shield, CheckCircle
} from 'lucide-react';

const FlatDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Load flat details
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const flatData = allListings.find(l => l.id === id);
    
    if (flatData) {
      setFlat(flatData);
      
      // Load owner profile
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
      const owner = profiles.find(p => p.userId === flatData.ownerId);
      setOwnerProfile(owner);
    }
  }, [id]);

  const handleViewContact = () => {
    if (!user) {
      toast.error('Please sign up or login to view contact details');
      navigate('/register');
      return;
    }

    // Check if user has a profile
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
    const userProfile = profiles.find(p => p.userId === user.id);
    
    if (!userProfile) {
      toast.error('Please complete your profile first');
      navigate('/create-profile');
      return;
    }

    setShowContact(true);
  };

  if (!flat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const amenityIcons = {
    WiFi: Wifi,
    TV: Tv,
    AC: Wind,
    Fridge: Refrigerator,
    Water: Droplets
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={flat.image || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop`}
                    alt={flat.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {flat.category.toUpperCase()}
                  </Badge>
                </div>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl mb-2">{flat.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{flat.address}, {flat.area}, Pune</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        ₹{flat.price.toLocaleString()}
                      </div>
                      {flat.category !== 'sell' && (
                        <div className="text-sm text-muted-foreground">per month</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Type & Details */}
                  <div className="flex flex-wrap gap-4">
                    {flat.propertyType && (
                      <div className="flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="font-medium">{flat.propertyType}</span>
                      </div>
                    )}
                    {flat.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{flat.bedrooms} Bedrooms</span>
                      </div>
                    )}
                    {flat.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{flat.bathrooms} Bathrooms</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {flat.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  {flat.amenities && flat.amenities.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {flat.amenities.map((amenity) => {
                            const Icon = amenityIcons[amenity] || CheckCircle;
                            return (
                              <div key={amenity} className="flex items-center">
                                <Icon className="h-4 w-4 mr-2 text-primary" />
                                <span>{amenity}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Additional Info */}
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    {flat.lift !== undefined && (
                      <div>
                        <span className="text-sm text-muted-foreground">Lift Available</span>
                        <p className="font-medium">{flat.lift ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                    {flat.waterType && (
                      <div>
                        <span className="text-sm text-muted-foreground">Water Type</span>
                        <p className="font-medium capitalize">{flat.waterType}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Property Owner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ownerProfile ? (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                        <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{flat.ownerName}</p>
                          <p className="text-sm text-muted-foreground">{ownerProfile.occupation}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Age & Gender</p>
                            <p className="font-medium">{ownerProfile.age} years, {ownerProfile.gender}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Preferred Area</p>
                            <p className="font-medium">{ownerProfile.area}</p>
                          </div>
                        </div>

                        {ownerProfile.bio && (
                          <div className="flex items-start gap-2">
                            <Shield className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">About</p>
                              <p className="text-sm">{ownerProfile.bio}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Badge className="w-full justify-center bg-success/20 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Profile
                      </Badge>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                        <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{flat.ownerName}</p>
                          <p className="text-sm text-muted-foreground">Property Owner</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Contact Details */}
                  {showContact ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="font-medium">{flat.ownerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{flat.ownerEmail}</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => window.location.href = `tel:${flat.ownerPhone}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleViewContact}
                    >
                      View Contact Details
                    </Button>
                  )}

                  {!user && (
                    <p className="text-xs text-center text-muted-foreground">
                      Sign up to view owner's contact information
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Safety Note */}
              <Card className="bg-warning/10 border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-warning mt-1" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Safety Tips</p>
                      <ul className="text-muted-foreground space-y-1 list-disc list-inside text-xs">
                        <li>Verify property documents</li>
                        <li>Meet in person before payment</li>
                        <li>Check owner verification badge</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlatDetailPage;
