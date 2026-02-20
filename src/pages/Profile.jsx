import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Mail, Calendar, Droplet, Award, LogOut, Settings } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: disposals = [] } = useQuery({
    queryKey: ['myDisposals'],
    queryFn: () => base44.entities.OilDisposal.filter({ created_by: user?.email }),
    enabled: !!user?.email
  });

  const { data: redemptions = [] } = useQuery({
    queryKey: ['myRedemptions'],
    queryFn: () => base44.entities.RewardRedemption.filter({ created_by: user?.email }),
    enabled: !!user?.email
  });

  const totalPoints = disposals
    .filter(d => d.status === 'verified')
    .reduce((sum, d) => sum + (d.points_earned || 0), 0);
  const spentPoints = redemptions.reduce((sum, r) => sum + (r.points_spent || 0), 0);
  const availablePoints = totalPoints - spentPoints;
  const totalLiters = disposals.reduce((sum, d) => sum + (d.quantity_liters || 0), 0);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white mb-4">
                <span className="text-3xl font-bold">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{user?.full_name || 'User'}</h1>
              <p className="text-slate-500 flex items-center justify-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              {user?.created_date && (
                <p className="text-sm text-slate-400 flex items-center justify-center gap-1 mt-2">
                  <Calendar className="w-3 h-3" />
                  Member since {format(new Date(user.created_date), 'MMMM yyyy')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Available Points</p>
                    <p className="font-semibold text-slate-900">{availablePoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Oil Disposed</p>
                    <p className="font-semibold text-slate-900">{totalLiters.toFixed(1)} liters</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Points Earned</p>
                    <p className="font-semibold text-slate-900">{totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to={createPageUrl('Integrations')} className="flex-1">
              <Button variant="outline" className="w-full border-slate-200">
                <Settings className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}