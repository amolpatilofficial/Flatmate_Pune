import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { MapPin, Trash2, Plus, Eye, Briefcase, Calendar, IndianRupee } from 'lucide-react';

const MyFlatmateProfilePage = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = () => {
    const allProfiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
    const userProfiles = allProfiles.filter(p => p.userId === user?.id);
    setProfiles(userProfiles);
  };

  const handleDelete = (id) => {
    const allProfiles = JSON.parse(localStorage.getItem('flatmateProfiles') || '[]');
    const updated = allProfiles.filter(p => p.id !== id);
    localStorage.setItem('flatmateProfiles', JSON.stringify(updated));
    loadProfiles();
    toast.success('Profile deleted successfully');
    setDeleteId(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { text: 'Pending Approval', class: 'bg-warning/20 text-warning' },
      approved: { text: 'Approved', class: 'bg-success/20 text-success' },
      rejected: { text: 'Rejected', class: 'bg-destructive/20 text-destructive' }
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.class}>{config.text}</Badge>;
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Flatmate Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your flatmate-finding profile
            </p>
          </div>
          <Link to="/post-flatmate">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Post New Profile
            </Button>
          </Link>
        </div>

        {profiles.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No profile yet</h3>
              <p className="text-muted-foreground mb-6">Create your profile to find flatmates</p>
              <Link to="/post-flatmate">
                <Button className="bg-primary hover:bg-primary/90">
                  Create Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-elegant-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground truncate">
                        {profile.name}
                      </h3>
                      <div className="mt-2">
                        {getStatusBadge(profile.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {profile.age} years
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="truncate">{profile.occupation}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profile.preferredArea}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <IndianRupee className="h-4 w-4 mr-2" />
                      {profile.budget.toLocaleString()}/month
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getGenderColor(profile.gender)} variant="secondary">
                      {profile.gender === 'any' ? 'No Preference' : profile.gender}
                    </Badge>
                    {profile.hasPlace && (
                      <Badge variant="outline" className="text-xs">Has Place</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 p-6 pt-0">
                  <Link to={`/flatmate/${profile.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => setDeleteId(profile.id)}
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
              This action cannot be undone. This will permanently delete your profile.
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

export default MyFlatmateProfilePage;