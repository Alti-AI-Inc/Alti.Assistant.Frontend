'use client';

import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { Download, FileText, Plus, ArrowRight, Building2 } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore';

// Detailed mock invoices for the subscription receipts
const INVOICES = [
  { id: 'INV-2026-006', month: 'June 2026', amount: 25.00, date: 'June 1, 2026' },
  { id: 'INV-2026-005', month: 'May 2026', amount: 25.00, date: 'May 1, 2026' },
  { id: 'INV-2026-004', month: 'April 2026', amount: 25.00, date: 'April 1, 2026' },
  { id: 'INV-2026-003', month: 'March 2026', amount: 25.00, date: 'March 1, 2026' },
  { id: 'INV-2026-002', month: 'February 2026', amount: 25.00, date: 'February 1, 2026' },
  { id: 'INV-2026-001', month: 'January 2026', amount: 25.00, date: 'January 1, 2026' },
  { id: 'INV-2025-012', month: 'December 2025', amount: 25.00, date: 'December 1, 2025' },
];

export default function AdminInvoicesPage() {
  const { currentTenant, tenants, switchToTenantMode, isLoading } = useTenant();
  const { onOpen } = useModalStore();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDownloadPDF = async (invoice: typeof INVOICES[0]) => {
    setIsGenerating(invoice.id);
    try {
      const doc = new jsPDF();

      // Palette details
      const primaryColor = [24, 24, 27]; // Zinc 900
      const lightGray = [120, 120, 120];

      // Header Alti Branding
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('ALTI', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text('www.altihq.com', 20, 31);

      // Invoice Title and Info Card
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('RECEIPT / INVOICE', 130, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Invoice ID: ${invoice.id}`, 130, 32);
      doc.text(`Date: ${invoice.date}`, 130, 37);
      doc.text(`Status: PAID`, 130, 42);

      // Symmetrical separator line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 50, 190, 50);

      // Billing Information Panel
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Billed To:', 20, 60);

      doc.setFont('helvetica', 'normal');
      doc.text(currentTenant?.name || 'My Organization', 20, 66);
      doc.text('Active Team Subscription Plan', 20, 71);

      doc.setFont('helvetica', 'bold');
      doc.text('Vendor details:', 120, 60);

      doc.setFont('helvetica', 'normal');
      doc.text('Alti AI Inc.', 120, 66);
      doc.text('Delaware, USA', 120, 71);

      // Invoice Item Table Header Row
      doc.setFillColor(245, 245, 247);
      doc.rect(20, 85, 170, 8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.text('Description', 25, 90);
      doc.text('Qty', 120, 90);
      doc.text('Rate', 145, 90);
      doc.text('Amount', 170, 90);

      // Line item row representing the subscription
      doc.setFont('helvetica', 'normal');
      doc.text(`Alti Pro Subscription - ${invoice.month}`, 25, 102);
      doc.text('1', 120, 102);
      doc.text(`$${invoice.amount.toFixed(2)}`, 145, 102);
      doc.text(`$${invoice.amount.toFixed(2)}`, 170, 102);

      doc.setDrawColor(230, 230, 230);
      doc.line(20, 108, 190, 108);

      // Grand Total Box
      doc.setFont('helvetica', 'bold');
      doc.text('Total Paid:', 135, 120);
      doc.text(`$${invoice.amount.toFixed(2)}`, 170, 120);

      // Bottom support note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Thank you for partnering with Alti! If you have any billing queries, reach out at support@altihq.com',
        20,
        150
      );

      // Download file action
      doc.save(`${invoice.id}.pdf`);
      toast.success(`Downloaded invoice ${invoice.id} successfully.`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to download invoice PDF.');
    } finally {
      setIsGenerating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F7] dark:bg-gray-950">
        <span className="text-gray-500 text-sm">Loading invoice history...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Invoice History
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <FileText className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Organization Invoices
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                You are in Personal Mode. Personal subscription invoices and history are managed under your profile billing section.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/billing')}
                className="w-full text-xs font-semibold"
              >
                Go to Personal Billing
              </Button>
            </div>

            {tenants.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-left">
                  View Organization Invoices
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-black/5 dark:border-zinc-800 rounded-lg p-1">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => switchToTenantMode(tenant.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm text-left transition-colors"
                    >
                      <span className="font-medium text-gray-950 dark:text-white truncate">
                        {tenant.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-black/5 dark:border-zinc-800">
                <Button
                  variant="default"
                  onClick={() => onOpen({ type: 'create-organization' })}
                  className="w-full gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
                >
                  <Plus className="h-4 w-4" />
                  Create Organization
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
      {/* Page Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Invoice History
        </h1>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="space-y-4">

          {/* Unified Invoice List Table */}
          <div className="flex flex-col space-y-3 relative z-10 !mt-0">
            
            {/* Desktop Table Headers */}
            <div className="hidden md:flex items-center justify-between py-2 px-4 gap-4 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-20 border-b border-black/10 dark:border-white/10 mb-4 rounded-t-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Invoice ID</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Month</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                </div>
                <div className="flex-1 min-w-0 flex justify-end pr-4">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Download</span>
                </div>
              </div>
            </div>

            {/* List Rows */}
            {INVOICES.map((invoice) => (
              <div
                key={invoice.id}
                className="group flex flex-col md:flex-row md:items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs gap-4 hover:border-black/20 dark:hover:border-white/20 transition-all duration-150"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                  
                  {/* Invoice ID */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-[10px] text-gray-400 font-semibold uppercase">ID: </span>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                        {invoice.id}
                      </p>
                    </div>
                  </div>

                  {/* Month */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-[10px] text-gray-400 font-semibold uppercase">Month: </span>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                        {invoice.month}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-[10px] text-gray-400 font-semibold uppercase">Amount: </span>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed">
                        ${invoice.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Download */}
                  <div className="flex-1 min-w-0 flex justify-start md:justify-end pr-0 md:pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadPDF(invoice)}
                      disabled={isGenerating === invoice.id}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer bg-blue-50/50 dark:bg-blue-950/20 px-3 py-1 rounded-lg"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {isGenerating === invoice.id ? 'Generating...' : 'PDF'}
                    </Button>
                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}
