'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi, Message } from '@/lib/api/messages';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Send,
  User,
  Clock,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export default function AlumniConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const conversationId = params?.conversationId as string;

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll messages every 3 seconds
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['conversationMessages', conversationId],
    queryFn: () => messagesApi.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => messagesApi.sendMessage(conversationId, text),
    onSuccess: () => {
      setMessageInput('');
      queryClient.invalidateQueries({ queryKey: ['conversationMessages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['alumniConversationsList'] });
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to deliver message.');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMutation.mutate(messageInput.trim());
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Security check: backend returns 403 FORBIDDEN if user is not a participant
  if (isError) {
    const isForbidden = (error as any)?.response?.status === 403 || (error as any)?.status === 403;
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {isForbidden ? 'Access Denied: Private Conversation' : 'Conversation Error'}
        </h2>
        <p className="text-xs text-slate-600">
          {isForbidden
            ? 'You are not an authorized participant in this private conversation. Access has been blocked by the security layer.'
            : 'Unable to load message history from server.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push('/alumni/messages')}>
          Back to Messages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/alumni/messages"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">Direct Chat</h1>
            <p className="text-[10px] text-slate-400">End-to-end encrypted on CampusVerse Network</p>
          </div>
        </div>
      </div>

      {/* Messages Body */}
      <Card className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col justify-between">
        <div className="space-y-3">
          {!messages || messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No messages yet in this conversation. Say hello to kick things off!
            </div>
          ) : (
            messages.map((msg: Message) => {
              const isMine = msg.senderId === user?.id;
              const senderName = msg.sender?.profile?.fullName || msg.sender?.email || (isMine ? 'You' : 'Member');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 font-medium mb-0.5 px-1">
                    {senderName}
                  </span>
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-[9px] mt-1 text-right ${
                        isMine ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sendMutation.isPending}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
          />
          <Button
            type="submit"
            size="sm"
            isLoading={sendMutation.isPending}
            disabled={!messageInput.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-1 px-4"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
