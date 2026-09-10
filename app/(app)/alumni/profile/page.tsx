'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '@/lib/api/alumni';
import { usersApi } from '@/lib/api/users';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCircle,
  Building,
  GraduationCap,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Share2,
  Globe,
  Award,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function AlumniProfilePage() {
  const { user, refreshSession } = useAuth();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['alumniProfileMe', user?.id],
    queryFn: () => alumniApi.getAlumniById(user?.id || ''),
    enabled: !!user?.id,
  });

  // Local form state
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [degree, setDegree] = useState('B.Tech');
  const [graduationYear, setGraduationYear] = useState<number>(2021);
  const [willingToMentor, setWillingToMentor] = useState(true);
  const [willingToRefer, setWillingToRefer] = useState(true);
  const [skillsStr, setSkillsStr] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || user?.name || '');
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setPhone(profile.phone || '');
      setLinkedin(profile.linkedin || '');
      setWebsite(profile.website || '');
      setGithub(profile.github || '');
      setCompany(profile.company || '');
      setDesignation(profile.designation || '');
      setIndustry(profile.industry || '');
      setYearsOfExperience(profile.yearsOfExperience ?? 3);
      setDegree(profile.degree || 'B.Tech');
      setGraduationYear(profile.graduationYear ?? 2021);
      setWillingToMentor(profile.willingToMentor ?? true);
      setWillingToRefer(profile.willingToRefer ?? true);
      setSkillsStr(profile.skills?.join(', ') || '');
    }
  }, [profile, user]);

  const updateMutation = useMutation({
    mutationFn: () => {
      const skillsArray = skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      return usersApi.updateAlumniProfile({
        fullName: fullName.trim(),
        headline: headline.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        phone: phone.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        website: website.trim() || undefined,
        github: github.trim() || undefined,
        company: company.trim() || undefined,
        designation: designation.trim() || undefined,
        industry: industry.trim() || undefined,
        yearsOfExperience: Number(yearsOfExperience),
        degree: degree.trim() || undefined,
        graduationYear: Number(graduationYear),
        willingToMentor: Boolean(willingToMentor),
        willingToRefer: Boolean(willingToRefer),
        skills: skillsArray,
      });
    },
    onSuccess: async () => {
      toastSuccess('Alumni profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumniProfileMe'] });
      queryClient.invalidateQueries({ queryKey: ['alumniDirectoryList'] });
      if (refreshSession) {
        await refreshSession().catch(() => {});
      }
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toastError('Full name is required.');
      return;
    }
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update your public professional credentials, industry experience, and campus mentorship preferences.
          </p>
        </div>

        <Badge variant="primary" className="bg-purple-100 text-purple-800 border-purple-300 text-[10px] self-start sm:self-auto">
          Verified Alumnus Account
        </Badge>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Professional Headline */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-purple-600" /> Basic Identity & Headline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Professional Headline"
                placeholder="e.g. Senior Distributed Systems Engineer @ Tech Corp"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Biography / About You
              </label>
              <textarea
                rows={3}
                placeholder="Share your career focus, technical domains, leadership philosophies, or campus background..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Location / City"
                placeholder="e.g. Bangalore, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Employment & Industry */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" /> Current Organization & Seniority
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Employer / Company"
                placeholder="e.g. Google, Microsoft, Startup Founder"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />

              <Input
                label="Current Job Title / Designation"
                placeholder="e.g. Staff Engineer, Product Lead"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry Domain"
                placeholder="e.g. Cloud Infrastructure, FinTech, AI"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <Input
                label="Total Years of Industry Experience"
                type="number"
                min="0"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseInt(e.target.value || '0', 10))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic History & Graduation */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" /> Alma Mater & Graduation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Degree Earned"
                placeholder="e.g. B.Tech Computer Science, MBA"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />

              <Input
                label="Graduation Year"
                type="number"
                min="1970"
                max="2035"
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value || '2021', 10))}
                required
              />
            </div>

            <div>
              <Input
                label="Skills & Technical Competencies (comma separated)"
                placeholder="e.g. System Design, Kubernetes, Go, Distributed Systems, Cloud Architecture"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                helperText="Separate multiple skills with commas"
              />
            </div>
          </CardContent>
        </Card>

        {/* Links & Social */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" /> Links & Social Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />

              <Input
                label="Personal Website / Portfolio"
                placeholder="https://yourportfolio.dev"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              <Input
                label="GitHub Profile URL"
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mentorship & Referral Availability Toggles */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600" /> Community Contribution Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Willing to Mentor Campus Students</p>
                <p className="text-[11px] text-slate-500">Allow students and aspirants to request 1-on-1 mentorship sessions.</p>
              </div>
              <input
                type="checkbox"
                checked={willingToMentor}
                onChange={(e) => setWillingToMentor(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Offer Job Referrals for Your Company</p>
                <p className="text-[11px] text-slate-500">Allow qualified student and alumni peers to request internal candidate referrals.</p>
              </div>
              <input
                type="checkbox"
                checked={willingToRefer}
                onChange={(e) => setWillingToRefer(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={updateMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-2 px-6"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
