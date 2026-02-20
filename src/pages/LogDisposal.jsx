import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Droplet, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import DisposalForm from '@/components/disposal/DisposalForm';

export default function LogDisposal() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: () => base44.entities.DisposalCenter.filter({ is_active: true })
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Disposal Logged!</h1>
          <p className="text-slate-500 mb-6">
            Your disposal has been submitted and is pending verification. Points will be added once verified.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Log Another
            </Button>
            <Link to={createPageUrl('Home')}>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Log Oil Disposal</CardTitle>
              <CardDescription>
                Record your used oil disposal to earn reward points
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading centers...</div>
              ) : centers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No disposal centers available yet.</p>
                  <Link to={createPageUrl('Centers')}>
                    <Button variant="outline">View Centers</Button>
                  </Link>
                </div>
              ) : (
                <DisposalForm
                  centers={centers}
                  onSuccess={() => setSubmitted(true)}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}