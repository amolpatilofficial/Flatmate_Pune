import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Home, Mail, Lock, User, ShieldCheck, Key } from 'lucide-react';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Secret admin code
  const ADMIN_SECRET_CODE = 'amollrushalisanjeevpratibha';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.adminCode !== ADMIN_SECRET_CODE) {
      toast.error('Invalid admin secret code');
      setLoading(false);
      return;
    }

    // Mock registration - store in localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    if (users.find(u => u.email === formData.email)) {
      toast.error('Email already registered');
      setLoading(false);
      return;
    }

    const newAdmin = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    users.push(newAdmin);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    setTimeout(() => {
      const { password, ...userWithoutPassword } = newAdmin;
      register(userWithoutPassword);
      toast.success('Admin account created successfully!');
      navigate('/admin');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-12">
      <Card className="w-full max-w-md shadow-elegant-lg border-2 border-primary/20">
        <CardHeader className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center space-x-2 mx-auto">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Admin Registration</span>
          </div>
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>
            This area is restricted. Admin secret code required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Admin Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-primary font-semibold">Admin Secret Code *</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Enter admin secret code"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                  required
                  className="pl-10 border-primary/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Contact system administrator for the secret code</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Admin Account'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Already have an admin account? </span>
              <Link to="/admin/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
            <Link to="/" className="block text-muted-foreground hover:text-primary">
              <Home className="inline h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegisterPage;