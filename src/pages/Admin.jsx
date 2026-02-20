import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Gift, Droplet, Shield } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500">You don't have permission to access the admin panel.</p>
            <Link to={createPageUrl('Home')} className="text-emerald-600 hover:underline mt-4 block">
              Go to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminPages = [
    { name: 'AdminCenters', title: 'Disposal Centers', description: 'Add, edit, and manage disposal locations', icon: MapPin, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'AdminRewards', title: 'Rewards', description: 'Manage reward items and point values', icon: Gift, color: 'bg-purple-100 text-purple-600' },
    { name: 'AdminDisposals', title: 'Disposals', description: 'Review and verify user disposals', icon: Droplet, color: 'bg-blue-100 text-blue-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Manage your OilRecycle application</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {adminPages.map(page => (
          <Link key={page.name} to={createPageUrl(page.name)}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${page.color} flex items-center justify-center mb-2`}>
                  <page.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}