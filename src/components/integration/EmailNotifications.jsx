import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailNotifications() {
  const [notifications, setNotifications] = useState({
    disposalVerified: true,
    rewardRedeemed: true,
    weeklyReport: false
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.info('Backend functions required for Gmail integration');
    toast.info('Enable backend functions in app settings to use this feature');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Gmail Notifications</CardTitle>
            <CardDescription>Manage email notifications via Gmail</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="disposal">Disposal Verified</Label>
          <Switch
            id="disposal"
            checked={notifications.disposalVerified}
            onCheckedChange={() => handleToggle('disposalVerified')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="reward">Reward Redeemed</Label>
          <Switch
            id="reward"
            checked={notifications.rewardRedeemed}
            onCheckedChange={() => handleToggle('rewardRedeemed')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weekly">Weekly Report</Label>
          <Switch
            id="weekly"
            checked={notifications.weeklyReport}
            onCheckedChange={() => handleToggle('weeklyReport')}
          />
        </div>
        <p className="text-xs text-slate-500">
          ⚠️ Requires backend functions to be enabled in app settings
        </p>
      </CardContent>
    </Card>
  );
}