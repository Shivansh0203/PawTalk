import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  Camera,
  Calendar,
  Weight,
  Heart,
  Trash2,
  RotateCcw,
  Clock,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';
import { mockAnalysisResults, AnalysisResult } from '../../data/mockAnalysisResults';

interface PetProfile {
  name: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female' | 'Not specified';
  weight: string;
  image: string | null;
}

export default function MyAccountPage() {
  const [petProfile, setPetProfile] = useLocalStorage<PetProfile>('pawtalk-pet-profile', {
    name: 'Bruno',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    weight: '28 kg',
    image: null,
  });

  const [analysisHistory] = useLocalStorage('pawtalk-analysis-history', mockAnalysisResults);
  const [saveHistory, setSaveHistory] = useLocalStorage('pawtalk-save-history', true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(petProfile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEditChange = (field: keyof PetProfile, value: any) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveProfile = () => {
    setPetProfile(editedProfile);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedProfile(petProfile);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({ ...prev, image: reader.result as string }));
        setHasChanges(true);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearHistory = () => {
    // Clear history would be implemented with the backend
    setShowDeleteConfirm(false);
  };

  const emotionColors: Record<string, string> = {
    Happy: 'success',
    Curious: 'info',
    Playful: 'success',
    Stressed: 'warning',
    Afraid: 'error',
    Aggressive: 'error',
    Hungry: 'warning',
    Relaxed: 'info',
    Uncomfortable: 'warning',
    'Seeking attention': 'info',
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pb-32">
      {/* Header */}
      <motion.div
        className="pt-8 px-6 pb-4 border-b border-background-tertiary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Pet Profile</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage {petProfile.name}'s information and communication history.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Pet Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-background-tertiary border border-background-secondary rounded-xl overflow-hidden">
              {/* Pet Photo Section */}
              <div className="relative h-48 bg-gradient-to-b from-background-secondary to-background-tertiary overflow-hidden">
                {editedProfile.image ? (
                  <motion.img
                    src={editedProfile.image}
                    alt={editedProfile.name}
                    className="w-full h-full object-cover"
                    layoutId="pet-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Heart size={48} className="text-accent-primary opacity-30 mx-auto mb-2" />
                      <p className="text-sm text-text-tertiary">No photo yet</p>
                    </div>
                  </div>
                )}

                {/* Photo Actions Overlay */}
                <motion.div
                  className="absolute inset-0 bg-background-overlay opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
                  whileHover={{ opacity: 1 }}
                >
                  {isEditing && (
                    <motion.button
                      onClick={() => setShowImageUpload(true)}
                      className="bg-accent-primary text-neutral-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-accent-primaryLight transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Camera size={18} />
                      Change
                    </motion.button>
                  )}
                </motion.div>

                {/* Edit Button - Top Right */}
                {!isEditing && (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 bg-accent-primary text-neutral-white p-2 rounded-lg hover:bg-accent-primaryLight transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={20} />
                  </motion.button>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-text-primary">{petProfile.name}</h2>
                  )}
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Breed */}
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                      Breed
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.breed}
                        onChange={(e) => handleEditChange('breed', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20"
                      />
                    ) : (
                      <p className="text-base text-text-primary font-medium">{petProfile.breed}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                      Age
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProfile.age}
                        onChange={(e) => handleEditChange('age', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-text-secondary" />
                        <p className="text-base text-text-primary font-medium">{petProfile.age} years</p>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile.gender}
                        onChange={(e) => handleEditChange('gender', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Not specified</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="text-text-secondary" />
                        <p className="text-base text-text-primary font-medium">{petProfile.gender}</p>
                      </div>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                      Weight
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.weight}
                        onChange={(e) => handleEditChange('weight', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Weight size={18} className="text-text-secondary" />
                        <p className="text-base text-text-primary font-medium">{petProfile.weight}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <motion.div
                    className="flex gap-3 pt-4 border-t border-background-secondary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={!hasChanges}
                      onClick={handleSaveProfile}
                    >
                      <Save size={18} />
                      Save Changes
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* History Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-text-primary">Communication History</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Keep a record of {petProfile.name}'s interactions and communications.
                  </p>
                </div>
                <motion.button
                  onClick={() => setSaveHistory(!saveHistory)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${saveHistory ? 'bg-accent-primary' : 'bg-background-secondary'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
                    animate={{ x: saveHistory ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </motion.button>
              </div>
            </Card>
          </motion.div>

          {/* Analysis History Timeline */}
          {saveHistory && analysisHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Clock size={20} />
                  Communication Timeline
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {analysisHistory.length} {analysisHistory.length === 1 ? 'interaction' : 'interactions'} recorded
                </p>
              </div>

              <div className="space-y-4 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary to-background-tertiary opacity-30" />

                {/* Timeline items */}
                <AnimatePresence>
                  {analysisHistory.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                    >
                      <div className="pl-16 relative">
                        {/* Timeline dot */}
                        <motion.div
                          className="absolute left-0 top-2 w-4 h-4 rounded-full bg-accent-primary border-4 border-background-primary"
                          whileHover={{ scale: 1.3 }}
                        />

                        <div className="bg-background-tertiary border border-background-secondary rounded-lg p-4 hover:border-accent-primary transition-colors group">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                                {result.primaryEmotion}
                              </h4>
                              <p className="text-xs text-text-tertiary mt-1">
                                {new Date(result.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <Badge
                              label={`${result.confidence}% confident`}
                              variant={
                                result.confidence > 80
                                  ? 'success'
                                  : result.confidence > 60
                                  ? 'info'
                                  : 'warning'
                              }
                              size="sm"
                            />
                          </div>

                          <p className="text-sm text-text-secondary mb-3 italic">
                            "{result.interpretation}"
                          </p>

                          {/* Top emotions */}
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.emotions)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([emotion, value]) => (
                                <Badge
                                  key={emotion}
                                  label={`${emotion} ${value}%`}
                                  variant={
                                    emotionColors[emotion] as
                                      | 'default'
                                      | 'success'
                                      | 'warning'
                                      | 'error'
                                      | 'info'
                                  }
                                  size="sm"
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Clear History Button */}
              <motion.div
                className="mt-8 pt-6 border-t border-background-tertiary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button
                  variant="tertiary"
                  size="md"
                  className="text-semantic-error hover:text-semantic-error flex items-center gap-2"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={18} />
                  Clear History
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {saveHistory && analysisHistory.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Clock size={48} className="mx-auto text-text-tertiary opacity-30 mb-4" />
              <h3 className="font-semibold text-text-primary mb-2">No history yet</h3>
              <p className="text-sm text-text-secondary">
                Start analyzing {petProfile.name}'s communication to build a history.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <>
            <motion.div
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageUpload(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md bg-background-tertiary border border-background-secondary rounded-xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">Update Pet Photo</h3>
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-background-secondary rounded-lg cursor-pointer hover:border-accent-primary transition-colors">
                  <div className="text-center">
                    <Camera size={32} className="mx-auto text-text-secondary mb-2" />
                    <p className="text-sm text-text-secondary">Click to upload a new photo</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="mt-4 w-full py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete History Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md bg-background-tertiary border border-background-secondary rounded-xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-semantic-warning" />
                  <h3 className="text-lg font-bold">Clear History?</h3>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                  This will permanently delete all {analysisHistory.length} recorded interactions. This action cannot be
                  undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Keep History
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 bg-semantic-error hover:bg-opacity-90"
                    onClick={handleClearHistory}
                  >
                    <Trash2 size={18} />
                    Clear
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
