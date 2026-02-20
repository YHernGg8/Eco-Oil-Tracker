import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GoogleSheetsSync from '@/components/integration/GoogleSheetsSync';
import EmailNotifications from '@/components/integration/EmailNotifications';

export default function Integrations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Profile')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Google Integrations</h1>
          <p className="text-slate-500">Connect with Google services</p>
        </div>

        <div className="grid gap-6">
          <GoogleSheetsSync />
          <EmailNotifications />
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Google Sheets and Gmail integrations require backend functions to be enabled. 
            Go to your app settings to enable backend functions, then you can connect your Google account.
          </p>
        </div>
      </div>
    </div>
  );
}