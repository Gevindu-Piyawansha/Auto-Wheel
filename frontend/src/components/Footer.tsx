import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, LogIn } from 'lucide-react';

interface FooterProps {
  onLoginClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLoginClick }) => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">AutoWheel</h3>
            <p className="text-sm mb-4">
              JP Direct Import from Japan to Sri Lanka | Free Delivery | Best Prices | Leasing Available
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+94 77 744 4976</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@autowheel.lk</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
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
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 AutoWheel. All rights reserved.</p>
          <button
            onClick={onLoginClick}
            className="mt-4 md:mt-0 flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs"
          >
            <LogIn className="w-3 h-3" />
            Admin Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
