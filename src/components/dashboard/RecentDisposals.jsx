import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Droplet, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const oilTypeLabels = {
  motor_oil: 'Motor Oil',
  cooking_oil: 'Cooking Oil',
  hydraulic_oil: 'Hydraulic Oil',
  transmission_fluid: 'Transmission Fluid',
  other: 'Other'
};

const statusConfig = {
  pending: { icon: Loader2, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
  verified: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Verified' },
  rejected: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' }
};

export default function RecentDisposals({ disposals }) {
  if (!disposals || disposals.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Droplet className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No disposals yet</p>
        <p className="text-sm mt-1">Start logging your oil disposals to earn points!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {disposals.map((disposal, index) => {
        const status = statusConfig[disposal.status] || statusConfig.pending;
        const StatusIcon = status.icon;
        
        return (
          <motion.div
            key={disposal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
              <Droplet className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {disposal.quantity_liters}L {oilTypeLabels[disposal.oil_type]}
                </p>
                <Badge className={`${status.color} text-xs`}>
                  <StatusIcon className={`w-3 h-3 mr-1 ${disposal.status === 'pending' ? 'animate-spin' : ''}`} />
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {disposal.disposal_center_name || 'Unknown Center'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(disposal.created_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600">+{disposal.points_earned}</p>
              <p className="text-xs text-slate-500">points</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}