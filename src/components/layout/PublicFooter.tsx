
import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="py-12 px-6 border-t border-gray-800/50 bg-[#0A0B0D]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-24 w-auto"
              />
            </div>
            <p className="text-gray-400">
              Advanced Reputation Intelligence & Analysis
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Threat Detection</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Crisis Management</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Intelligence Reports</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/simon-lindsay" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Access</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/scan" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 A.R.I.A™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
