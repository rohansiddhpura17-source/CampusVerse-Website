'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Trash2,
  Edit2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';

export default function StudentNoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');

  const {
    data: note,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['noteDetail', id],
    queryFn: async () => {
      const data = await studentApi.getNoteById(id);
      setEditTitle(data.title);
      setEditDescription(data.description || '');
      setEditTags(Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags as any) || '');
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { title: string; description?: string; tags?: string }) => {
      return studentApi.updateNote(id, payload as any);
    },
    onSuccess: () => {
      toastSuccess('Note updated successfully');
      queryClient.invalidateQueries({ queryKey: ['noteDetail', id] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update note');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return studentApi.deleteNote(id);
    },
    onSuccess: () => {
      toastSuccess('Note deleted');
      router.push('/student/notes');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to delete note');
    },
  });

  const isOwner = user?.userId === (note as any)?.userId || (user as any)?.id === (note as any)?.userId || user?.role === 'ADMIN';

  const handleDownload = () => {
    if (note?.fileUrl) {
      window.open(note.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateMutation.mutate({
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      tags: editTags.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Study Note Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested document may have been removed or is restricted.
          </p>
          <div className="pt-2">
            <Link href="/student/notes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Notes Hub
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/student/notes"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Notes Hub
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700">
                  {(note as any).course?.code || note.courseCode || 'GENERAL'}
                </span>
                <Badge variant="secondary">
                  <Download className="w-3 h-3 mr-1" /> {note.downloadsCount || 0} Downloads
                </Badge>
              </div>

              {!isEditing ? (
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{note.title}</h1>
              ) : (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-bold text-lg"
                />
              )}

              <p className="text-xs text-slate-500">
                Uploaded by {(note as any).user?.profile?.fullName || note.authorName || 'Student'}
                {note.createdAt ? ` on ${new Date(note.createdAt).toLocaleDateString()}` : ''}
              </p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center gap-2 self-start">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSaveEdit} isLoading={updateMutation.isPending}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this study note?')) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="text-rose-600 hover:bg-rose-50"
                  isLoading={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Description & Tags */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Description & Topics
              </h3>
              {!isEditing ? (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {note.description || 'No description provided for this study note.'}
                </p>
              ) : (
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              )}
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tags</h3>
              {!isEditing ? (
                <div className="flex flex-wrap gap-1.5">
                  {((note as any).tags
                    ? typeof (note as any).tags === 'string'
                      ? (note as any).tags.split(',')
                      : (note as any).tags
                    : []
                  ).map((t: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[11px]">
                      #{t.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Input
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="midterm, notes, formulas"
                />
              )}
            </div>
          </div>

          {/* Download Action Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-900">Original Document Link</p>
                <p className="text-[11px] text-slate-500 truncate max-w-sm">{note.fileUrl}</p>
              </div>
            </div>

            <Button onClick={handleDownload} className="gap-1.5 shrink-0">
              <Download className="w-4 h-4" /> Download / Open Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
