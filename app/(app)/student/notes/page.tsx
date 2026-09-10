'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  ExternalLink,
  BookOpen,
  User,
  Tag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StudentNotesPage() {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newTags, setNewTags] = useState('');

  const {
    data: notes,
    isLoading: isNotesLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['studentNotes', search],
    queryFn: () => studentApi.getNotes({ search: search || undefined }),
  });

  const { data: courses } = useQuery({
    queryKey: ['coursesList'],
    queryFn: () => studentApi.getCourses(),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string;
      fileUrl: string;
      courseId?: string;
      tags?: string;
    }) => {
      return studentApi.createNote(payload);
    },
    onSuccess: () => {
      toastSuccess('Study note published successfully!');
      queryClient.invalidateQueries({ queryKey: ['studentNotes'] });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewFileUrl('');
      setNewCourseId('');
      setNewTags('');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to publish note');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return studentApi.deleteNote(id);
    },
    onSuccess: () => {
      toastSuccess('Note removed');
      queryClient.invalidateQueries({ queryKey: ['studentNotes'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to delete note');
    },
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileUrl.trim()) {
      toastError('Title and Document URL are required');
      return;
    }
    createMutation.mutate({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      fileUrl: newFileUrl.trim(),
      courseId: newCourseId || undefined,
      tags: newTags.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Peer Notes & Study Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, upload, and download syllabus-aligned lecture notes and exam guides.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Share Notes
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search notes by subject, title, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Notes Grid */}
      {isNotesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Failed to load study notes</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !notes || notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No notes found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first in your batch to upload reference notes, cheat sheets, or lab manuals.
            </p>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Share the First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: any) => {
            const isOwner = user?.userId === note.userId || (user as any)?.id === note.userId;
            return (
              <Card key={note.id} className="hover:border-brand-200 transition-all flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                      {note.course?.code || note.courseCode || 'COURSE'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Download className="w-3 h-3" /> {note.downloadsCount || 0}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/student/notes/${note.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 line-clamp-1 transition-colors"
                    >
                      {note.title}
                    </Link>
                    {note.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{note.description}</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
                    <span className="truncate max-w-[140px]">
                      By {note.user?.profile?.fullName || note.authorName || 'Student'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/notes/${note.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
                      >
                        View <ExternalLink className="w-3 h-3 ml-0.5" />
                      </Link>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(note.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Note Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Upload Study Note"
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. Distributed Systems Final Review Notes"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Course (Optional)</label>
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">-- Select Course --</option>
              {(courses || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Resource Link (PDF / Doc URL)"
            type="url"
            placeholder="https://drive.google.com/... or https://..."
            value={newFileUrl}
            onChange={(e) => setNewFileUrl(e.target.value)}
            helperText="Direct document link accessible for downloads"
            required
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="midterms, algorithms, unit-3"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Summary of topics covered in this document..."
              className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Publish Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
