import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import api from '@/api';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bed, Bath, Wifi, Droplet, Tv, Wind, Search } from 'lucide-react';

const BrowseListingsPage = () => {
  const { category } = useParams();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/properties');
        const approved = res.data.filter(l => l.status === 'approved' && l.category === category);
        setListings(approved);
        setFilteredListings(approved);
      } catch (error) {
        console.error('Failed to load properties', error);
      }
    };
    fetchListings();
  }, [category]);

  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(l => l.area === areaFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, areaFilter, listings]);

  const categoryTitles = {
    pg: 'Paying Guest Accommodations',
    rent: 'Properties for Rent',
    sell: 'Properties for Sale'
  };

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="h-4 w-4" />,
      water: <Droplet className="h-4 w-4" />,
      tv: <Tv className="h-4 w-4" />,
      ac: <Wind className="h-4 w-4" />
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
            {categoryTitles[category]}
          </h1>
          <p className="text-muted-foreground">
            {filteredListings.length} properties available
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
            <Link to="/post-property">
              <Button className="bg-primary hover:bg-primary/90">
                Post Your Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="relative overflow-hidden">
                        <img 
                          src={listing.images?.[idx] || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop`}
                          alt={`${listing.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
                    {listing.propertyType}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-primary font-bold whitespace-nowrap ml-2">
                      ₹{listing.price.toLocaleString()}
                      {category !== 'sell' && <span className="text-sm font-normal">/mo</span>}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.area}, Pune
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.bedrooms && (
                      <Badge variant="secondary" className="text-xs">
                        <Bed className="h-3 w-3 mr-1" />
                        {listing.bedrooms} Bed
                      </Badge>
                    )}
                    {listing.bathrooms && (
                      <Badge variant="secondary" className="text-xs">
                        <Bath className="h-3 w-3 mr-1" />
                        {listing.bathrooms} Bath
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities?.slice(0, 4).map((amenity, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground">
                        {getAmenityIcon(amenity.toLowerCase())}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/property/${listing.id}`} className="w-full">
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      View Details
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

export default BrowseListingsPage;