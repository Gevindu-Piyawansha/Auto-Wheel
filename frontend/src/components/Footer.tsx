import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, LogIn, Settings, LogOut } from 'lucide-react';

interface FooterProps {
  onLoginClick: () => void;
  isAdminLoggedIn?: boolean;
  onAdminPanelClick?: () => void;
  onLogoutClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onLoginClick, 
  isAdminLoggedIn = false,
  onAdminPanelClick,
  onLogoutClick
}) => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-base font-bold mb-2">AutoWheel</h3>
            <p className="text-xs mb-3">
              JP Direct Import from Japan to Sri Lanka | Free Delivery | Best Prices | Leasing Available
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">Contact Us</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>+94 77 744 4976</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>info@autowheel.lk</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Browse Cars</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Financing</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-4 pt-3 flex flex-col md:flex-row justify-between items-center text-xs gap-2">
          <p>&copy; 2025 AutoWheel. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <>
                <button
                  onClick={onAdminPanelClick}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs"
                >
                  <Settings className="w-3 h-3" />
                  Admin Panel
                </button>
                <button
                  onClick={onLogoutClick}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs"
              >
                <LogIn className="w-3 h-3" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
