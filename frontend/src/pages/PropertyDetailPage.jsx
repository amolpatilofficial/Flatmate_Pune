import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  MapPin, Bed, Bath, Wifi, Droplet, Tv, Wind, Refrigerator, 
  Phone, Mail, User, Home, ArrowLeft, CheckCircle, Building2 
} from 'lucide-react';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const found = allListings.find(l => l.id === id);
    if (found) {
      setProperty(found);
    } else {
      toast.error('Property not found');
      navigate('/');
    }
  }, [id, navigate]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const amenityIcons = {
    'WiFi': <Wifi className="h-5 w-5" />,
    'Water': <Droplet className="h-5 w-5" />,
    'TV': <Tv className="h-5 w-5" />,
    'AC': <Wind className="h-5 w-5" />,
    'Fridge': <Refrigerator className="h-5 w-5" />
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
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
            <div className="aspect-video rounded-xl overflow-hidden shadow-elegant-lg">
              <img 
                src={property.image || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop`}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Location */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.area}, Pune</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{property.price.toLocaleString()}
                  </div>
                  {property.category !== 'sell' && (
                    <span className="text-muted-foreground">per month</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{property.category.toUpperCase()}</Badge>
                <Badge variant="outline">{property.propertyType}</Badge>
                {property.status === 'approved' && (
                  <Badge className="bg-success/10 text-success hover:bg-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Property Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.bedrooms && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Bed className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">{property.bedrooms}</div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {property.bathrooms && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Bath className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">{property.bathrooms}</div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                      <div className="font-semibold">{property.propertyType}</div>
                      <div className="text-sm text-muted-foreground">Type</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                    {amenityIcons[amenity] || <Home className="h-5 w-5" />}
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {property.lift !== undefined && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Building Features</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success mr-2" />
                      <span>Lift: {property.lift ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-elegant-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold">Contact Owner</h3>
                
                {showContact ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Owner Name</div>
                          <div className="font-medium">{property.ownerName || 'Property Owner'}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{property.ownerPhone}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium break-all">{property.ownerEmail}</div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={`tel:${property.ownerPhone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${property.ownerEmail}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Login to view contact details and connect with the property owner.
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
                    <strong>Safety Tip:</strong> Meet in person and verify property documents before making any payment.
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

export default PropertyDetailPage;