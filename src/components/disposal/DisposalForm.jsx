import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Droplet, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const oilTypes = [
  { value: 'motor_oil', label: 'Motor Oil', points: 10 },
  { value: 'cooking_oil', label: 'Cooking Oil', points: 8 },
  { value: 'hydraulic_oil', label: 'Hydraulic Oil', points: 12 },
  { value: 'transmission_fluid', label: 'Transmission Fluid', points: 11 },
  { value: 'other', label: 'Other', points: 5 }
];

export default function DisposalForm({ centers, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    quantity_liters: '',
    oil_type: '',
    disposal_center_id: '',
    notes: '',
    photo_url: ''
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, photo_url: file_url }));
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const calculatePoints = () => {
    const oilType = oilTypes.find(t => t.value === formData.oil_type);
    const basePoints = oilType?.points || 5;
    return Math.round(parseFloat(formData.quantity_liters || 0) * basePoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantity_liters || !formData.oil_type || !formData.disposal_center_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const selectedCenter = centers.find(c => c.id === formData.disposal_center_id);
      const points = calculatePoints();

      await base44.entities.OilDisposal.create({
        ...formData,
        quantity_liters: parseFloat(formData.quantity_liters),
        disposal_center_name: selectedCenter?.name,
        points_earned: points,
        status: 'pending'
      });

      toast.success(`Disposal logged! You earned ${points} points`);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to log disposal');
    } finally {
      setLoading(false);
    }
  };

  const points = calculatePoints();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (Liters) *</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="e.g., 5"
            value={formData.quantity_liters}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity_liters: e.target.value }))}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="oil_type">Oil Type *</Label>
          <Select
            value={formData.oil_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, oil_type: value }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select oil type" />
            </SelectTrigger>
            <SelectContent>
              {oilTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} ({type.points} pts/L)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="center">Disposal Center *</Label>
        <Select
          value={formData.disposal_center_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, disposal_center_id: value }))}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select disposal center" />
          </SelectTrigger>
          <SelectContent>
            {centers.map(center => (
              <SelectItem key={center.id} value={center.id}>
                {center.name} - {center.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Photo Proof (Optional)</Label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-300 transition-colors">
          {formData.photo_url ? (
            <div className="space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="text-sm text-emerald-600">Photo uploaded</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
              >
                Remove
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              {uploading ? (
                <Loader2 className="w-8 h-8 mx-auto text-slate-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-slate-400" />
              )}
              <p className="mt-2 text-sm text-slate-500">
                {uploading ? 'Uploading...' : 'Click to upload photo'}
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      {points > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Droplet className="w-6 h-6" />
            <span>Points you'll earn</span>
          </div>
          <span className="text-2xl font-bold">+{points}</span>
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Droplet className="w-4 h-4 mr-2" />
            Log Disposal
          </>
        )}
      </Button>
    </motion.form>
  );
}