import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface FormData {
  identifier: string; // email or username
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [, setAuthState] = useLocalStorage('pawtalk-auth', false);

  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'identifier':
        if (!value.trim()) return 'Email or username is required';
        // Check if it's email or username
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isUsername = /^[a-zA-Z0-9_-]{3,20}$/.test(value);
        if (!isEmail && !isUsername) {
          return 'Enter a valid email or username';
        }
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Authenticate
    setAuthState(true);
    setShowSuccess(true);

    // Redirect after brief success state
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = formData.identifier && formData.password;

  return (
    <div className="min-h-screen bg-background-primary text-text-primary relative overflow-hidden">
      {/* Ambient Soundwave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="soundwave-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>

          {/* Animated soundwaves */}
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.path
              key={index}
              d={`M 0 ${300 + index * 20} Q 150 ${280 + index * 20} 300 ${300 + index * 20} T 600 ${300 + index * 20} T 900 ${300 + index * 20} T 1200 ${300 + index * 20}`}
              stroke="#9333ea"
              strokeWidth="2"
              fill="none"
              filter="url(#soundwave-blur)"
              animate={{
                strokeDasharray: [0, 200],
                strokeDashoffset: [200, 0],
                opacity: [0.3, 0.1],
              }}
              transition={{
                duration: 8,
                delay: index * 0.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 flex flex-col">
        <div className="w-full max-w-md mx-auto flex flex-col h-full justify-between">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              They communicate.
              <br />
              <span className="text-accent-primary">We help you listen.</span>
            </h1>
            <p className="text-text-secondary text-sm mt-4">
              Sign in to continue understanding your pet.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="mb-8"
          >
            <Card animated={false}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email / Username */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                >
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none"
                    />
                    <input
                      type="text"
                      name="identifier"
                      placeholder="you@example.com or your_username"
                      value={formData.identifier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-secondary border
                        border-background-tertiary text-text-primary placeholder-text-tertiary
                        focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20
                        transition-all
                        ${errors.identifier && touched.identifier ? 'border-semantic-error' : ''}
                      `}
                    />
                  </div>
                  {errors.identifier && touched.identifier && (
                    <motion.p
                      className="mt-1.5 text-xs text-semantic-error flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.identifier}
                    </motion.p>
                  )}
                  {formData.identifier && !errors.identifier && touched.identifier && (
                    <motion.div
                      className="mt-1.5 flex items-center gap-1 text-xs text-semantic-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle size={14} />
                      <span>Valid</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-text-primary">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full pl-10 pr-12 py-2.5 rounded-lg bg-background-secondary border
                        border-background-tertiary text-text-primary placeholder-text-tertiary
                        focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20
                        transition-all
                        ${errors.password && touched.password ? 'border-semantic-error' : ''}
                      `}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                  {errors.password && touched.password && (
                    <motion.p
                      className="mt-1.5 text-xs text-semantic-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Forgot Password Link */}
                <motion.button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-accent-primary hover:text-accent-primaryLight transition-colors"
                  whileHover={{ x: 2 }}
                  whileTap={{ x: 0 }}
                >
                  Forgot password?
                </motion.button>

                {/* Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting || showSuccess}
                    disabled={isSubmitting || showSuccess || !isFormValid}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {showSuccess ? (
                      <>
                        <CheckCircle size={20} />
                        Welcome back!
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>

          {/* Create Account Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <p className="text-sm text-text-secondary">
              New here?{' '}
              <Link
                to="/create-account"
                className="text-accent-primary hover:text-accent-primaryLight transition-colors font-semibold"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowForgotPassword(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-full max-w-md"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Forgot Password Modal Component */
interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value) || !value ? '' : 'Enter a valid email');
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (!email) {
      setError('Email is required');
    } else if (!validateEmail(email)) {
      setError('Enter a valid email');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setError('Enter a valid email');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowSuccess(true);

    // Close after brief success state
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Card animated={false}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold mb-2">Reset password</h2>
        <p className="text-sm text-text-secondary mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@example.com"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched ? error : ''}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1"
              isLoading={isSubmitting || showSuccess}
              disabled={!email || isSubmitting}
            >
              {showSuccess ? 'Email sent!' : 'Send link'}
            </Button>
          </div>
        </form>

        {showSuccess && (
          <motion.div
            className="mt-4 p-3 bg-semantic-success bg-opacity-10 border border-semantic-success rounded-lg text-sm text-semantic-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Check your email for password reset instructions.
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};
