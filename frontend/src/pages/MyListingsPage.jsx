import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { MapPin, Trash2, Plus, Eye } from 'lucide-react';

const MyListingsPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadListings();
  }, [user]);

  const loadListings = () => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const userListings = allListings.filter(l => l.ownerId === user?.id);
    setListings(userListings);
  };

  const handleDelete = (id) => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const updated = allListings.filter(l => l.id !== id);
    localStorage.setItem('propertyListings', JSON.stringify(updated));
    loadListings();
    toast.success('Listing deleted successfully');
    setDeleteId(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'secondary', text: 'Pending Approval', class: 'bg-warning/20 text-warning' },
      approved: { variant: 'default', text: 'Approved', class: 'bg-success/20 text-success' },
      rejected: { variant: 'destructive', text: 'Rejected', class: 'bg-destructive/20 text-destructive' }
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.class}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Listings
            </h1>
            <p className="text-muted-foreground">
              Manage your property listings
            </p>
          </div>
          <Link to="/post-property">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Post New Property
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">Start by posting your first property</p>
              <Link to="/post-property">
                <Button className="bg-primary hover:bg-primary/90">
                  Post Your First Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <img 
                    src={listing.image || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop`}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(listing.status)}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-primary font-bold whitespace-nowrap ml-2">
                      ₹{listing.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.area}, Pune
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{listing.category.toUpperCase()}</Badge>
                    <Badge variant="secondary">{listing.propertyType}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link to={`/property/${listing.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => setDeleteId(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default MyListingsPage;