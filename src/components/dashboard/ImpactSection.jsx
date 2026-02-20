import { motion } from 'framer-motion';
import { Leaf, Fish, Droplets, TreePine } from 'lucide-react';

export default function ImpactSection({ totalLiters }) {
  // Environmental impact calculations (estimated)
  const waterSaved = Math.round(totalLiters * 1000); // 1L oil can contaminate 1000L water
  const co2Saved = Math.round(totalLiters * 2.5); // kg of CO2
  const treesEquivalent = Math.round(totalLiters * 0.1);

  const impacts = [
    {
      icon: Droplets,
      value: waterSaved.toLocaleString(),
      unit: 'L',
      label: 'Water Protected',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Leaf,
      value: co2Saved.toLocaleString(),
      unit: 'kg',
      label: 'CO₂ Prevented',
      color: 'from-emerald-400 to-green-500'
    },
    {
      icon: TreePine,
      value: treesEquivalent,
      unit: '',
      label: 'Trees Equivalent',
      color: 'from-teal-400 to-emerald-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Fish className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold">Your Environmental Impact</h3>
          <p className="text-sm text-slate-400">Every drop counts</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {impacts.map((impact, index) => (
          <motion.div
            key={impact.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${impact.color} flex items-center justify-center mb-3`}>
              <impact.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">
              {impact.value}
              <span className="text-sm font-normal text-slate-400">{impact.unit}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">{impact.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}