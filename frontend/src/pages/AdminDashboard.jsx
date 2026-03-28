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
import { CheckCircle, XCircle, Trash2, MapPin, User, Phone, Mail, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

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

  // Prepare data for graphs
  const getCategoryData = () => {
    const pgCount = listings.filter(l => l.category === 'pg').length;
    const rentCount = listings.filter(l => l.category === 'rent').length;
    const sellCount = listings.filter(l => l.category === 'sell').length;
    
    return [
      { name: 'PG', value: pgCount, color: '#6366f1' },
      { name: 'Rent', value: rentCount, color: '#8b5cf6' },
      { name: 'Sell', value: sellCount, color: '#ec4899' }
    ];
  };

  const getStatusData = () => {
    return [
      { name: 'Pending', count: stats.pending, fill: '#f59e0b' },
      { name: 'Approved', count: stats.approved, fill: '#10b981' },
      { name: 'Rejected', count: stats.rejected, fill: '#ef4444' }
    ];
  };

  const getAreaData = () => {
    const areaCount = {};
    listings.forEach(listing => {
      areaCount[listing.area] = (areaCount[listing.area] || 0) + 1;
    });
    
    return Object.entries(areaCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const getTrendData = () => {
    // Group listings by date for trend analysis
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayListings = listings.filter(l => {
        const listingDate = new Date(l.createdAt).toISOString().split('T')[0];
        return listingDate === date;
      });

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: dayListings.length,
        approved: dayListings.filter(l => l.status === 'approved').length,
        pending: dayListings.filter(l => l.status === 'pending').length,
        rejected: dayListings.filter(l => l.status === 'rejected').length
      };
    });
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

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
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Listings</div>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-warning mb-1">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="h-12 w-12 bg-warning/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-success mb-1">{stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="h-12 w-12 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-destructive mb-1">{stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                <div className="h-12 w-12 bg-destructive/20 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Listings Trend Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Listings Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getTrendData()}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RPieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }} 
                  />
                  <Legend />
                </RPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getStatusData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }} 
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Area-wise Listings Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Top Areas by Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAreaData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis dataKey="area" type="category" stroke="#6b7280" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }} 
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {getAreaData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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