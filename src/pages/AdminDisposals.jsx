import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const oilTypeLabels = {
  motor_oil: 'Motor Oil',
  cooking_oil: 'Cooking Oil',
  hydraulic_oil: 'Hydraulic Oil',
  transmission_fluid: 'Transmission Fluid',
  other: 'Other'
};

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  verified: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Verified' },
  rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' }
};

export default function AdminDisposals() {
  const queryClient = useQueryClient();

  const { data: disposals = [], isLoading } = useQuery({
    queryKey: ['adminDisposals'],
    queryFn: () => base44.entities.OilDisposal.list('-created_date', 100)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.OilDisposal.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDisposals'] });
      toast.success('Status updated');
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Disposals</h1>
        <div className="text-sm text-slate-500">{disposals.length} total disposals</div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {disposals.map(disposal => {
            const status = statusConfig[disposal.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card key={disposal.id} className="border-slate-200">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {disposal.quantity_liters}L {oilTypeLabels[disposal.oil_type] || disposal.oil_type}
                        </h3>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {disposal.disposal_center_name || 'Unknown center'} • {disposal.created_by}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(disposal.created_date), 'MMM d, yyyy h:mm a')} • {disposal.points_earned} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={disposal.status}
                      onValueChange={(value) => updateMutation.mutate({ id: disposal.id, status: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}