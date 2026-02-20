import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Award, Gift, Tag, ShoppingBag, Heart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import RewardCard from '@/components/rewards/RewardCard';

const categories = [
  { value: 'all', label: 'All', icon: Gift },
  { value: 'discount', label: 'Discounts', icon: Tag },
  { value: 'gift_card', label: 'Gift Cards', icon: Gift },
  { value: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
  { value: 'donation', label: 'Donations', icon: Heart }
];

export default function Rewards() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [successDialog, setSuccessDialog] = useState(null);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => base44.entities.Reward.filter({ is_active: true })
  });

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

  const filteredRewards = category === 'all'
    ? rewards
    : rewards.filter(r => r.category === category);

  const redeemMutation = useMutation({
    mutationFn: async (reward) => {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      return base44.entities.RewardRedemption.create({
        reward_id: reward.id,
        reward_title: reward.title,
        points_spent: reward.points_required,
        redemption_code: code,
        status: 'pending'
      });
    },
    onSuccess: (data, reward) => {
      queryClient.invalidateQueries({ queryKey: ['myRedemptions'] });
      setConfirmDialog(null);
      setSuccessDialog({ reward, code: data.redemption_code });
      toast.success('Reward redeemed successfully!');
    },
    onError: () => {
      toast.error('Failed to redeem reward');
    },
    onSettled: () => {
      setRedeeming(null);
    }
  });

  const handleRedeem = (reward) => {
    if (availablePoints < reward.points_required) {
      toast.error('Not enough points');
      return;
    }
    setConfirmDialog(reward);
  };

  const confirmRedeem = () => {
    if (!confirmDialog) return;
    setRedeeming(confirmDialog.id);
    redeemMutation.mutate(confirmDialog);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Rewards Store</h1>
              <p className="text-slate-500">Redeem your points for rewards</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl px-6 py-3 text-white">
            <p className="text-sm opacity-80">Available Points</p>
            <p className="text-2xl font-bold">{availablePoints.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={setCategory} className="mb-6">
          <TabsList className="bg-white border border-slate-200">
            {categories.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value} className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <cat.icon className="w-4 h-4 mr-1.5" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Rewards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500">No rewards available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RewardCard
                  reward={reward}
                  userPoints={availablePoints}
                  onRedeem={handleRedeem}
                  redeeming={redeeming}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem "{confirmDialog?.title}" for {confirmDialog?.points_required?.toLocaleString()} points?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
              onClick={confirmRedeem}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!successDialog} onOpenChange={() => setSuccessDialog(null)}>
        <DialogContent className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl">Reward Redeemed!</DialogTitle>
          <DialogDescription className="space-y-4">
            <p>You've successfully redeemed "{successDialog?.reward?.title}"</p>
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-sm text-slate-500">Your redemption code</p>
              <p className="text-2xl font-mono font-bold text-slate-900">{successDialog?.code}</p>
            </div>
            <p className="text-sm">Save this code to claim your reward</p>
          </DialogDescription>
          <Button onClick={() => setSuccessDialog(null)} className="mt-4">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}