'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'STUDENT_SUPPORT',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    // Simulates clean client acknowledgment for informational contact page
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-emerald-950">Inquiry Received</h3>
        <p className="text-xs text-emerald-800 max-w-md mx-auto">
          Thank you for reaching out, {formData.name}. Our campus operations team has logged your inquiry and will respond to <span className="font-semibold">{formData.email}</span> within 24 to 48 hours.
        </p>
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Aarav Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="aarav@campusverse.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <Select
        label="Inquiry Topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        options={[
          { value: 'STUDENT_SUPPORT', label: 'Student Support & Coursework' },
          { value: 'VERIFICATION', label: 'Credential Verification Assistance' },
          { value: 'INSTITUTION', label: 'Institutional Partnership & Dean Inquiries' },
          { value: 'ALUMNI_NETWORK', label: 'Alumni Network & Hiring Inquiries' },
          { value: 'SECURITY_REPORT', label: 'Security or Account Concern' },
        ]}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe your inquiry or question in detail..."
          required
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        Submit Inquiry
      </Button>
    </form>
  );
}
