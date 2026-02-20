import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Tag, ShoppingBag, Heart, Loader2 } from 'lucide-react';

const categoryIcons = {
  discount: Tag,
  gift_card: Gift,
  merchandise: ShoppingBag,
  donation: Heart
};

const categoryColors = {
  discount: 'bg-purple-100 text-purple-700',
  gift_card: 'bg-amber-100 text-amber-700',
  merchandise: 'bg-blue-100 text-blue-700',
  donation: 'bg-rose-100 text-rose-700'
};

export default function RewardCard({ reward, userPoints, onRedeem, redeeming }) {
  const Icon = categoryIcons[reward.category] || Gift;
  const canAfford = userPoints >= reward.points_required;
  const outOfStock = reward.stock !== undefined && reward.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative">
        {reward.image_url ? (
          <img
            src={reward.image_url}
            alt={reward.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-16 h-16 text-slate-300" />
        )}
        <Badge className={`absolute top-3 right-3 ${categoryColors[reward.category]}`}>
          {reward.category?.replace('_', ' ')}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900">{reward.title}</h3>
        {reward.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{reward.description}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-2xl font-bold text-emerald-600">
              {reward.points_required.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">points</p>
          </div>

          <Button
            onClick={() => onRedeem(reward)}
            disabled={!canAfford || outOfStock || redeeming === reward.id}
            className={`${
              canAfford && !outOfStock
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {redeeming === reward.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : outOfStock ? (
              'Out of Stock'
            ) : canAfford ? (
              'Redeem'
            ) : (
              'Need More Points'
            )}
          </Button>
        </div>

        {reward.stock !== undefined && reward.stock > 0 && (
          <p className="text-xs text-slate-400 mt-2">
            {reward.stock} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}