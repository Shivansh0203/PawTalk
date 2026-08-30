import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ArrowRight, CheckCircle, Upload } from 'lucide-react';

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
        if (value.length < 2) return 'At least 2 characters';
        if (value.length > 30) return 'Less than 30 characters';
        return '';

      case 'userEmail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        return '';

      case 'userId':
        if (!value.trim()) return 'User ID is required';
        if (value.length < 3) return 'At least 3 characters';
        if (value.length > 20) return 'Less than 20 characters';
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Letters, numbers, _ and - only';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'At least 8 characters';
        if (!/[A-Z]/.test(value)) return 'One uppercase letter required';
        if (!/[a-z]/.test(value)) return 'One lowercase letter required';
        if (!/[0-9]/.test(value)) return 'One number required';
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      case 'breed':
        if (!value.trim()) return 'Select a breed';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handlePetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, petImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAuthState(true);
    setPetName(formData.petName);
    if (formData.petImage) {
      setPetImage(formData.petImage);
    }

    setShowSuccess(true);

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = Object.keys(formData).every((key) => {
    if (key === 'petImage') return true;
    return formData[key as keyof FormData];
  });

  return (
    <div className="min-h-screen bg-background-primary text-text-primary py-16 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-bold mb-4 leading-tight tracking-tight">
            Tell us about them.
          </h1>
          <p className="text-text-secondary text-base max-w-lg mx-auto mt-4">
            Create your account and introduce your companion to PawTalk. We'll learn their unique voice.
          </p>
        </motion.div>

        {/* Two Column Layout: Image + Form */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Pet Image Section - Editorial Focus */}
          <div className="lg:col-span-2">
            <motion.div
              className="relative aspect-square rounded-xl overflow-hidden border border-background-secondary bg-background-tertiary"
              whileHover={{ borderColor: '#8b5cf6' }}
            >
              {formData.petImage ? (
                <motion.img
                  src={formData.petImage}
                  alt="Pet preview"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background-secondary to-background-tertiary">
                  <Upload size={40} className="text-text-tertiary mb-3 opacity-40" />
                  <p className="text-sm text-text-tertiary">Pet photo (optional)</p>
                </div>
              )}

              {/* Upload Input */}
              <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-background-overlay transition-opacity flex items-center justify-center">
                <span className="text-sm font-semibold text-accent-primary">Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePetImageUpload}
                  className="hidden"
                />
              </label>
            </motion.div>
            <p className="text-xs text-text-tertiary mt-3 text-center tracking-wide">
              OPTIONAL — Add a clear photo for better analysis
            </p>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Name - Hero Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
              >
                <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-2">
                  Their Name
                </label>
                <input
                  type="text"
                  name="petName"
                  placeholder="e.g., Luna, Bruno, Whiskers"
                  value={formData.petName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    w-full px-4 py-3 text-lg rounded-lg bg-background-secondary border
                    border-background-tertiary text-text-primary placeholder-text-tertiary
                    focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20
                    transition-all
                    ${errors.petName && touched.petName ? 'border-semantic-error' : ''}
                  `}
                />
                {formData.petName && !errors.petName && touched.petName && (
                  <motion.div
                    className="mt-2 flex items-center gap-1 text-xs text-semantic-success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CheckCircle size={14} />
                    <span>Perfect</span>
                  </motion.div>
                )}
                {errors.petName && touched.petName && (
                  <p className="mt-1 text-xs text-semantic-error">{errors.petName}</p>
                )}
              </motion.div>

              {/* Breed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
              >
                <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-2">
                  Breed
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
                    transition-all appearance-none
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

              {/* Email & User ID in Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
                >
                  <Input
                    label="Email"
                    type="email"
                    name="userEmail"
                    placeholder="you@example.com"
                    value={formData.userEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.userEmail ? errors.userEmail : ''}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
                >
                  <Input
                    label="Username"
                    type="text"
                    name="userId"
                    placeholder="your_name"
                    value={formData.userId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.userId ? errors.userId : ''}
                  />
                </motion.div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
                >
                  <Input
                    label="Confirm"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword ? errors.confirmPassword : ''}
                  />
                </motion.div>
              </div>

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
            </form>
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.div
          className="text-center mt-12 border-t border-background-secondary pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary hover:text-accent-primaryLight transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Terms */}
        <motion.p
          className="text-xs text-text-tertiary text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          By creating an account, you agree to our Terms and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
}
