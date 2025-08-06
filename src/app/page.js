'use client';

import LumpForm from '../components/LumpForm';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <LumpForm />
        </div>
      </div>
    </ErrorBoundary>
  );
}
