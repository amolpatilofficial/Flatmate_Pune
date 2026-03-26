import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Home, Shield, CheckCircle, Users, Building, Bed } from 'lucide-react';

const HomePage = () => {
  const categories = [
    {
      title: 'Paying Guest',
      description: 'Comfortable PG accommodations with amenities',
      icon: Bed,
      link: '/browse/pg',
      color: 'text-primary'
    },
    {
      title: 'Rent',
      description: 'Find flats and houses for rent',
      icon: Home,
      link: '/browse/rent',
      color: 'text-accent'
    },
    {
      title: 'Buy/Sell',
      description: 'Properties for sale in Pune',
      icon: Building,
      link: '/browse/sell',
      color: 'text-success'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All properties verified by our admin team for your safety'
    },
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find properties with detailed filters and amenities'
    },
    {
      icon: Users,
      title: 'Direct Contact',
      description: 'Connect directly with property owners and flatmates'
    },
    {
      icon: CheckCircle,
      title: 'No Hidden Charges',
      description: 'Transparent platform with no hidden fees'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Listings' },
    { value: '1000+', label: 'Happy Users' },
    { value: '50+', label: 'Areas Covered' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="px-4 py-1.5">
              Pune's #1 Flatmate Finder
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Find Your Perfect
              <span className="text-primary"> Home</span> in Pune
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with flatmates, discover verified PG accommodations, rental properties, and homes for sale across Pune.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/browse/pg">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Listings
                </Button>
              </Link>
              <Link to="/post-property">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Post Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What are you looking for?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our three main categories to find exactly what you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link key={index} to={category.link}>
                  <Card className="h-full transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1 border-border">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                        <IconComponent className={`h-8 w-8 ${category.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                      <Button variant="ghost" className="mt-4">
                        Explore <span className="ml-2">→</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose RoomMate?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make finding your perfect home simple, safe, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border bg-card">
                  <CardContent className="p-6 space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-border shadow-elegant-lg">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ready to Find Your Perfect Space?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of happy users who found their ideal home through RoomMate
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/browse/pg">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Listings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;