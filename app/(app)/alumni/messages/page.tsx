'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { messagesApi, Conversation } from '@/lib/api/messages';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Search,
  User,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';

export default function AlumniMessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['alumniConversationsList'],
    queryFn: () => messagesApi.getConversations(),
    refetchInterval: 5000, // REST polling
  });

  const filteredConversations = (conversations || []).filter((conv) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const otherParticipant = conv.participants?.find((p: any) => p.userId !== user?.id)?.user;
    const name = otherParticipant?.profile?.fullName || otherParticipant?.email || '';
    return name.toLowerCase().includes(query) || conv.title?.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Messages & Conversations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication with campus alumni, mentors, and student mentees.
          </p>
        </div>

        <Link href="/alumni/network">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600" /> Start New Chat
          </Button>
        </Link>
      </div>

      {/* Search Ribbon */}
      <div className="max-w-md">
        <Input
          placeholder="Search conversations by participant name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">Failed to load conversations</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredConversations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No conversations yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start conversations with alumni or mentees directly from the Network Directory or Mentorship Hub.
            </p>
            <Link href="/alumni/network" className="inline-block pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                Browse Alumni Directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conv) => {
            const otherParticipant = conv.participants?.find((p: any) => p.userId !== user?.id)?.user;
            const peerName = otherParticipant?.profile?.fullName || otherParticipant?.email || 'Campus Member';
            const lastMessage = conv.messages?.[0]?.content || 'Conversation started';
            const updatedAt = conv.updatedAt || (conv.messages?.[0] as any)?.createdAt;

            return (
              <Link
                key={conv.id}
                href={`/alumni/messages/${conv.id}`}
                className="block"
              >
                <Card className="hover:border-purple-300 hover:shadow-xs transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {peerName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{peerName}</h3>
                          {otherParticipant?.role && (
                            <Badge variant="outline" className="text-[10px]">
                              {otherParticipant.role}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{lastMessage}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {updatedAt && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
