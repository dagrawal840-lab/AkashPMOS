'use client';

import { useState } from 'react';

interface BriefState {
  brief: string | null;
  generatedAt: string | null;
  loading: boolean;
  error: string | null;
}

export default function AIBrief() {
  const [state, setState] = useState<BriefState>({
    brief: null,
    generatedAt: null,
    loading: false,
    error: null,
  });

  async function fetchBrief() {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/brief', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setState((s) => ({
          ...s,
          loading: false,
          error: data.error ?? 'Something went wrong',
        }));
        return;
      }

      setState({
        brief: data.brief,
        generatedAt: data.generatedAt,
        loading: false,
        error: null,
      });
    } catch {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'Network error. Please try again.',
      }));
    }
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            AI Weekly Brief
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">Powered by Claude</p>
        </div>
        <button
          onClick={fetchBrief}
          disabled={state.loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {state.loading ? 'Generating…' : state.brief ? 'Refresh' : 'Generate Brief'}
        </button>
      </div>

      {state.error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state.brief && (
        <div className="mt-4">
          <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
            {state.brief}
          </div>
          {state.generatedAt && (
            <p className="mt-3 text-xs text-gray-400">
              Generated {new Date(state.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {!state.brief && !state.error && !state.loading && (
        <p className="mt-4 text-sm text-gray-500">
          Click to generate an AI-powered competitive brief for Yum Brands.
        </p>
      )}
    </div>
  );
}
