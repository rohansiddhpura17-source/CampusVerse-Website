'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface DestructiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  targetName: string;
  targetType: string;
  consequenceText: string;
  confirmButtonText?: string;
  requireReason?: boolean;
  isLoading?: boolean;
}

export function DestructiveActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  targetName,
  targetType,
  consequenceText,
  confirmButtonText = 'Confirm & Execute',
  requireReason = false,
  isLoading = false,
}: DestructiveModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title={title}>
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-900">Destructive Administrative Action</p>
            <p className="text-rose-700 mt-0.5 leading-relaxed">{consequenceText}</p>
          </div>
        </div>

        {/* Target Details */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Target Resource:</span>
            <span className="font-semibold text-slate-900">{targetType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Identifier / Subject:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px] truncate max-w-[240px]">
              {targetName}
            </span>
          </div>
        </div>

        {/* Reason field if supported/required */}
        {requireReason && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Administrative Justification / Audit Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Specify the policy violation or rationale for this action..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-rose-500 focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading || (requireReason && !reason.trim())}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {confirmButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
