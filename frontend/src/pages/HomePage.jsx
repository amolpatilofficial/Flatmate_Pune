import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Home, Shield, CheckCircle, Users, Heart, MapPin } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Find Perfect Flatmates',
      description: 'Connect with verified people looking for flatmates in your area'
    },
    {
      icon: Home,
      title: 'Post Your Room',
      description: 'Have a spare room? Find the perfect flatmate to share your space'
    },
    {
      icon: Shield,
      title: 'Safe & Verified',
      description: 'All profiles verified by our admin team for your safety'
    },
    {
      icon: Heart,
      title: 'Perfect Match',
      description: 'Filter by lifestyle preferences to find compatible flatmates'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Users' },
    { value: '200+', label: 'Successful Matches' },
    { value: '15+', label: 'Areas in Pune' },
    { value: '24/7', label: 'Support' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Sign up and tell us about yourself and what you\'re looking for'
    },
    {
      step: '2',
      title: 'Browse Flatmates',
      description: 'Search through verified profiles and find compatible flatmates'
    },
    {
      step: '3',
      title: 'Connect & Move In',
      description: 'Contact directly and finalize your flatmate arrangement'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Pune's #1 Flatmate Finder
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              Find Your Perfect
              <span className="text-primary"> Flatmate</span> in
              <span className="text-accent"> Pune</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with compatible flatmates, share your space, or find the perfect room. Join hundreds of people finding their ideal living situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/find-flatmate">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Find Flatmates
                </Button>
              </Link>
              <Link to="/post-flatmate">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Home className="mr-2 h-5 w-5" />
                  Post Your Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your perfect flatmate in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <Card key={index} className="relative border-border bg-card text-center overflow-hidden group hover:shadow-elegant-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-full"></div>
                <CardContent className="p-8 relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
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
              We make finding your perfect flatmate simple, safe, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border bg-card hover:shadow-elegant-lg transition-all duration-300">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
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
          <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-border shadow-elegant-lg">
            <CardContent className="p-12 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ready to Find Your Perfect Flatmate?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of people who found their ideal living situation through RoomMate
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/find-flatmate">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    Browse Profiles
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