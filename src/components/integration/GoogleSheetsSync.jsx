import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function GoogleSheetsSync() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const exportToSheets = async () => {
    setLoading(true);
    try {
      // This will require backend functions enabled
      toast.info('Backend functions required for Google Sheets integration');
      toast.info('Enable backend functions in app settings to use this feature');
    } catch (error) {
      toast.error('Failed to export to Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle>Google Sheets Integration</CardTitle>
            <CardDescription>Export disposal data to Google Sheets</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Spreadsheet URL (optional)</Label>
          <Input
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToSheets} disabled={loading} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Export to Sheets
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          ⚠️ Requires backend functions to be enabled in app settings
        </p>
      </CardContent>
    </Card>
  );
}