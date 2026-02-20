import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Gift } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { value: 'discount', label: 'Discount' },
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'merchandise', label: 'Merchandise' },
  { value: 'donation', label: 'Donation' }
];

export default function AdminRewards() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', points_required: '', category: 'gift_card',
    image_url: '', stock: '', is_active: true
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['adminRewards'],
    queryFn: () => base44.entities.Reward.list()
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        points_required: parseInt(data.points_required) || 0,
        stock: data.stock ? parseInt(data.stock) : null
      };
      return editingReward
        ? base44.entities.Reward.update(editingReward.id, payload)
        : base44.entities.Reward.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      toast.success(editingReward ? 'Reward updated' : 'Reward created');
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Reward.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      toast.success('Reward deleted');
    }
  });

  const handleClose = () => {
    setOpen(false);
    setEditingReward(null);
    setForm({ title: '', description: '', points_required: '', category: 'gift_card', image_url: '', stock: '', is_active: true });
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setForm({
      title: reward.title || '',
      description: reward.description || '',
      points_required: reward.points_required || '',
      category: reward.category || 'gift_card',
      image_url: reward.image_url || '',
      stock: reward.stock || '',
      is_active: reward.is_active !== false
    });
    setOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Rewards</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Add Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingReward ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Points Required *</Label>
                  <Input type="number" value={form.points_required} onChange={e => setForm({ ...form, points_required: e.target.value })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label>Stock (leave empty for unlimited)</Label>
                <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.title || !form.points_required}>
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {rewards.map(reward => (
            <Card key={reward.id} className="border-slate-200">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{reward.title}</h3>
                    <p className="text-sm text-slate-500">{reward.points_required} pts • {reward.category}</p>
                  </div>
                  {!reward.is_active && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Inactive</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(reward)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(reward.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}