import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Droplet, Gift, MapPin, Clock, CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const oilTypeLabels = {
  motor_oil: 'Motor Oil',
  cooking_oil: 'Cooking Oil',
  hydraulic_oil: 'Hydraulic Oil',
  transmission_fluid: 'Transmission Fluid',
  other: 'Other'
};

const statusConfig = {
  pending: { icon: Loader2, color: 'bg-amber-100 text-amber-700', spin: true },
  verified: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  rejected: { icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  fulfilled: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-700' }
};

export default function History() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('disposals');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: disposals = [], isLoading: loadingDisposals } = useQuery({
    queryKey: ['myDisposals'],
    queryFn: () => base44.entities.OilDisposal.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const { data: redemptions = [], isLoading: loadingRedemptions } = useQuery({
    queryKey: ['myRedemptions'],
    queryFn: () => base44.entities.RewardRedemption.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900">History</h1>
          <p className="text-slate-500">View your past disposals and redemptions</p>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full bg-white border border-slate-200 mb-6">
            <TabsTrigger value="disposals" className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Droplet className="w-4 h-4 mr-2" />
              Disposals
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />
              Redemptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disposals">
            {loadingDisposals ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : disposals.length === 0 ? (
              <div className="text-center py-16">
                <Droplet className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <p className="text-slate-500">No disposals yet</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-3">
                  {disposals.map((disposal, index) => {
                    const status = statusConfig[disposal.status];
                    const StatusIcon = status?.icon || Loader2;
                    
                    return (
                      <motion.div
                        key={disposal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shrink-0">
                            <Droplet className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900">
                                {disposal.quantity_liters}L {oilTypeLabels[disposal.oil_type]}
                              </p>
                              <Badge className={`${status?.color} text-xs`}>
                                <StatusIcon className={`w-3 h-3 mr-1 ${status?.spin ? 'animate-spin' : ''}`} />
                                {disposal.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {disposal.disposal_center_name || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(disposal.created_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`text-lg font-bold ${disposal.status === 'verified' ? 'text-emerald-600' : 'text-slate-400'}`}>
                              +{disposal.points_earned}
                            </p>
                            <p className="text-xs text-slate-500">points</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>

          <TabsContent value="redemptions">
            {loadingRedemptions ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : redemptions.length === 0 ? (
              <div className="text-center py-16">
                <Gift className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <p className="text-slate-500">No redemptions yet</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-3">
                  {redemptions.map((redemption, index) => {
                    const status = statusConfig[redemption.status];
                    const StatusIcon = status?.icon || Loader2;
                    
                    return (
                      <motion.div
                        key={redemption.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                            <Gift className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900">{redemption.reward_title}</p>
                              <Badge className={`${status?.color} text-xs`}>
                                <StatusIcon className={`w-3 h-3 mr-1 ${status?.spin ? 'animate-spin' : ''}`} />
                                {redemption.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(redemption.created_date), 'MMM d, yyyy')}
                              </span>
                              {redemption.redemption_code && (
                                <button
                                  onClick={() => copyCode(redemption.redemption_code)}
                                  className="flex items-center gap-1 font-mono bg-slate-100 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors"
                                >
                                  {redemption.redemption_code}
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-600">-{redemption.points_spent}</p>
                            <p className="text-xs text-slate-500">points</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}