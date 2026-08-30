import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  Type,
  Palette,
  Volume2,
  Music,
  Eye,
  Zap,
  Globe,
  HardDrive,
  Info,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Settings {
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  accentColor: 'violet' | 'blue' | 'green';
  voiceOutput: boolean;
  soundEffects: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  saveHistory: boolean;
  language: 'en' | 'es' | 'fr' | 'de';
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, children }) => (
  <div className="flex items-start justify-between py-4 border-b border-background-secondary last:border-b-0">
    <div className="flex items-start gap-4 flex-1">
      <div className="text-accent-primary mt-1">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      </div>
    </div>
    <div className="ml-4">{children}</div>
  </div>
);

const Toggle: React.FC<{ enabled: boolean; onChange: (value: boolean) => void }> = ({
  enabled,
  onChange,
}) => (
  <motion.button
    onClick={() => onChange(!enabled)}
    className={`
      relative w-12 h-7 rounded-full transition-colors flex-shrink-0
      ${enabled ? 'bg-accent-primary' : 'bg-background-secondary'}
    `}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
      animate={{ x: enabled ? 20 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  </motion.button>
);

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<Settings>('pawtalk-settings', {
    theme: 'dark',
    fontSize: 'medium',
    accentColor: 'violet',
    voiceOutput: false,
    soundEffects: true,
    reduceMotion: false,
    highContrast: false,
    saveHistory: true,
    language: 'en',
  });

  const [showAbout, setShowAbout] = useState(false);
  const [showClearCache, setShowClearCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearCache = () => {
    // Clear localStorage items related to app data (but not settings)
    localStorage.removeItem('pawtalk-auth');
    localStorage.removeItem('pawtalk-current-result');
    localStorage.removeItem('pawtalk-analysis-history');
    setCacheCleared(true);
    setTimeout(() => {
      setShowClearCache(false);
      setCacheCleared(false);
    }, 2000);
  };

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  const accentColorMap = {
    violet: 'text-violet-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
  };

  return (
    <div className={`min-h-screen bg-background-primary text-text-primary pb-32 ${fontSizeClass}`}>
      {/* Header */}
      <motion.div
        className="pt-8 px-6 pb-4 border-b border-background-tertiary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-text-secondary mt-1">Customize your PawTalk experience.</p>
        </div>
      </motion.div>

      {/* Settings Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Eye size={20} />
              Display
            </h2>
            <Card animated={false}>
              {/* Theme */}
              <SettingItem
                icon={<Palette size={20} />}
                title="Theme"
                description="Choose your preferred color scheme"
              >
                <div className="flex gap-2">
                  {(['dark', 'light'] as const).map((theme) => (
                    <motion.button
                      key={theme}
                      onClick={() => handleSettingChange('theme', theme)}
                      className={`
                        px-4 py-2 rounded-lg font-semibold capitalize transition-all text-sm
                        ${
                          settings.theme === theme
                            ? 'bg-accent-primary text-neutral-white'
                            : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {theme}
                    </motion.button>
                  ))}
                </div>
              </SettingItem>

              {/* Font Size */}
              <SettingItem
                icon={<Type size={20} />}
                title="Font Size"
                description="Adjust text size for better readability"
              >
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => handleSettingChange('fontSize', size)}
                      className={`
                        px-3 py-2 rounded-lg font-semibold capitalize transition-all text-xs
                        ${
                          settings.fontSize === size
                            ? 'bg-accent-primary text-neutral-white'
                            : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size[0].toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </SettingItem>

              {/* Accent Color */}
              <SettingItem
                icon={<Palette size={20} />}
                title="Accent Color"
                description="Choose your preferred accent color"
              >
                <div className="flex gap-3">
                  {(['violet', 'blue', 'green'] as const).map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => handleSettingChange('accentColor', color)}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${
                          color === 'violet'
                            ? 'bg-violet-500 border-violet-400'
                            : color === 'blue'
                            ? 'bg-blue-500 border-blue-400'
                            : 'bg-green-500 border-green-400'
                        }
                        ${settings.accentColor === color ? 'border-white scale-110' : 'border-transparent'}
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {settings.accentColor === color && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <Check size={16} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </SettingItem>

              {/* High Contrast */}
              <SettingItem
                icon={<Eye size={20} />}
                title="High Contrast"
                description="Increase contrast for better visibility"
              >
                <Toggle
                  enabled={settings.highContrast}
                  onChange={(value) => handleSettingChange('highContrast', value)}
                />
              </SettingItem>

              {/* Reduce Motion */}
              <SettingItem
                icon={<Zap size={20} />}
                title="Reduce Motion"
                description="Minimize animations and transitions"
              >
                <Toggle
                  enabled={settings.reduceMotion}
                  onChange={(value) => handleSettingChange('reduceMotion', value)}
                />
              </SettingItem>
            </Card>
          </motion.div>

          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Volume2 size={20} />
              Audio
            </h2>
            <Card animated={false}>
              {/* Voice Output */}
              <SettingItem
                icon={<Volume2 size={20} />}
                title="Voice Output"
                description="Enable text-to-speech for interpretations"
              >
                <Toggle
                  enabled={settings.voiceOutput}
                  onChange={(value) => handleSettingChange('voiceOutput', value)}
                />
              </SettingItem>

              {/* Sound Effects */}
              <SettingItem
                icon={<Music size={20} />}
                title="Sound Effects"
                description="Enable feedback sounds"
              >
                <Toggle
                  enabled={settings.soundEffects}
                  onChange={(value) => handleSettingChange('soundEffects', value)}
                />
              </SettingItem>
            </Card>
          </motion.div>

          {/* Data Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <HardDrive size={20} />
              Data & Privacy
            </h2>
            <Card animated={false}>
              {/* Save History */}
              <SettingItem
                icon={<HardDrive size={20} />}
                title="Save Communication History"
                description="Keep a record of analysis and interactions"
              >
                <Toggle
                  enabled={settings.saveHistory}
                  onChange={(value) => handleSettingChange('saveHistory', value)}
                />
              </SettingItem>

              {/* Clear Cache */}
              <SettingItem
                icon={<HardDrive size={20} />}
                title="Clear Cache"
                description="Remove temporary data to free up space"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowClearCache(true)}
                  className="text-xs"
                >
                  Clear
                </Button>
              </SettingItem>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Globe size={20} />
              Preferences
            </h2>
            <Card animated={false}>
              {/* Language */}
              <SettingItem
                icon={<Globe size={20} />}
                title="Language"
                description="Choose your preferred language"
              >
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange('language', e.target.value as Settings['language'])
                  }
                  className="px-3 py-2 rounded-lg bg-background-secondary border border-background-tertiary text-text-primary focus:outline-none focus:border-accent-primary text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </SettingItem>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          >
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowAbout(true)}
              className="w-full justify-between text-text-primary hover:text-accent-primary"
            >
              <span className="flex items-center gap-3">
                <Info size={20} />
                About PawTalk
              </span>
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Clear Cache Confirmation Modal */}
      <AnimatePresence>
        {showClearCache && (
          <>
            <motion.div
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearCache(false)}
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
                  <h3 className="text-lg font-bold">Clear Cache?</h3>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                  This will remove temporary data and session information. Your settings and pet profile will be
                  preserved.
                </p>

                {cacheCleared && (
                  <motion.div
                    className="mb-4 p-3 bg-semantic-success bg-opacity-10 border border-semantic-success rounded-lg text-sm text-semantic-success flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check size={18} />
                    Cache cleared successfully
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setShowClearCache(false)}
                    disabled={cacheCleared}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={handleClearCache}
                    disabled={cacheCleared}
                  >
                    {cacheCleared ? 'Cleared' : 'Clear'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <>
            <motion.div
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
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
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">PawTalk</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    AI-powered Animal Communication Interpreter
                  </p>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>
                      <span className="font-semibold text-text-primary">Version:</span> 1.0.0
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Built for:</span> AI Unleashed by
                      Technothon Club
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-background-secondary rounded-lg border border-background-tertiary">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    PawTalk uses artificial intelligence to analyze animal communication patterns through audio,
                    video, images, and behavioral cues. Interpretations are probabilistic and should not be
                    considered veterinary advice.
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-xs text-text-tertiary">© 2024 PawTalk. All rights reserved.</p>
                  <p className="text-xs text-text-tertiary">
                    Privacy Policy • Terms of Service • Documentation
                  </p>
                </div>

                <Button variant="secondary" size="md" className="w-full" onClick={() => setShowAbout(false)}>
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
