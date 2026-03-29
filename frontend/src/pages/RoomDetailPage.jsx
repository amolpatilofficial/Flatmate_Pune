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
  MapPin, Bed, Bath, Wifi, Droplet, Tv, Wind, Refrigerator,
  Phone, Mail, User, ArrowLeft, CheckCircle, Home, IndianRupee, Calendar
} from 'lucide-react';

const RoomDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
    const found = profiles.find(p => p.id === id && p.role === 'flat_owner');
    if (found) {
      setRoom(found);
    } else {
      toast.error('Room not found');
      navigate('/find-rooms');
    }
  }, [id, navigate]);

  if (!room) {
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          Back to Rooms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - ROOM DETAILS FIRST */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Photos Gallery */}
            {room.roomPhotos && room.roomPhotos.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-elegant-lg">
                  <img 
                    src={room.roomPhotos[0].url}
                    alt="Room main"
                    className="w-full h-full object-cover"
                  />
                </div>
                {room.roomPhotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {room.roomPhotos.slice(1, 5).map((photo, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={photo.url}
                          alt={`Room ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Room Title & Location */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {room.roomType === 'pg' ? 'PG' : 'Rental'} Room in {room.preferredArea}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{room.address || room.preferredArea}, Pune</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{room.budget.toLocaleString()}
                  </div>
                  <span className="text-muted-foreground">per month</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {room.roomType === 'pg' ? 'PG' : 'Rental Property'}
                </Badge>
                {room.status === 'approved' && (
                  <Badge className="bg-success/10 text-success hover:bg-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Room Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this Room</h2>
              <p className="text-muted-foreground leading-relaxed">
                {room.description}
              </p>
            </div>

            <Separator />

            {/* Room Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Room Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.bedrooms && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Bed className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">{room.bedrooms}</div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {room.bathrooms && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Bath className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">{room.bathrooms}</div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    <div>
                      <div className="font-semibold">₹{room.budget.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Monthly Rent</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                        {amenityIcons[amenity] || <Home className="h-5 w-5" />}
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Building Features */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Building Features</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  {room.lift ? (
                    <CheckCircle className="h-5 w-5 text-success mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-muted-foreground mr-2" />
                  )}
                  <span>Lift: {room.lift ? 'Available' : 'Not Available'}</span>
                </div>
                <div className="flex items-center">
                  <Droplet className="h-5 w-5 text-primary mr-2" />
                  <span>Water: {room.waterType === 'ro' ? 'RO Purifier' : room.waterType === 'both' ? 'Tap + RO' : 'Tap Water'}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Room Owner Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About the Owner</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                        {getInitials(room.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {room.age} years old
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          {room.occupation}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">
                          Looking for: {room.lookingFor === 'any' ? 'Any Gender' : room.lookingFor}
                        </Badge>
                        {room.vegetarian && (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            Vegetarian
                          </Badge>
                        )}
                        {!room.smoking && (
                          <Badge variant="outline">No Smoking</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                          <div className="font-medium">{room.name}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{room.phone}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium break-all">{room.userEmail}</div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <a href={`tel:${room.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Owner
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${room.userEmail}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Login to view contact details and connect with the room owner.
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
                    <strong>Safety Tip:</strong> Meet in person and verify the room before making any payment.
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

export default RoomDetailPage;
