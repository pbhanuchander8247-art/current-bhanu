import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, ExternalLink, X } from 'lucide-react';
import { apiJsonRequest } from '../lib/http';
import { isBackendMissingStatus } from '../lib/portalLocalAuth';
import type { LanguageMode } from '../types/portal';

interface WebSourceModalProps {
  lang: LanguageMode;
  onClose: () => void;
}

type FileKey = 'html' | 'css' | 'js';

export function WebSourceModal({ lang, onClose }: WebSourceModalProps) {
  const isTe = lang === 'te';
  const [activeTab, setActiveTab] = useState<FileKey>('html');
  const [sources, setSources] = useState<{ html: string; css: string; js: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await apiJsonRequest<{
          html: string;
          css: string;
          js: string;
          error?: string;
        }>('/api/website/source');
        if (isBackendMissingStatus(result.status)) {
          const [h, c, j] = await Promise.all([
            fetch('/bcr-website/index.html').then((r) => (r.ok ? r.text() : '')),
            fetch('/bcr-website/styles.css').then((r) => (r.ok ? r.text() : '')),
            fetch('/bcr-website/app.js').then((r) => (r.ok ? r.text() : '')),
          ]);
          if (h && c && j) {
            if (active) setSources({ html: h, css: c, js: j });
            return;
          }
        }
        if (!result.ok || !result.data || typeof result.data.html !== 'string') {
          throw new Error(result.errorMessage || 'Could not load website source.');
        }
        if (active) setSources(result.data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load files.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  const fileMeta: Record<FileKey, { label: string; filename: string; mime: string }> = {
    html: { label: 'index.html', filename: 'index.html', mime: 'text/html' },
    css: { label: 'styles.css', filename: 'styles.css', mime: 'text/css' },
    js: { label: 'app.js', filename: 'app.js', mime: 'application/javascript' },
  };

  const activeContent = sources ? sources[activeTab] : '';

  async function handleCopy() {
    if (!activeContent) return;
    await navigator.clipboard.writeText(activeContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function handleDownload(key: FileKey) {
    if (!sources) return;
    const meta = fileMeta[key];
    const blob = new Blob([sources[key]], { type: meta.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="HTML CSS JS Source"
    >
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden text-[#171513] dark:text-[#F1F5F9]">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
              {isTe ? 'స్వతంత్ర వెబ్‌సైట్ ఫైల్స్' : 'Standalone Static Web Edition'}
            </p>
            <h2 className="font-display text-xl font-semibold">
              BCR Current Affairs — HTML, CSS &amp; JavaScript
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/website/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:border-[#1D4ED8] flex items-center gap-1.5"
            >
              <span>{isTe ? 'ప్రత్యక్ష ప్రివ్యూ' : 'Open /website'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] dark:bg-[#0E1116]">
          <div className="flex items-center gap-1.5">
            {(['html', 'css', 'js'] as FileKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 text-xs font-mono-num font-semibold rounded-lg transition-colors ${
                  activeTab === key
                    ? 'bg-[#1D4ED8] text-white'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {fileMeta[key].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!activeContent}
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : `Copy ${fileMeta[activeTab].label}`}</span>
            </button>
            <button
              type="button"
              disabled={!activeContent}
              onClick={() => handleDownload(activeTab)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {fileMeta[activeTab].label}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-[#0E1116] text-slate-100">
          {loading ? (
            <p className="text-xs text-slate-400">Loading source files...</p>
          ) : error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : (
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
              <code>{activeContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
