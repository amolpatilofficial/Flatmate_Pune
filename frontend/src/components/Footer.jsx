import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RoomMate<span className="text-primary">.</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your perfect flatmate or property in Pune. Simple, secure, and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse/pg" className="text-muted-foreground hover:text-primary transition-colors">
                  Find PG
                </Link>
              </li>
              <li>
                <Link to="/browse/rent" className="text-muted-foreground hover:text-primary transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/browse/sell" className="text-muted-foreground hover:text-primary transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="text-muted-foreground hover:text-primary transition-colors">
                  Post Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Help Center</li>
              <li className="text-muted-foreground">Safety Tips</li>
              <li className="text-muted-foreground">Terms of Service</li>
              <li className="text-muted-foreground">Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Pune, Maharashtra</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@roommate.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RoomMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};