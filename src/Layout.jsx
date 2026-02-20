import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, MapPin, Droplet, Award, User, Shield, Heart, Mail } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: Home, path: 'Home' },
  { name: 'Centers', icon: MapPin, path: 'Centers' },
  { name: 'Log', icon: Droplet, path: 'LogDisposal' },
  { name: 'Rewards', icon: Award, path: 'Rewards' },
  { name: 'Profile', icon: User, path: 'Profile' }
];

export default function Layout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'Home';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(user => setIsAdmin(user?.role === 'admin'))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">OilRecycle</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map(item => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to={createPageUrl('Admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPath.startsWith('Admin')
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">{children}</main>

      {/* Footer */}
      <footer className="hidden md:block bg-white border-t border-slate-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">OilRecycle</span>
              </div>
              <p className="text-sm text-slate-600">
                Making oil disposal easy and rewarding for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Contact</h3>
              <div className="space-y-2">
                <a href="mailto:support@oilrecycle.com" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  support@oilrecycle.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <p>© 2026 OilRecycle. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for the environment
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-100' : ''}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}