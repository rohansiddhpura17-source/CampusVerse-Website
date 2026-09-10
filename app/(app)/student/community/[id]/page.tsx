'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  ArrowLeft,
  Heart,
  MessageSquare,
  Send,
  Plus,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';

export default function StudentCommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['communityDetail', id],
    queryFn: () => studentApi.getCommunityById(id),
  });

  const community = data?.community;
  const posts = data?.posts || [];

  const joinMutation = useMutation({
    mutationFn: async () => {
      return studentApi.joinCommunity(id);
    },
    onSuccess: () => {
      toastSuccess('Joined community!');
      queryClient.invalidateQueries({ queryKey: ['communityDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['studentCommunities'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to join');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      return studentApi.leaveCommunity(id);
    },
    onSuccess: () => {
      toastSuccess('Left community.');
      queryClient.invalidateQueries({ queryKey: ['communityDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['studentCommunities'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to leave');
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      return studentApi.createPost(id, payload);
    },
    onSuccess: () => {
      toastSuccess('Post published to community!');
      queryClient.invalidateQueries({ queryKey: ['communityDetail', id] });
      setPostTitle('');
      setPostContent('');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to create post');
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return studentApi.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityDetail', id] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to like post');
    },
  });

  const commentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      return studentApi.commentPost(postId, content);
    },
    onSuccess: () => {
      toastSuccess('Comment added!');
      queryClient.invalidateQueries({ queryKey: ['communityDetail', id] });
      setCommentText('');
      setActiveCommentPostId(null);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to post comment');
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toastError('Title and content are required');
      return;
    }
    createPostMutation.mutate({
      title: postTitle.trim(),
      content: postContent.trim(),
    });
  };

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    commentMutation.mutate({
      postId,
      content: commentText.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Community Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested student community could not be found or has been disbanded.
          </p>
          <div className="pt-2">
            <Link href="/student/community">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Communities
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMember = community.isMember;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/student/community"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Communities
      </Link>

      {/* Community Header Banner */}
      <Card>
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {community.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{community.name}</h1>
                {isMember && (
                  <Badge variant="primary" className="text-[10px]">
                    Member
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{community.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {community.memberCount || 0} Members
                </span>
                <span>•</span>
                <span>{posts.length} Discussions</span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            {isMember ? (
              <Button
                variant="outline"
                onClick={() => leaveMutation.mutate()}
                isLoading={leaveMutation.isPending}
                className="text-slate-600 hover:text-rose-600"
              >
                Leave Group
              </Button>
            ) : (
              <Button
                onClick={() => joinMutation.mutate()}
                isLoading={joinMutation.isPending}
                className="shadow-xs"
              >
                Join Community
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Post Box */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" /> Start a Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <Input
              placeholder="Discussion topic or question title..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
            <textarea
              rows={3}
              placeholder="Share details, code snippets, or ask for guidance..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" isLoading={createPostMutation.isPending}>
                <Send className="w-3.5 h-3.5 mr-1" /> Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discussion Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Community Discussions ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-xs text-slate-500">
              No discussions yet. Be the first to start a conversation!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name={post.authorName || 'Student'} size="sm" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{post.authorName || 'Student'}</p>
                      <p className="text-[10px] text-slate-400">
                        {post.authorRole || 'STUDENT'}
                        {post.createdAt ? ` • ${new Date(post.createdAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => likePostMutation.mutate(post.id)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likesCount || 0} Likes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount || (post.comments ? post.comments.length : 0)} Comments</span>
                  </button>
                </div>

                {/* Comment Section Expansion */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="p-2.5 rounded-lg bg-slate-50 text-xs space-y-0.5">
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{comm.authorName}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <p className="text-slate-600">{comm.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">No comments yet.</p>
                    )}

                    {/* New Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSendComment(post.id)}
                        isLoading={commentMutation.isPending}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
