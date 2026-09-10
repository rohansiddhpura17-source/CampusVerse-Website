'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserCircle,
  Mail,
  ShieldCheck,
  Save,
  MapPin,
  Phone,
  Globe,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function AdminProfilePage() {
  const { user, refreshSession } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        fullName: user.profile.fullName || '',
        headline: user.profile.headline || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        phone: user.profile.phone || '',
        website: user.profile.website || '',
        github: user.profile.github || '',
        linkedin: user.profile.linkedin || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.fullName.trim()) {
      toastError('Administrator full name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await usersApi.updateUser(user.id, {
        fullName: formData.fullName.trim(),
        headline: formData.headline.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        location: formData.location.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        website: formData.website.trim() || undefined,
        github: formData.github.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
      });

      await refreshSession();
      toastSuccess('Administrator profile updated and persisted to database successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update administrator profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrator Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your executive credentials, institutional contact details, and platform identity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="danger" className="font-mono text-[10px]">
            ROLE: {user?.role}
          </Badge>
          <Badge variant="outline" className="text-emerald-700 border-emerald-300 text-[10px]">
            <ShieldCheck className="w-3 h-3 mr-1 inline" /> Authorized Operator
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-blue-600" /> Administrative Identity & Title
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Vikram Sen"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  System Account Email (Read-Only)
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono text-xs select-all">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {user?.email}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Executive Headline / Designation
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Dean of Academic Affairs & Systems Controller"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Administrative Biography / Office Brief
              </label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief description of administrative oversight and institutional jurisdiction..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Channels */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" /> Office Contact & Institutional Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office Location / Department</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Administration Block, Room 302"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Phone Contact</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Portal / Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://campusverse.edu/office"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub / Tech Handle</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 px-5"
          >
            <Save className="w-3.5 h-3.5" /> Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
