import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Search, ArrowLeft, Droplet, Map, List } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import CenterCard from '@/components/centers/CenterCard';

export default function Centers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: () => base44.entities.DisposalCenter.filter({ is_active: true })
  });

  const filteredCenters = centers.filter(center =>
    center.name?.toLowerCase().includes(search.toLowerCase()) ||
    center.address?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCenter = (center) => {
    navigate(createPageUrl('LogDisposal') + `?center=${center.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Disposal Centers</h1>
              <p className="text-slate-500">Find a center near you</p>
            </div>
          </div>
        </motion.div>

        {/* Search & View Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="h-12"
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              className="h-12"
            >
              <Map className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Centers Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="text-center py-16">
            <Droplet className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500">
              {search ? 'No centers match your search' : 'No disposal centers available'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CenterCard center={center} onSelect={handleSelectCenter} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
            <MapContainer
              center={[1.3521, 103.8198]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredCenters.filter(c => c.latitude && c.longitude).map(center => (
                <Marker key={center.id} position={[center.latitude, center.longitude]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-slate-900 mb-1">{center.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{center.address}</p>
                      {center.operating_hours && (
                        <p className="text-xs text-slate-500 mb-2">🕒 {center.operating_hours}</p>
                      )}
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleSelectCenter(center)}
                      >
                        Dispose Here
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}