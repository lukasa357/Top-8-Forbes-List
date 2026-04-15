// app/contact/page.tsx
'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  cell: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  cell?: string;
  comment?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    cell: '',
    comment: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Real-time validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      if (!email.includes('@')) return 'Email must contain @ symbol';
      if (!email.includes('.')) return 'Email must contain domain extension (e.g., .com)';
      return 'Please enter a valid email address (e.g., name@domain.com)';
    }
    
    const commonTypos = ['.con', '.c0m', '@gmail.con', '@yahoo.con'];
    if (commonTypos.some(typo => email.toLowerCase().includes(typo))) {
      return 'Check your email extension (did you mean .com?)';
    }
    
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'Cell phone number is required';
    
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return `Phone number must have at least 10 digits (${digitsOnly.length}/10)`;
    }
    
    if (digitsOnly.length > 11) {
      return 'Phone number is too long (max 11 digits)';
    }
    
    if (digitsOnly.length === 11 && !digitsOnly.startsWith('1')) {
      return '11-digit numbers must start with 1 (country code)';
    }
    
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name is too long (max 50 characters)';
    if (!/^[a-zA-Z\s\-'.]+$/.test(name)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return undefined;
  };

  const validateComment = (comment: string): string | undefined => {
    if (!comment) return 'Comment is required';
    if (comment.length < 10) {
      return `Please provide at least 10 characters (${comment.length}/10)`;
    }
    if (comment.length > 1000) {
      return 'Comment is too long (max 1000 characters)';
    }
    return undefined;
  };

  // Format phone number as user types (US format)
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
  };

  // Auto-format email as user types
  const handleEmailChange = (value: string) => {
    let formattedEmail = value;
    
    if (value.includes('@') && !value.includes('.') && value.split('@')[1]?.length > 0) {
      const localPart = value.split('@')[0];
      const domain = value.split('@')[1];
      
      if (domain === 'gmail' || domain === 'gmail.') {
        formattedEmail = `${localPart}@gmail.com`;
      } else if (domain === 'yahoo' || domain === 'yahoo.') {
        formattedEmail = `${localPart}@yahoo.com`;
      } else if (domain === 'hotmail' || domain === 'hotmail.') {
        formattedEmail = `${localPart}@hotmail.com`;
      } else if (domain === 'outlook' || domain === 'outlook.') {
        formattedEmail = `${localPart}@outlook.com`;
      }
    }
    
    return formattedEmail;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'cell') {
      newValue = formatPhoneNumber(value);
    }
    
    if (name === 'email') {
      newValue = handleEmailChange(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    if (touched[name]) {
      let error;
      if (name === 'name') error = validateName(newValue);
      if (name === 'email') error = validateEmail(newValue);
      if (name === 'cell') error = validatePhone(newValue);
      if (name === 'comment') error = validateComment(newValue);
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error;
    if (name === 'name') error = validateName(formData.name);
    if (name === 'email') error = validateEmail(formData.email);
    if (name === 'cell') error = validatePhone(formData.cell);
    if (name === 'comment') error = validateComment(formData.comment);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      cell: validatePhone(formData.cell),
      comment: validateComment(formData.comment),
    };
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      name: true,
      email: true,
      cell: true,
      comment: true,
    });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cell: formData.cell.replace(/\D/g, ''),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', cell: '', comment: '' });
        setTouched({});
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6 flex-grow">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you. Fill out the form below and we'll respond within 24 hours.
          </p>
        </header>

        {/* Contact Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 rounded-lg border text-gray-900 font-medium ${
                      errors.name && touched.name 
                        ? 'border-red-500 bg-red-50' 
                        : touched.name && formData.name && !errors.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.name}
                    </p>
                  )}
                  {!errors.name && touched.name && formData.name && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span>✓</span> Looks good!
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 rounded-lg border text-gray-900 font-medium ${
                      errors.email && touched.email 
                        ? 'border-red-500 bg-red-50' 
                        : touched.email && formData.email && !errors.email
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                  {!errors.email && touched.email && formData.email && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span>✓</span> Valid email format
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    💡 Tip: Try typing @gmail, @yahoo, or @hotmail for auto-completion
                  </div>
                </div>

                {/* Cell Phone Field */}
                <div>
                  <label htmlFor="cell" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cell Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="cell"
                    name="cell"
                    value={formData.cell}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 rounded-lg border text-gray-900 font-medium ${
                      errors.cell && touched.cell 
                        ? 'border-red-500 bg-red-50' 
                        : touched.cell && formData.cell && !errors.cell
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.cell && touched.cell && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.cell}
                    </p>
                  )}
                  {!errors.cell && touched.cell && formData.cell && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span>✓</span> Valid phone number
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    💡 Format: (XXX) XXX-XXXX or +1 (XXX) XXX-XXXX for international
                  </div>
                </div>

                {/* Comment Field */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                    Comment / Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={5}
                    value={formData.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 rounded-lg border text-gray-900 font-medium ${
                      errors.comment && touched.comment 
                        ? 'border-red-500 bg-red-50' 
                        : touched.comment && formData.comment && !errors.comment
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y`}
                    placeholder="Tell us what you're thinking... (minimum 10 characters)"
                  />
                  {errors.comment && touched.comment && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.comment}
                    </p>
                  )}
                  {!errors.comment && touched.comment && formData.comment && formData.comment.length >= 10 && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span>✓</span> {formData.comment.length}/10+ characters
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    💡 {formData.comment.length}/1000 characters used
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 rounded-lg bg-green-100 border-2 border-green-400 text-green-700 text-center font-medium">
                    ✅ Thank you! Your message has been sent successfully.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 rounded-lg bg-red-100 border-2 border-red-400 text-red-700 text-center font-medium">
                    ❌ Oops! Something went wrong. Please try again later.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Format Guide Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Formatting Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="border-b border-gray-100 pb-2">
                  <p className="font-semibold text-gray-800 mb-1">Email Examples:</p>
                  <p className="text-gray-700 text-xs">✓ name@domain.com</p>
                  <p className="text-gray-700 text-xs">✓ first.last@company.org</p>
                  <p className="text-red-600 text-xs">✗ name@domain (missing .com)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Phone Examples:</p>
                  <p className="text-gray-700 text-xs">✓ (555) 123-4567</p>
                  <p className="text-gray-700 text-xs">✓ 555-123-4567</p>
                  <p className="text-gray-700 text-xs">✓ +1 (555) 123-4567</p>
                  <p className="text-red-600 text-xs">✗ 12345 (too short)</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-800">
                  Real-time Validation
                </span>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-900 font-medium">(925) 555-0101</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-900 font-medium">lukasa@dvc.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-bold text-gray-900">Quick Response</h3>
              </div>
              <p className="text-gray-700 font-medium">
                We respond within <span className="font-semibold text-blue-600">24 hours</span>
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800">
                  Customer Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-sm">
            <p className="mb-2">
              Copyright © 2026 Lukas A, LLC. All rights reserved. 
              No portion of LA.com may be duplicated, redistributed or manipulated in any form.
            </p>
            <p>
              By accessing any information beyond this page, you agree to abide by the 
              <a href="#" className="text-blue-400 hover:text-blue-300 underline mx-1 transition-colors">
                Privacy Policy
              </a>
              /
              <a href="#" className="text-blue-400 hover:text-blue-300 underline mx-1 transition-colors">
                Your California Privacy Rights
              </a>
              and
              <a href="#" className="text-blue-400 hover:text-blue-300 underline ml-1 transition-colors">
                Terms of Use
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}