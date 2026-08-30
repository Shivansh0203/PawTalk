import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface FormData {
  identifier: string;
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

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'identifier':
        if (!value.trim()) return 'Email or username is required';
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAuthState(true);
    setShowSuccess(true);

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = formData.identifier && formData.password;

  return (
    <div className="min-h-screen bg-background-primary text-text-primary relative overflow-hidden">
      {/* Subtle gradient background - inspired by night sky */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary opacity-50 pointer-events-none" />

      {/* Feline-inspired accent: Subtle curved lines */}
      <div className="absolute top-20 right-0 w-96 h-96 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 50 30 Q 100 60 150 50 T 200 100"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-accent-primary"
          />
          <path
            d="M 30 80 Q 100 100 180 120"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-accent-primary"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen py-16 px-4 flex flex-col">
        <div className="w-full max-w-md mx-auto flex flex-col h-full justify-between">
          {/* Header - Oversized Typography */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-5xl font-bold mb-4 leading-tight tracking-tight">
              They communicate.
              <br />
              <motion.span
                className="text-accent-primary inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                We listen.
              </motion.span>
            </h1>
            <motion.p
              className="text-text-secondary text-sm mt-6 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome back to your companion's world.
            </motion.p>
          </motion.div>

          {/* Form Card - Premium styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="bg-background-tertiary border border-background-secondary rounded-xl p-8 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email / Username */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                >
                  <Input
                    label="Email or Username"
                    type="text"
                    name="identifier"
                    placeholder="you@example.com"
                    value={formData.identifier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.identifier ? errors.identifier : ''}
                  />
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-text-primary">Password</label>
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-accent-primary hover:text-accent-primaryLight transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </motion.button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full px-4 py-2.5 rounded-lg bg-background-secondary border
                      border-background-tertiary text-text-primary placeholder-text-tertiary
                      focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20
                      transition-all
                      ${errors.password && touched.password ? 'border-semantic-error' : ''}
                    `}
                  />
                  {errors.password && touched.password && (
                    <motion.p
                      className="mt-2 text-xs text-semantic-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Forgot Password Link */}
                <motion.button
                  type="button"
                  className="text-xs text-accent-primary hover:text-accent-primaryLight transition-colors font-medium"
                  whileHover={{ x: 2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Forgot password?
                </motion.button>

                {/* Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
                  className="pt-2"
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
                        Welcome
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
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            className="text-center border-t border-background-secondary pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
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
    </div>
  );
}
