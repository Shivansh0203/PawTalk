import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { PetImageUpload } from '../../components/auth/PetImageUpload';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface FormData {
  petName: string;
  userEmail: string;
  userId: string;
  password: string;
  confirmPassword: string;
  breed: string;
  petImage: string | null;
}

interface FormErrors {
  [key: string]: string;
}

const POPULAR_BREEDS = [
  'Labrador Retriever',
  'Golden Retriever',
  'German Shepherd',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Yorkshire Terrier',
  'Cat - Domestic Shorthair',
  'Cat - Siamese',
  'Cat - Persian',
  'Rabbit',
  'Hamster',
  'Parrot',
  'Other',
];

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [, setAuthState] = useLocalStorage('pawtalk-auth', false);
  const [, setPetName] = useLocalStorage('pawtalk-pet-name', 'Bruno');
  const [, setPetImage] = useLocalStorage('pawtalk-pet-image', '');

  const [formData, setFormData] = useState<FormData>({
    petName: '',
    userEmail: '',
    userId: '',
    password: '',
    confirmPassword: '',
    breed: '',
    petImage: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'petName':
        if (!value.trim()) return 'Pet name is required';
        if (value.length < 2) return 'Pet name must be at least 2 characters';
        if (value.length > 30) return 'Pet name must be less than 30 characters';
        return '';

      case 'userEmail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';

      case 'userId':
        if (!value.trim()) return 'User ID is required';
        if (value.length < 3) return 'User ID must be at least 3 characters';
        if (value.length > 20) return 'User ID must be less than 20 characters';
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'User ID can only contain letters, numbers, _ and -';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain a number';
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      case 'breed':
        if (!value.trim()) return 'Please select a breed';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handlePetImageUpload = (imageData: string) => {
    setFormData((prev) => ({ ...prev, petImage: imageData }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'petImage') {
        const error = validateField(key, formData[key as keyof FormData] as string);
        if (error) newErrors[key] = error;
      }
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

    // Store data in localStorage
    setAuthState(true);
    setPetName(formData.petName);
    if (formData.petImage) {
      setPetImage(formData.petImage);
    }

    setShowSuccess(true);

    // Redirect after brief success state
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = Object.keys(formData).every((key) => {
    if (key === 'petImage') return true;
    return formData[key as keyof FormData];
  });

  return (
    <div className="min-h-screen bg-background-primary text-text-primary py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h1 className="text-3xl font-bold mb-2">Meet your companion.</h1>
          <p className="text-text-secondary text-sm">
            Tell us about your pet and create your PawTalk account.
          </p>
        </motion.div>

        {/* Form Card */}
        <Card className="mt-8" animated={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Image Upload */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
            >
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Pet Photo
              </label>
              <PetImageUpload
                onImageUpload={handlePetImageUpload}
                currentImage={formData.petImage}
              />
              <p className="text-xs text-text-tertiary mt-2">
                Upload a clear photo of your pet for better analysis.
              </p>
            </motion.div>

            {/* Pet Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
            >
              <Input
                label="Pet's Name"
                type="text"
                name="petName"
                placeholder="e.g., Bruno, Luna, Whiskers"
                value={formData.petName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.petName ? errors.petName : ''}
              />
              {formData.petName && !errors.petName && (
                <motion.div
                  className="mt-1 flex items-center gap-1 text-xs text-semantic-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle size={14} />
                  <span>Looking good</span>
                </motion.div>
              )}
            </motion.div>

            {/* Breed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            >
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Pet's Breed
              </label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`
                  w-full px-4 py-2.5 rounded-lg bg-background-secondary border
                  border-background-tertiary text-text-primary
                  focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20
                  transition-colors appearance-none
                  ${errors.breed && touched.breed ? 'border-semantic-error' : ''}
                `}
              >
                <option value="">Select a breed...</option>
                {POPULAR_BREEDS.map((breed) => (
                  <option key={breed} value={breed} className="bg-background-secondary">
                    {breed}
                  </option>
                ))}
              </select>
              {errors.breed && touched.breed && (
                <p className="mt-1 text-xs text-semantic-error">{errors.breed}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
            >
              <Input
                label="Your Email"
                type="email"
                name="userEmail"
                placeholder="you@example.com"
                value={formData.userEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userEmail ? errors.userEmail : ''}
              />
            </motion.div>

            {/* User ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
            >
              <Input
                label="User ID"
                type="text"
                name="userId"
                placeholder="your_username_123"
                value={formData.userId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userId ? errors.userId : ''}
              />
              <p className="text-xs text-text-tertiary mt-2">
                Use letters, numbers, hyphens, and underscores.
              </p>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
            >
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
            >
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45, ease: 'easeOut' }}
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
                    Welcome!
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.p
              className="text-center text-sm text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary hover:text-accent-primaryLight transition-colors">
                Sign in
              </Link>
            </motion.p>
          </form>
        </Card>

        {/* Footer */}
        <motion.p
          className="text-xs text-text-tertiary text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
}
