import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Droplet, Award, MapPin, Leaf } from 'lucide-react';

export default function WelcomeScreen() {
  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const features = [
    { icon: Droplet, title: 'Track Disposals', description: 'Log your used oil disposals easily' },
    { icon: Award, title: 'Earn Rewards', description: 'Get points for every disposal' },
    { icon: MapPin, title: 'Find Centers', description: 'Locate disposal centers near you' },
    { icon: Leaf, title: 'Help the Planet', description: 'See your environmental impact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6">
          <Droplet className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">OilRecycle</h1>
        <p className="text-slate-500 mb-8">
          Track your oil disposals, earn rewards, and help protect the environment.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-100 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-medium text-slate-900 text-sm">{feature.title}</p>
              <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleLogin}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg"
        >
          Get Started
        </Button>
        
        <p className="text-sm text-slate-400 mt-4">
          Sign in or create an account to start tracking
        </p>
      </motion.div>
    </div>
  );
}