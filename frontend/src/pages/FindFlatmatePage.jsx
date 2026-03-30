import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, User, Briefcase, Calendar, Home, Search, Filter } from 'lucide-react';

const FindFlatmatePage = () => {
  const [flatmateProfiles, setFlatmateProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const res = await api.get('/profiles');
      const approved = res.data.filter(p => p.status === 'approved');
      setFlatmateProfiles(approved);
      setFilteredProfiles(approved);
    } catch (e) {
      console.error('Failed to load profiles', e);
    }
  };

  useEffect(() => {
    let filtered = flatmateProfiles;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.preferredArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.occupation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(p => p.gender === genderFilter);
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(p => p.preferredArea === areaFilter);
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, genderFilter, areaFilter, flatmateProfiles]);

  const puneAreas = [
    'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner',
    'Aundh', 'Wakad', 'Pimple Saudagar', 'Kothrud', 'Karve Nagar',
    'Deccan', 'Shivajinagar', 'Camp', 'Hadapsar', 'Magarpatta'
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-700' : 
           gender === 'female' ? 'bg-pink-100 text-pink-700' : 
           'bg-purple-100 text-purple-700';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Find Your Perfect Flatmate
          </h1>
          <p className="text-muted-foreground">
            {filteredProfiles.length} people looking for flatmates in Pune
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, area, or occupation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="any">Any</SelectItem>
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
                Looking for a Flatmate?
              </h3>
              <p className="text-muted-foreground">
                Create your profile and connect with potential flatmates
              </p>
            </div>
            <Link to="/post-flatmate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                Post Your Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No profiles found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or be the first to post</p>
            <Link to="/post-flatmate">
              <Button className="bg-primary hover:bg-primary/90">
                Post Your Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-br from-secondary/50 to-muted/30">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground truncate">
                        {profile.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {profile.age} years
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getGenderColor(profile.gender)}>
                      {profile.gender === 'any' ? 'No Preference' : profile.gender}
                    </Badge>
                    {profile.vegetarian && (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Vegetarian
                      </Badge>
                    )}
                    {!profile.smoking && !profile.drinking && (
                      <Badge variant="outline">No Smoking/Drinking</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{profile.occupation}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{profile.preferredArea}, Pune</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>₹{profile.budget.toLocaleString()}/month</span>
                    </div>
                  </div>

                  {profile.role === 'flat_owner' && (
                    <div className="bg-success/10 text-success text-xs p-2 rounded-md">
                      Already has accommodation
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link to={`/flatmate/${profile.id}`} className="w-full">
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      View Profile
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

export default FindFlatmatePage;