'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { usersApi } from '@/lib/api/users';
import { studentApi } from '@/lib/api/student';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, refreshSession } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const { data: academics, isLoading: isAcademicsLoading } = useQuery({
    queryKey: ['academicSummary'],
    queryFn: () => studentApi.getAcademicSummary(),
  });

  // Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState<number>(6);
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [skillsText, setSkillsText] = useState('React, TypeScript, Python, SQL, Git');

  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (academics) {
      setDegree(academics.degree || 'B.Tech');
      setBranch(academics.major || 'Computer Science and Engineering');
      setSemester(academics.semester || 6);
      setCgpa(academics.cgpa || 8.5);
    }
  }, [academics]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const skillsArray = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        degree: degree.trim() || undefined,
        branch: branch.trim() || undefined,
        semester: Number(semester),
        cgpa: Number(cgpa),
        graduationYear: Number(graduationYear),
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      };

      return usersApi.updateStudentProfile(payload);
    },
    onSuccess: async () => {
      toastSuccess('Student profile saved and persisted to database!');
      await refreshSession();
      queryClient.invalidateQueries({ queryKey: ['academicSummary'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update profile');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toastError('Full name is required');
      return;
    }
    if (cgpa < 0 || cgpa > 10) {
      toastError('CGPA must be between 0.0 and 10.0');
      return;
    }
    if (semester < 1 || semester > 12) {
      toastError('Semester must be between 1 and 12');
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-700 to-indigo-700 text-white shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        <Avatar name={fullName || user?.name || 'Student'} size="lg" className="h-20 w-20 text-xl font-bold ring-4 ring-white/20" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30">
              Student Profile
            </Badge>
            <span className="text-xs text-brand-100 font-mono">
              Roll: {academics?.studentIdNumber || '2023CSB1042'}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{fullName || user?.name}</h1>
          <p className="text-xs sm:text-sm text-brand-100">
            {degree} in {branch} • {academics?.institution?.name || 'National Institute of Technology'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Edit Student Credentials & Academic Bio
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              All updates sync directly with the central database and persist across sessions.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Personal & Contact Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="University Email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={<Mail className="w-4 h-4" />}
                  helperText="Registered institution email (Cannot be edited directly)"
                />

                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Campus / City Location"
                  placeholder="Hostel Block 4, South Campus, Bengaluru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Academic Biography & Interests
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Undergraduate CSE student interested in distributed systems, kernel development, and open source..."
                  className="block w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Academic Standing */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Academic Standing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Degree Program"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                />

                <Input
                  label="Major / Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  leftIcon={<BookOpen className="w-4 h-4" />}
                />

                <Input
                  label="Semester"
                  type="number"
                  min={1}
                  max={12}
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                />

                <Input
                  label="Cumulative GPA"
                  type="number"
                  step="0.01"
                  min={0.0}
                  max={10.0}
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  leftIcon={<Award className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Expected Graduation Year"
                  type="number"
                  min={2020}
                  max={2040}
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />

                <Input
                  label="Technical Skills (Comma separated)"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" isLoading={updateMutation.isPending} className="gap-1.5">
                <Save className="w-4 h-4" /> Save & Persist Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
