'use client';

import dynamic from 'next/dynamic';

// Dynamically import CameraView to avoid SSR issues with webcam/tensorflow
const CameraView = dynamic(() => import('../components/CameraView'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen bg-black text-white">Loading Camera...</div>
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <CameraView />
    </main>
  );
}
