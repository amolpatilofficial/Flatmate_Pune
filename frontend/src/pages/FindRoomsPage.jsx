import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Home, Bed, Bath, Wifi, IndianRupee, Search } from 'lucide-react';

const FindRoomsPage = () => {
  const [roomListings, setRoomListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    // Load only profiles where people HAVE a place to share (hasPlace: true)
    const profiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
    const roomsAvailable = profiles.filter(p => p.status === 'approved' && p.hasPlace === true);
    setRoomListings(roomsAvailable);
    setFilteredListings(roomsAvailable);
  };

  useEffect(() => {
    let filtered = roomListings;

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.preferredArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.roomType === roomTypeFilter);
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(r => r.preferredArea === areaFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, roomTypeFilter, areaFilter, roomListings]);

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi className="h-4 w-4" />,
    };
    return icons[amenity] || null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Available Rooms in Pune
          </h1>
          <p className="text-muted-foreground">
            {filteredListings.length} rooms available for rent
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by area or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pg">PG (Paying Guest)</SelectItem>
                <SelectItem value="rent">Rental Property</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {puneAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CTA for posting */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Have a Spare Room?
              </h3>
              <p className="text-muted-foreground">
                Post your room and find the perfect flatmate
              </p>
            </div>
            <Link to="/post-flatmate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                Post Your Room
              </Button>
            </Link>
          </div>
        </div>

        {/* Room Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or be the first to post</p>
            <Link to="/post-flatmate">
              <Button className="bg-primary hover:bg-primary/90">
                Post Your Room
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1">
                {/* Room Photo */}
                <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  {room.roomPhotos && room.roomPhotos.length > 0 ? (
                    <img 
                      src={room.roomPhotos[0].url}
                      alt="Room"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    {room.roomType === 'pg' ? 'PG' : 'Rental'}
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Price & Location */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl font-bold text-primary">
                        ₹{room.budget.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{room.preferredArea}, Pune</span>
                    </div>
                    {room.address && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{room.address}</p>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="flex flex-wrap gap-2">
                    {room.bedrooms && (
                      <Badge variant="secondary" className="text-xs">
                        <Bed className="h-3 w-3 mr-1" />
                        {room.bedrooms} Bed
                      </Badge>
                    )}
                    {room.bathrooms && (
                      <Badge variant="secondary" className="text-xs">
                        <Bath className="h-3 w-3 mr-1" />
                        {room.bathrooms} Bath
                      </Badge>
                    )}
                    {room.lift && (
                      <Badge variant="outline" className="text-xs">Lift</Badge>
                    )}
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <div key={idx} className="flex items-center text-xs text-muted-foreground">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </div>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{room.amenities.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Posted by */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Posted by</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Avatar className="h-10 w-10 border-2 border-background">
                        {room.profilePhoto ? (
                          <img src={room.profilePhoto} alt={room.name} className="w-full h-full object-cover" />
                        ) : (
                          <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                            {room.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{room.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {room.lookingFor === 'any' ? 'Any' : room.lookingFor}
                          </Badge>
                          {room.vegetarian && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                              Veg
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Link to={`/room/${room.id}`} className="flex-1">
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      View Room
                    </Button>
                  </Link>
                  <Link to={`/person/${room.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Person
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FindRoomsPage;