import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Home, Mail, Lock, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login({ email, password });
    
    if (result && result.success && result.user && result.user.isAdmin) {
      toast.success('Welcome Admin!');
      navigate('/admin');
    } else {
      toast.error('Invalid admin credentials or not an admin account.');
      // if they weren't admin but still logged in, logout
      if (result && result.success && (!result.user || !result.user.isAdmin)) {
         // handle implicit session reset if needed
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-12">
      <Card className="w-full max-w-md shadow-elegant-lg border-2 border-primary/20">
        <CardHeader className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center space-x-2 mx-auto">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Admin Access</span>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            This area is restricted to administrators only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              <Home className="inline h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/register" className="text-sm text-primary hover:underline">
              Create Admin Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;