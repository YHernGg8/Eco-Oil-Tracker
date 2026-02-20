import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCenters() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [form, setForm] = useState({
    name: '', address: '', latitude: '', longitude: '',
    operating_hours: '', phone: '', accepts_types: '', is_active: true
  });

  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['adminCenters'],
    queryFn: () => base44.entities.DisposalCenter.list()
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        accepts_types: data.accepts_types ? data.accepts_types.split(',').map(t => t.trim()) : []
      };
      return editingCenter
        ? base44.entities.DisposalCenter.update(editingCenter.id, payload)
        : base44.entities.DisposalCenter.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCenters'] });
      toast.success(editingCenter ? 'Center updated' : 'Center created');
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DisposalCenter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCenters'] });
      toast.success('Center deleted');
    }
  });

  const handleClose = () => {
    setOpen(false);
    setEditingCenter(null);
    setForm({ name: '', address: '', latitude: '', longitude: '', operating_hours: '', phone: '', accepts_types: '', is_active: true });
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setForm({
      name: center.name || '',
      address: center.address || '',
      latitude: center.latitude || '',
      longitude: center.longitude || '',
      operating_hours: center.operating_hours || '',
      phone: center.phone || '',
      accepts_types: center.accepts_types?.join(', ') || '',
      is_active: center.is_active !== false
    });
    setOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Disposal Centers</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Add Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCenter ? 'Edit Center' : 'Add New Center'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Address *</Label>
                <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Operating Hours</Label>
                <Input value={form.operating_hours} onChange={e => setForm({ ...form, operating_hours: e.target.value })} placeholder="Mon-Fri 9AM-5PM" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Accepts Types (comma separated)</Label>
                <Input value={form.accepts_types} onChange={e => setForm({ ...form, accepts_types: e.target.value })} placeholder="motor_oil, cooking_oil" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.name || !form.address}>
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
          {centers.map(center => (
            <Card key={center.id} className="border-slate-200">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{center.name}</h3>
                    <p className="text-sm text-slate-500">{center.address}</p>
                  </div>
                  {!center.is_active && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Inactive</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(center)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(center.id)}>
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