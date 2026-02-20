import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplet, Award, MapPin, Plus, ArrowRight, TrendingUp } from 'lucide-react';

import StatsCard from '@/components/dashboard/StatsCard';
import RecentDisposals from '@/components/dashboard/RecentDisposals';
import ImpactSection from '@/components/dashboard/ImpactSection';
import WelcomeScreen from '@/components/auth/WelcomeScreen';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const { data: disposals = [], isLoading: loadingDisposals } = useQuery({
    queryKey: ['myDisposals', user?.email],
    queryFn: () => base44.entities.OilDisposal.filter({ created_by: user?.email }, '-created_date', 10),
    enabled: !!user?.email
  });

  const { data: redemptions = [] } = useQuery({
    queryKey: ['myRedemptions', user?.email],
    queryFn: () => base44.entities.RewardRedemption.filter({ created_by: user?.email }),
    enabled: !!user?.email
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-pulse">
          <Droplet className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  const totalPoints = disposals
    .filter(d => d.status === 'verified')
    .reduce((sum, d) => sum + (d.points_earned || 0), 0);

  const pendingPoints = disposals
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + (d.points_earned || 0), 0);

  const spentPoints = redemptions.reduce((sum, r) => sum + (r.points_spent || 0), 0);
  const availablePoints = totalPoints - spentPoints;

  const totalLiters = disposals.reduce((sum, d) => sum + (d.quantity_liters || 0), 0);
  const totalDisposals = disposals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Track your oil disposals and earn rewards</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Link to={createPageUrl('LogDisposal')}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 text-sm sm:text-base h-9 sm:h-10">
              <Plus className="w-4 h-4 mr-2" />
              Log Disposal
            </Button>
          </Link>
          <Link to={createPageUrl('Centers')}>
            <Button variant="outline" className="border-slate-200 text-sm sm:text-base h-9 sm:h-10">
              <MapPin className="w-4 h-4 mr-2" />
              Find Centers
            </Button>
          </Link>
          <Link to={createPageUrl('Rewards')}>
            <Button variant="outline" className="border-slate-200 text-sm sm:text-base h-9 sm:h-10">
              <Award className="w-4 h-4 mr-2" />
              Rewards
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard
            title="Available Points"
            value={availablePoints.toLocaleString()}
            subtitle={pendingPoints > 0 ? `+${pendingPoints} pending` : undefined}
            icon={Award}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatsCard
            title="Total Oil Disposed"
            value={`${totalLiters.toFixed(1)}L`}
            subtitle={`${totalDisposals} disposals`}
            icon={Droplet}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatsCard
            title="Points Earned"
            value={totalPoints.toLocaleString()}
            subtitle="All time"
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Disposals */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Disposals</CardTitle>
                <Link to={createPageUrl('History')}>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loadingDisposals ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <RecentDisposals disposals={disposals.slice(0, 5)} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Environmental Impact */}
          <div>
            <ImpactSection totalLiters={totalLiters} />
          </div>
        </div>
      </div>
    </div>
  );
}