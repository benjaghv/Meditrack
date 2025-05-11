'use client';

import Header from '@/components/Header';
import TreatmentChat from '@/components/TreatmentChat';

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-2">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <TreatmentChat />
      </div>
    </div>
  );
}
