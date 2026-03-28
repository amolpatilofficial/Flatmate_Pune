import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Home as HomeIcon, Bed } from 'lucide-react';

const BrowseFlatsPage = () => {
  const [flats, setFlats] = useState([]);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Load all approved listings
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const approvedFlats = allListings.filter(l => l.status === 'approved');
    setFlats(approvedFlats);
    setFilteredFlats(approvedFlats);
  }, []);

  useEffect(() => {
    let filtered = flats;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(flat =>
        flat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(flat => flat.area === selectedArea);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(flat => flat.category === selectedCategory);
    }

    setFilteredFlats(filtered);
  }, [searchTerm, selectedArea, selectedCategory, flats]);

  const areas = [...new Set(flats.map(f => f.area))].sort();

  const getCategoryBadge = (category) => {
    const colors = {
      pg: 'bg-blue-500/20 text-blue-500',
      rent: 'bg-purple-500/20 text-purple-500',
      sell: 'bg-pink-500/20 text-pink-500'
    };
    return colors[category] || colors.pg;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-background">
        {/* Header */}
        <div className="bg-gradient-hero py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Browse Available Flats in Pune
            </h1>
            <p className="text-muted-foreground">
              Find your perfect living space from {flats.length} verified listings
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, area, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Area Filter */}
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pg">PG / Hostel</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sell">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredFlats.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <HomeIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-2">No flats found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredFlats.length} {filteredFlats.length === 1 ? 'flat' : 'flats'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlats.map((flat) => (
                  <Card
                    key={flat.id}
                    className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/flat/${flat.id}`)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                      <img
                        src={flat.image || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop`}
                        alt={flat.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-3 right-3 ${getCategoryBadge(flat.category)}`}>
                        {flat.category.toUpperCase()}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
                          {flat.title}
                        </h3>
                        <span className="text-primary font-bold whitespace-nowrap">
                          ₹{flat.price.toLocaleString()}
                          {flat.category !== 'sell' && <span className="text-sm">/mo</span>}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {flat.area}, Pune
                      </div>
                      {flat.propertyType && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Bed className="h-4 w-4 mr-1" />
                          {flat.propertyType}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {flat.description}
                      </p>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA for listing owners */}
        <div className="bg-gradient-hero py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Have a Flat to Rent?
            </h2>
            <p className="text-muted-foreground mb-6">
              List your property and connect with verified tenants
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <HomeIcon className="mr-2 h-5 w-5" />
                List Your Flat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrowseFlatsPage;
