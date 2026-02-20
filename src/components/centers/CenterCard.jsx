import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CenterCard({ center, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shrink-0">
          <Droplet className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{center.name}</h3>
          
          <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{center.address}</span>
          </div>

          {center.operating_hours && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{center.operating_hours}</span>
            </div>
          )}

          {center.phone && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{center.phone}</span>
            </div>
          )}

          {center.accepts_types && center.accepts_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {center.accepts_types.map(type => (
                <Badge key={type} variant="secondary" className="text-xs bg-slate-100">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {center.latitude && center.longitude && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`https://maps.google.com/?q=${center.latitude},${center.longitude}`, '_blank')}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Directions
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          onClick={() => onSelect?.(center)}
        >
          <Droplet className="w-4 h-4 mr-1" />
          Dispose Here
        </Button>
      </div>
    </motion.div>
  );
}