import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Search, Bell, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Layout size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 hidden md:block font-display">Training Portal</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="border-blue-500 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <a href="#" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                My Courses
              </a>
              <a href="#" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Categories
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-64 pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
            </button>
            
            <div className="flex-shrink-0">
               <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200 cursor-pointer">
                 <User size={16} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;