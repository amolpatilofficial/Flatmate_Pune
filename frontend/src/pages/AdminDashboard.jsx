import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { CheckCircle, XCircle, Trash2, MapPin, User, Phone, Mail } from 'lucide-react';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = () => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    setListings(allListings);
  };

  const handleApprove = (id) => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const updated = allListings.map(l => 
      l.id === id ? { ...l, status: 'approved' } : l
    );
    localStorage.setItem('propertyListings', JSON.stringify(updated));
    loadListings();
    toast.success('Listing approved successfully');
  };

  const handleReject = (id) => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const updated = allListings.map(l => 
      l.id === id ? { ...l, status: 'rejected' } : l
    );
    localStorage.setItem('propertyListings', JSON.stringify(updated));
    loadListings();
    toast.success('Listing rejected');
  };

  const handleDelete = (id) => {
    const allListings = JSON.parse(localStorage.getItem('propertyListings') || '[]');
    const updated = allListings.filter(l => l.id !== id);
    localStorage.setItem('propertyListings', JSON.stringify(updated));
    loadListings();
    toast.success('Listing deleted successfully');
    setDeleteId(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/20 text-warning',
      approved: 'bg-success/20 text-success',
      rejected: 'bg-destructive/20 text-destructive'
    };
    return colors[status] || colors.pending;
  };

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length
  };

  const ListingCard = ({ listing }) => (
    <Card className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300">
      <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
        <img 
          src={listing.image || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop`}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${getStatusColor(listing.status)}`}>
          {listing.status.toUpperCase()}
        </Badge>
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
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{listing.category.toUpperCase()}</Badge>
          <Badge variant="secondary">{listing.propertyType}</Badge>
          {listing.aadhaarUploaded && (
            <Badge className="bg-accent/20 text-accent">Aadhaar Verified</Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span>{listing.ownerName}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <span>{listing.ownerPhone}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{listing.ownerEmail}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {listing.status === 'pending' && (
            <>
              <Button 
                className="flex-1 bg-success hover:bg-success/90"
                onClick={() => handleApprove(listing.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive"
                className="flex-1"
                onClick={() => handleReject(listing.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {listing.status === 'approved' && (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => handleReject(listing.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          )}
          <Button 
            variant="destructive"
            size="icon"
            onClick={() => setDeleteId(listing.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage property listings and approvals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-warning mb-1">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-1">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-destructive mb-1">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({stats.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {listings.filter(l => l.status === 'pending').length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <p className="text-muted-foreground">No pending listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter(l => l.status === 'pending')
                  .map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {listings.filter(l => l.status === 'approved').length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <p className="text-muted-foreground">No approved listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter(l => l.status === 'approved')
                  .map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {listings.filter(l => l.status === 'rejected').length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <p className="text-muted-foreground">No rejected listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter(l => l.status === 'rejected')
                  .map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this property listing.
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

export default AdminDashboard;