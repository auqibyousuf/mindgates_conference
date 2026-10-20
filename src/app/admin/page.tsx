"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, RefreshCw, FileText, Settings, CheckCircle2,
  AlertCircle, AlertTriangle, Plus, Trash2, Edit3, ChevronRight, X, Bell,
  Calendar, Award, Users, BarChart, User, Mail, Phone,
  Building2, MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassContainer } from '@/components/GlassContainer';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useToast } from '@/components/ui/Toast';

type AdminStatus = { type: 'success' | 'error', msg: string } | null;

interface FileConfig {
  name: string;
  label: string;
  icon: React.ElementType;
  type: 'object' | 'array' | 'stats';
}

const DERIVED_LINKS = [
  { label: 'Home', value: '/' },
  { label: 'Conferences', value: '/conferences' },
  { label: 'Editorial Board', value: '/editors' },
  { label: 'Books', value: '/books' },
  { label: 'Gallery', value: '/gallery' },
  { label: 'About Us', value: '/about' },
  { label: 'Contact', value: '/contact' },
  { label: 'Awards', value: '/awards' },
];

const TAB_SCHEMAS: Record<string, Record<string, unknown>> = {
  'conferences.json': {
    title: '',
    date: '',
    startDate: '',
    endDate: '',
    venue: '',
    status: 'Upcoming',
    type: 'International',
    brochureUrl: '',
    proceedingsUrl: '',
  },
  'books.json': {
    title: '',
    author: '',
    isbn: '',
    image: '',
  },
  'awards.json': {
    authorName: '',
    title: '',
    eventName: '',
    eventDate: '',
    eventVenue: '',
    awardName: '',
  },
  'editors.json': {
    name: '',
    role: 'Director & Chief Editor',
    institution: '',
    image: '',
    category: 'Governing Council',
    email: '',
    contact: '',
    country: '',
    bio: '',
  },
  'notifications.json': {
    text: '',
    category: 'Update',
    date: '',
  },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('siteConfig.json');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [newItemMode, setNewItemMode] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const files: FileConfig[] = [
    { name: 'siteConfig.json', label: 'Site Settings', icon: Settings, type: 'object' },
    { name: 'conferences.json', label: 'Conferences', icon: Calendar, type: 'array' },
    { name: 'books.json', label: 'Books/Publications', icon: FileText, type: 'array' },
    { name: 'awards.json', label: 'Awards/Honors', icon: Award, type: 'array' },
    { name: 'editors.json', label: 'Editorial Board', icon: Users, type: 'array' },
    { name: 'notifications.json', label: 'Live Updates', icon: Bell, type: 'array' },
    { name: 'submissions.json', label: 'Submitted Papers', icon: FileText, type: 'array' },
    { name: 'stats.json', label: 'Statistics', icon: BarChart, type: 'stats' },
  ];

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/save-json?filename=${activeTab}`);
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(JSON.stringify(errorData, null, 2));
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `Could not load content: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
    setLoading(false);
  }, [activeTab]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Auth check
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      router.push('/admin/login');
    }

    const timeout = setTimeout(() => {
      if (!isAuth) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        fetchContent();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [router, fetchContent]);

  const currentFile = files.find(f => f.name === activeTab);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="size-8 text-primary animate-spin" />
      </main>
    );
  }

  const handleSave = async (updatedData: unknown) => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/save-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: activeTab, data: updatedData })
      });

      if (response.ok) {
        setData(updatedData);
        setStatus({ type: 'success', msg: 'Changes saved successfully!' });
        toastSuccess('Changes saved successfully!');
        setEditingItemIndex(null);
        setViewOnlyMode(false);
        setNewItemMode(false);
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      setStatus({ type: 'error', msg: 'Failed to save changes' });
      toastError('Failed to save changes');
    }
    setLoading(false);
  };

  const handleUpdateArrayItem = (index: number, updatedItem: unknown) => {
    if (!Array.isArray(data)) return;
    const newData = [...data];
    newData[index] = updatedItem;
    handleSave(newData);
  };

  const handleAddArrayItem = (newItem: unknown) => {
    if (!Array.isArray(data)) return;
    const newData = [newItem, ...data];
    handleSave(newData);
  };

  const confirmDeleteItem = () => {
    if (itemToDeleteIndex === null || !Array.isArray(data)) return;
    const newData = data.filter((_, i) => i !== itemToDeleteIndex);
    setItemToDeleteIndex(null);
    handleSave(newData);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
      {/* Delete Confirmation Modal */}
      {itemToDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="size-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-sans tracking-tight text-foreground">Delete Item</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Are you sure you want to delete this item? This action will immediately remove it from your website content.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setItemToDeleteIndex(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors text-foreground/70 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md shadow-red-600/20 cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-10 items-start">
           {/* Sidebar */}
           <div className="w-full space-y-2 sticky top-32 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-5 shadow-sm backdrop-blur-md">
              <div className="space-y-1">
                 {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => {
                        setActiveTab(file.name);
                        setData(null);
                        setEditingItemIndex(null);
                        setViewOnlyMode(false);
                        setNewItemMode(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left cursor-pointer ${
                        activeTab === file.name
                        ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                        : "hover:bg-primary/5 text-foreground/70 hover:text-primary border border-transparent"
                      }`}
                    >
                      <file.icon className={`size-4 transition-colors ${activeTab === file.name ? 'text-white' : 'text-primary'}`} />
                      <span className="font-bold text-[13px]">{file.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           {/* Content Area */}
           <div className="grow space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-white shadow-sm">
                 <div className="space-y-0.5">
                    <h2 className="text-xl font-sans font-bold tracking-tight text-foreground">{currentFile?.label}</h2>
                    <p className="text-xs text-foreground/40">Editing <span className="text-primary font-medium">{activeTab}</span></p>
                 </div>
                 {currentFile?.type === 'array' && activeTab !== 'submissions.json' && editingItemIndex === null && !newItemMode && (
                   <button
                     onClick={() => setNewItemMode(true)}
                     className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer"
                   >
                      <Plus className="size-3.5" />
                      Add
                   </button>
                 )}
              </div>

              {status && (
                 <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
                   status.type === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                 }`}>
                    {status.type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                    {status.msg}
                 </div>
              )}

              {loading || !data ? (
                <div className="h-64 flex items-center justify-center bg-white/30 rounded-3xl border border-dashed border-primary/20">
                   <RefreshCw className="size-6 text-primary animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                   {currentFile?.type === 'stats' ? (
                     <StatsEditor key={activeTab} data={data as { heroStats: Record<string, string>[], globalStats: Record<string, string>[] }} onSave={handleSave} loading={loading} />
                   ) : currentFile?.type === 'object' ? (
                     <ObjectEditor key={activeTab} data={data as Record<string, unknown>} onSave={handleSave} loading={loading} />
                   ) : (
                     <ArrayEditor
                        data={data as unknown[]}
                        onSave={handleUpdateArrayItem}
                        onDelete={(index) => setItemToDeleteIndex(index)}
                        onAdd={handleAddArrayItem}
                        loading={loading}
                        editingIndex={editingItemIndex}
                        setEditingIndex={setEditingItemIndex}
                        viewOnly={viewOnlyMode}
                        setViewOnly={setViewOnlyMode}
                        newMode={newItemMode}
                        setNewMode={setNewItemMode}
                        activeTab={activeTab}
                     />
                   )}
                </div>
              )}
        </div>
      </div>
    </div>
  );
}

function FileUploadButton({ onUpload, label, disabled = false }: { onUpload: (url: string) => void, label: string, disabled?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onUpload(data.url);
        toastSuccess('File uploaded successfully');
      } else {
        toastError(data.error || 'Upload failed');
      }
    } catch {
      toastError('File upload error occurred');
    } finally {
      setUploading(false);
    }
  };

  const id = `file-upload-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <label
        htmlFor={disabled ? undefined : id}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
          disabled
            ? "bg-slate-100 text-foreground/30 cursor-not-allowed border border-dashed border-slate-200"
            : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
        )}
      >
        {uploading ? <RefreshCw className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        {label}
      </label>
    </div>
  );
}

function FileUploadField({ label, value, onChange, disabled = false }: { label: string, value: string, onChange: (val: string) => void, disabled?: boolean }) {
  const [isManualUrl, setIsManualUrl] = useState(false);
  const fileName = value ? value.split('/').pop() : "";
  const displayLabel = label.replace(/url/i, '').replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center pb-1 border-b border-slate-50">
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">
          {displayLabel}
        </label>
        {!disabled && (
          <button
            type="button"
            onClick={() => setIsManualUrl(!isManualUrl)}
            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
          >
            {isManualUrl ? "Switch to Upload" : "Enter URL directly"}
          </button>
        )}
      </div>

      {isManualUrl && !disabled ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            disabled={disabled}
            placeholder="Paste image/file URL or path (e.g. /images/..., https://...)"
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full text-foreground focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 transition-all border",
              disabled
                ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
                : "bg-white border-slate-200"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Clear"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      ) : value ? (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-xs font-bold text-primary hover:underline truncate"
            >
              <FileText className="size-4 shrink-0" />
              <span className="truncate">{fileName || value}</span>
            </a>
            {!disabled && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualUrl(true)}
                  className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Edit URL directly"
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove File"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )}
          </div>
          
          {!disabled && (
            <div className="flex gap-2">
              <FileUploadButton onUpload={(url) => onChange(url)} label="Change File" disabled={disabled} />
            </div>
          )}
        </div>
      ) : (
        <div className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 gap-2",
          !disabled && "hover:border-primary/30 transition-colors"
        )}>
          {disabled ? (
            <span className="text-xs text-foreground/30 font-medium">No file uploaded</span>
          ) : (
            <>
              <FileUploadButton onUpload={(url) => onChange(url)} label="Upload File" disabled={disabled} />
              <span className="text-[11px] text-foreground/40 font-medium">or</span>
              <button
                type="button"
                onClick={() => setIsManualUrl(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Enter image URL / link manually
              </button>
            </>
          )}
        </div>
      )}

      {value && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex justify-center overflow-hidden">
          {value.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || value.includes('image') || value.startsWith('data:image/') ? (
            <NextImage
              src={value}
              width={400}
              height={160}
              style={{ width: 'auto', height: 'auto' }}
              className="max-h-40 rounded-lg shadow-sm hover:scale-105 transition-transform object-contain"
              alt="Preview"
              unoptimized
            />
          ) : (
            <div className="flex items-center gap-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 rounded-lg">
              <FileText className="size-4" />
              Linked Document
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchableLinkPicker({ value, onChange, onCustom, disabled = false }: { value: string, onChange: (v: string) => void, onCustom: () => void, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = DERIVED_LINKS.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.value.toLowerCase().includes(search.toLowerCase())
  );

  const currentLink = DERIVED_LINKS.find(l => l.value === value);

  return (
    <div className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between shadow-sm border",
          disabled
            ? "bg-slate-50 border-slate-200 text-foreground/45 cursor-not-allowed"
            : "bg-white border-slate-200 text-foreground cursor-pointer hover:border-primary/30 transition-all"
        )}
      >
        <span className={value ? (disabled ? "text-foreground/70" : "text-foreground") : "text-foreground/30"}>
          {currentLink ? `${currentLink.label} (${currentLink.value})` : "Select a page..."}
        </span>
        <ChevronRight className={cn("size-4 text-foreground/20 transition-transform", isOpen && !disabled ? "rotate-90" : "rotate-0")} />
      </div>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              autoFocus
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all mb-1"
            />
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filtered.map(link => (
                <button
                  key={link.value}
                  onClick={() => {
                    onChange(link.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group cursor-pointer",
                    value === link.value ? "bg-primary/5 text-primary" : "hover:bg-slate-50"
                  )}
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-20 group-hover:opacity-40">{link.value}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-foreground/30 font-medium">No results found</div>
              )}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    onCustom();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" />
                  Custom URL / External Link
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FieldEditor({
  label,
  value,
  onChange,
  activeTab,
  isNested = false,
  disabled = false
}: {
  label: string;
  value: unknown;
  onChange: (val: unknown) => void;
  activeTab?: string;
  isNested?: boolean;
  disabled?: boolean;
}) {
  const isFilePath = !label.toLowerCase().includes('text') &&
                   !label.toLowerCase().includes('title') && (
                   label.toLowerCase().includes('image') ||
                   label.toLowerCase().includes('brochure') ||
                   label.toLowerCase().includes('proceedings') ||
                   label.toLowerCase().includes('paper') ||
                   label.toLowerCase().includes('file'));

  const stringValue = String(value || "");
  const isLinkField = !isFilePath && (label.toLowerCase().includes('link') || label.toLowerCase().includes('url') || label.toLowerCase().includes('href'));
  const isDerivedLink = isLinkField && DERIVED_LINKS.some(link => link.value === stringValue);
  const [isCustomLink, setIsCustomLink] = useState(isLinkField && !isDerivedLink && stringValue !== "");

  if (isFilePath) {
    return (
      <FileUploadField
        label={label}
        value={stringValue}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  if (Array.isArray(value)) {
    const displayLabel = label.replace(/url/i, '').replace(/([A-Z])/g, ' $1').trim();
    return (
      <div className={`space-y-3 ${isNested ? 'pl-4 border-l-2 border-primary/10 py-2' : ''}`}>
        <div className="flex justify-between items-center">
           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{displayLabel}</label>
        </div>
        <div className="space-y-2">
          {value.map((item: string, i: number) => (
            <div key={i} className="flex gap-2 group">
              <input
                type="text"
                value={item}
                disabled={disabled}
                onChange={(e) => {
                  const newList = [...value];
                  newList[i] = e.target.value;
                  onChange(newList);
                }}
                className={cn(
                  "grow rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border",
                  disabled
                    ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
                    : "bg-white border-slate-200 text-foreground"
                )}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => {
                    const newList = value.filter((_, idx) => idx !== i);
                    onChange(newList);
                  }}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange([...value, ""])}
              className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider p-2 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="size-3" /> Add Item
            </button>
          )}
        </div>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    const displayLabel = label.replace(/url/i, '').replace(/([A-Z])/g, ' $1').trim();
    return (
      <div className={`space-y-4 ${isNested ? 'pl-4 border-l-2 border-primary/10 py-2' : ''}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{displayLabel}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          {Object.entries(value).map(([subKey, subValue]) => (
            <FieldEditor
              key={subKey}
              label={subKey}
              value={subValue}
              isNested={true}
              activeTab={activeTab}
              disabled={disabled}
              onChange={(newVal) => onChange({ ...(value as Record<string, unknown>), [subKey]: newVal })}
          />
          ))}
        </div>
      </div>
    );
  }

  const isLongText = stringValue.length > 100 || label.toLowerCase().includes('message') || label.toLowerCase().includes('description') || label.toLowerCase().includes('bio');
  const isCategoryField = label.toLowerCase() === 'category' || label.toLowerCase() === 'type' || label.toLowerCase() === 'icon' || label.toLowerCase() === 'status' || (label.toLowerCase() === 'role' && activeTab === 'editors.json');
  const isDateField = label.toLowerCase().includes('startdate') || label.toLowerCase().includes('enddate');
  const isDisplayDateField = !isDateField && (label.toLowerCase() === 'date' || label.toLowerCase().includes('date'));

  const EDITOR_CATEGORIES = ["Governing Council", "Advisory Board", "Executive Editorial Board", "Associate Editors", "Reviewers"];
  const EDITOR_ROLES = [
    "Director & Chief Editor",
    "Executive Associate Editor",
    "Global Advisory Head",
    "Governing Council Member",
    "Senior Editor",
    "Associate Editor",
    "Reviewer"
  ];
  const NOTIFICATION_CATEGORIES = ["News", "Update", "Deadline", "Alert"];
  const CONF_TYPES = ["International", "National"];
  const CONF_STATUS = ["Upcoming", "Ongoing", "Past"];
  const STAT_ICONS = ["Users", "Calendar", "BookOpen", "Award", "Globe"];

  const optionsList = (() => {
    let list: string[] = [];
    if (label.toLowerCase() === 'role' && activeTab === 'editors.json') {
      list = EDITOR_ROLES;
    } else if (label.toLowerCase() === 'category') {
      list = activeTab === 'editors.json' ? EDITOR_CATEGORIES : NOTIFICATION_CATEGORIES;
    } else if (label.toLowerCase() === 'type') {
      list = CONF_TYPES;
    } else if (label.toLowerCase() === 'status') {
      list = CONF_STATUS;
    } else {
      list = STAT_ICONS;
    }
    return list.filter((v, i, a) => a.indexOf(v) === i).map(item => ({ value: item, label: item }));
  })();

  const displayLabel = label.replace(/url/i, '').replace(/([A-Z])/g, ' $1').trim();
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end pb-1 border-b border-slate-50">
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{displayLabel}</label>
      </div>
      {isLongText ? (
        <textarea
          value={stringValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-24 leading-relaxed border",
            disabled
              ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
              : "bg-white border-slate-200 text-foreground"
          )}
        />
      ) : isDateField ? (
        <input
          type="date"
          value={stringValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border",
            disabled
              ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
              : "bg-white border-slate-200 text-foreground cursor-pointer"
          )}
        />
      ) : isDisplayDateField ? (
        <div className="space-y-1">
          <input
            type="text"
            value={stringValue}
            disabled={disabled}
            placeholder="e.g. 15 – 17 Oct, 2026 or 2025-11-20"
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border",
              disabled
                ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
                : "bg-white border-slate-200 text-foreground"
            )}
          />
          <p className="text-[10px] text-foreground/40 ml-1">You can enter any date range, past or future dates.</p>
        </div>
      ) : isCategoryField ? (
        <CustomSelect
          options={optionsList}
          value={stringValue}
          onChange={onChange}
          placeholder={`Select ${label.replace(/([A-Z])/g, ' $1')}...`}
          disabled={disabled}
        />
      ) : isLinkField && !isCustomLink ? (
        <SearchableLinkPicker
          value={stringValue}
          onChange={onChange}
          onCustom={() => setIsCustomLink(true)}
          disabled={disabled}
        />
      ) : (
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={stringValue}
            disabled={disabled}
            placeholder={isLinkField ? "https://..." : ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full text-foreground focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 transition-all border",
              disabled
                ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
                : "bg-white border-slate-200"
            )}
          />
          {isLinkField && !disabled && (
            <button
              type="button"
              onClick={() => {
                setIsCustomLink(false);
                onChange("/"); // Reset to a safe default
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-foreground/40 hover:bg-slate-100 hover:text-primary transition-all shrink-0 cursor-pointer"
              title="Switch back to suggestions"
            >
              <RefreshCw className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ObjectEditor({ data, onSave, loading }: { data: Record<string, unknown>, onSave: (d: unknown) => void, loading: boolean }) {
  const [formData, setFormData] = useState<Record<string, unknown>>(data);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setFormData(data);
    setIsEditing(true);
  }, [data]);

  return (
    <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-xl bg-white space-y-8 w-full">
        <div className="grid grid-cols-1 gap-y-8">
          {Object.entries(formData).map(([key, value]) => (
            <FieldEditor
              key={key}
              label={key}
              value={value}
              disabled={!isEditing}
              onChange={(newVal) => setFormData((prev) => ({ ...prev, [key]: newVal }))}
            />
          ))}
        </div>
       <div className="pt-6 border-t border-slate-100 flex gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  await onSave(formData);
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                 {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                 Save All Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(data);
                }}
                className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border border-slate-200 text-foreground/60 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Reset
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
               <Edit3 className="size-4" />
               Edit Settings
            </button>
          )}
       </div>
    </GlassContainer>
  );
}

function StatsEditor({ data, onSave, loading }: { data: { heroStats: Record<string, string>[], globalStats: Record<string, string>[] }, onSave: (d: unknown) => void, loading: boolean }) {
  const [formData, setFormData] = useState(data || { heroStats: [], globalStats: [] });
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setFormData(data || { heroStats: [], globalStats: [] });
    setIsEditing(true);
  }, [data]);

  const handleChange = (section: 'heroStats' | 'globalStats', index: number, field: string, value: string) => {
    const newSection = [...(formData[section] || [])];
    newSection[index] = { ...newSection[index], [field]: value };
    setFormData({ ...formData, [section]: newSection });
  };

  const renderCard = (stat: Record<string, string>, index: number, section: 'heroStats' | 'globalStats') => (
    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group">
      <div className="space-y-4">
        {section === 'heroStats' && (
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Icon</label>
            <CustomSelect
              options={[
                { value: "Users", label: "Users" },
                { value: "Calendar", label: "Calendar" },
                { value: "BookOpen", label: "BookOpen" },
                { value: "Award", label: "Award" },
                { value: "Globe", label: "Globe" }
              ]}
              value={stat.icon || 'Users'}
              onChange={(val) => handleChange(section, index, 'icon', val)}
              disabled={!isEditing}
            />
          </div>
        )}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Value (e.g., 500+)</label>
          <input
            type="text"
            value={stat.value || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange(section, index, 'value', e.target.value)}
            className={cn(
              "w-full border rounded-xl px-4 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              !isEditing
                ? "bg-slate-100 border-slate-200 text-primary/60 cursor-not-allowed"
                : "bg-white border-slate-200"
            )}
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Label</label>
          <input
            type="text"
            value={stat.label || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange(section, index, 'label', e.target.value)}
            className={cn(
              "w-full border rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20",
              !isEditing
                ? "bg-slate-100 border-slate-200 text-foreground/45 cursor-not-allowed"
                : "bg-white border-slate-200"
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <GlassContainer variant="light" className="p-8 border-none shadow-xl bg-white space-y-6">
        <h3 className="text-xl font-sans font-bold tracking-tight text-foreground">Hero Floating Stats (White Cards)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.heroStats?.map((stat, i) => renderCard(stat, i, 'heroStats'))}
        </div>
      </GlassContainer>

      <GlassContainer variant="light" className="p-8 border-none shadow-xl bg-white space-y-6">
        <h3 className="text-xl font-sans font-bold tracking-tight text-foreground">Global Stats (Blue Section)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formData.globalStats?.map((stat, i) => renderCard(stat, i, 'globalStats'))}
        </div>
      </GlassContainer>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={async () => {
                await onSave(formData);
              }}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
               {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
               Save Statistics
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(data || { heroStats: [], globalStats: [] });
              }}
              className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border border-slate-200 text-foreground/60 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Reset
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
             <Edit3 className="size-4" />
             Edit Statistics
          </button>
        )}
      </div>
    </div>
  );
}

function ArrayEditor({
  data,
  onSave,
  onDelete,
  onAdd,
  loading,
  editingIndex,
  setEditingIndex,
  viewOnly,
  setViewOnly,
  newMode,
  setNewMode,
  activeTab
}: {
  data: unknown[],
  onSave: (i: number, d: unknown) => void,
  onDelete: (i: number) => void,
  onAdd: (d: unknown) => void,
  loading: boolean,
  editingIndex: number | null,
  setEditingIndex: (i: number | null) => void,
  viewOnly: boolean,
  setViewOnly: (b: boolean) => void,
  newMode: boolean,
  setNewMode: (b: boolean) => void,
  activeTab: string
}) {
  if (!data || !Array.isArray(data)) return null;

  const renderItemBadges = (it: Record<string, unknown>) => {
    const badges: { text: string; variant: 'primary' | 'success' | 'warning' | 'secondary' }[] = [];

    if (activeTab === 'conferences.json') {
      if (it.type) badges.push({ text: String(it.type), variant: 'primary' });
      if (it.status) {
        badges.push({
          text: String(it.status),
          variant: it.status === 'Upcoming' ? 'success' : (it.status === 'Ongoing' ? 'warning' : 'secondary')
        });
      }
    } else if (activeTab === 'editors.json') {
      if (it.category) badges.push({ text: String(it.category), variant: 'secondary' });
    } else if (activeTab === 'notifications.json') {
      if (it.category) {
        badges.push({
          text: String(it.category),
          variant: it.category === 'Alert' ? 'warning' : 'primary'
        });
      }
    } else if (activeTab === 'submissions.json') {
      if (it.conferenceTitle) badges.push({ text: String(it.conferenceTitle), variant: 'primary' });
    }

    const getColors = (variant: 'primary' | 'success' | 'warning' | 'secondary') => {
      switch (variant) {
        case 'primary':
          return 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/30';
        case 'success':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/30';
        case 'warning':
          return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/30';
        case 'secondary':
          return 'bg-slate-100 text-slate-700 border-slate-200/50 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/50';
      }
    };

    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {badges.map((b, index) => (
          <span
            key={index}
            className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${getColors(b.variant)}`}
          >
            {b.text}
          </span>
        ))}
      </div>
    );
  };

  const renderItemDetails = (it: Record<string, unknown>) => {
    const items: { icon: React.ElementType; text: string }[] = [];

    if (activeTab === 'conferences.json') {
      if (it.date) items.push({ icon: Calendar, text: String(it.date) });
      if (it.venue) items.push({ icon: MapPin, text: String(it.venue) });
    } else if (activeTab === 'books.json') {
      if (it.author) items.push({ icon: User, text: String(it.author) });
      if (it.isbn) items.push({ icon: FileText, text: `ISBN: ${String(it.isbn)}` });
    } else if (activeTab === 'awards.json') {
      if (it.authorName) items.push({ icon: User, text: String(it.authorName) });
      if (it.awardName) items.push({ icon: Award, text: String(it.awardName) });
      if (it.eventName) items.push({ icon: Calendar, text: String(it.eventName) });
      if (it.eventVenue) items.push({ icon: MapPin, text: String(it.eventVenue) });
    } else if (activeTab === 'editors.json') {
      if (it.role) items.push({ icon: Users, text: String(it.role) });
      if (it.institution) items.push({ icon: Building2, text: String(it.institution) });
    } else if (activeTab === 'notifications.json') {
      if (it.date) items.push({ icon: Calendar, text: String(it.date) });
    } else if (activeTab === 'submissions.json') {
      if (it.fullName) items.push({ icon: User, text: String(it.fullName) });
      if (it.email) items.push({ icon: Mail, text: String(it.email) });
      if (it.phone && it.phone !== 'N/A') items.push({ icon: Phone, text: String(it.phone) });
      if (it.affiliation && it.affiliation !== 'N/A') items.push({ icon: Building2, text: String(it.affiliation) });
      if (it.submittedAt) {
        items.push({ icon: Calendar, text: `Submitted: ${new Date(String(it.submittedAt)).toLocaleDateString()}` });
      }
    }

    return (
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-foreground/50 font-medium">
            <item.icon className="size-3.5 text-primary/50" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  if (newMode) {
    const schemaTemplate = TAB_SCHEMAS[activeTab] || {};
    const sampleItem = (data && data.length > 0 && typeof data[0] === 'object' && data[0] !== null)
      ? (data[0] as Record<string, unknown>)
      : {};

    const emptyItem: Record<string, unknown> = { ...schemaTemplate };
    Object.keys(sampleItem).forEach((k) => {
      if (k !== 'id' && !(k in emptyItem)) {
        emptyItem[k] = '';
      }
    });

    return (
      <ItemForm
        item={emptyItem}
        onSave={(item: unknown) => {
          const itemWithId = {
            ...(item as Record<string, unknown>),
            id: (item as Record<string, unknown>).id || `item-${Date.now()}`
          };
          onAdd(itemWithId);
        }}
        onCancel={() => setNewMode(false)}
        loading={loading}
        title="Add"
        initialEditing={true}
        activeTab={activeTab}
      />
    );
  }

  if (editingIndex !== null) {
    const rawItem = data[editingIndex];
    const schemaTemplate = TAB_SCHEMAS[activeTab] || {};
    const itemData = (typeof rawItem === 'object' && rawItem !== null)
      ? { ...schemaTemplate, ...(rawItem as Record<string, unknown>) }
      : { ...schemaTemplate };

    return (
      <ItemForm
        item={itemData}
        onSave={(updatedItem: unknown) => onSave(editingIndex, updatedItem)}
        onCancel={() => {
          setEditingIndex(null);
          setViewOnly(false);
        }}
        loading={loading}
        title={viewOnly ? "Details" : "Edit Item"}
        initialEditing={!viewOnly}
        activeTab={activeTab}
      />
    );
  }

  if (data.length === 0) {
    const isSubmissions = activeTab === 'submissions.json';
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white border border-dashed border-slate-200 rounded-3xl text-center space-y-4">
        <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-foreground/30">
          <FileText className="size-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-sans font-bold text-lg tracking-tight text-foreground">
            {isSubmissions ? "No Submitted Papers Yet" : "No Items Found"}
          </h3>
          <p className="text-xs text-foreground/45 max-w-sm">
            {isSubmissions
              ? "When researchers submit paper manuscripts through the registration portal, they will appear here automatically."
              : "There are currently no items in this list. Click 'Add' to create one."}
          </p>
        </div>
        {!isSubmissions && (
          <button
            onClick={() => setNewMode(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer mt-2"
          >
            <Plus className="size-4" />
            Add
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
       {data.map((item: unknown, i: number) => {
          const it = item as Record<string, unknown>;
          return (
            <div
              key={i}
              onClick={() => {
                setViewOnly(true);
                setEditingIndex(i);
              }}
              className="group relative bg-white border border-zinc-200/50 dark:bg-zinc-900/60 dark:border-zinc-850/60 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-primary/25 transition-all duration-300 flex items-center justify-between gap-6 cursor-pointer overflow-hidden"
            >
              <div className="grow flex items-center gap-5">
                 {!!(it.image || it.imageUrl) && (
                   <div className="relative size-12 rounded-xl overflow-hidden border border-zinc-200/50 shadow-xs shrink-0 bg-slate-50">
                     <NextImage 
                       src={String(it.image || it.imageUrl)} 
                       alt=""
                       fill
                       className="object-cover"
                     />
                   </div>
                 )}
                 <div className="grow space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans font-extrabold text-sm text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {String(it.paperTitle || it.title || it.name || it.awardName || it.text || `Item ${i + 1}`)}
                      </h3>
                      {renderItemBadges(it)}
                    </div>
                    {renderItemDetails(it)}
                 </div>
              </div>

               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    {activeTab !== 'submissions.json' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewOnly(false);
                          setEditingIndex(i);
                        }}
                        className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all hover:scale-110 cursor-pointer bg-primary/5"
                        title="Edit Item"
                      >
                         <Edit3 className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(i);
                      }}
                      className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110 cursor-pointer bg-red-50"
                      title="Delete Item"
                    >
                       <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewOnly(true);
                      setEditingIndex(i);
                    }}
                    className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
               </div>
            </div>
          );
       })}
    </div>
  );
}

function ItemForm({
  item,
  onSave,
  onCancel,
  loading,
  title,
  initialEditing,
  activeTab
}: {
  item: unknown,
  onSave: (d: unknown) => void,
  onCancel: () => void,
  loading: boolean,
  title: string,
  initialEditing?: boolean,
  activeTab: string
}) {
  const schemaTemplate = TAB_SCHEMAS[activeTab] || {};
  const normalizeItem = (raw: unknown): Record<string, unknown> => {
    if (typeof raw === 'object' && raw !== null) {
      return { ...schemaTemplate, ...(raw as Record<string, unknown>) };
    }
    return { ...schemaTemplate };
  };

  const [formData, setFormData] = useState<Record<string, unknown>>(() => normalizeItem(item));
  const isNewItem = title.toLowerCase().includes('add');
  const isReadOnly = activeTab === 'submissions.json';
  const [isEditing, setIsEditing] = useState(initialEditing !== undefined ? initialEditing : !isReadOnly);

  // Re-sync with item if it changes
  useEffect(() => {
    setFormData(normalizeItem(item));
    setIsEditing(initialEditing !== undefined ? initialEditing : !isReadOnly);
  }, [item, isReadOnly, activeTab, initialEditing]);

  // Determine all fields to render
  const entries = (() => {
    const currentKeys = Object.keys(formData);
    const schemaKeys = Object.keys(schemaTemplate);
    // Combine unique keys while keeping schema fields first
    const allKeys = Array.from(new Set([...schemaKeys, ...currentKeys]));

    return allKeys
      .filter((key) => {
        if (key === 'id') return false;
        if (activeTab === 'notifications.json') {
          return ['text', 'category', 'date'].includes(key);
        }
        return true;
      })
      .map((key) => [key, formData[key] ?? ''] as [string, unknown]);
  })();

  const itemTitle = String(
    formData.paperTitle ||
    formData.title ||
    formData.name ||
    formData.awardName ||
    formData.text ||
    'Item Detail'
  );

  const displayTitle = isNewItem 
    ? title 
    : (isEditing ? `Edit: ${itemTitle}` : itemTitle);

  return (
    <div className="animate-in zoom-in-95 duration-200 w-full">
      <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-2xl bg-white space-y-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {isNewItem ? 'New Record' : (isEditing ? 'Editing Mode' : 'Details View')}
              </span>
              <h3 className="text-xl font-sans font-bold tracking-tight text-foreground">{displayTitle}</h3>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <X className="size-5 text-foreground/40" />
            </button>
        </div>
        <div className="grid grid-cols-1 gap-y-8">
            {entries.map(([key, value]) => {
              return (
                <FieldEditor
                  key={key}
                  label={key}
                  value={value}
                  activeTab={activeTab}
                  disabled={!isEditing}
                  onChange={(newVal) => setFormData((prev) => ({ ...prev, [key]: newVal }))}
                />
              );
            })}
        </div>
        <div className="pt-6 border-t border-slate-100 flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => onSave(formData)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save Item
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isNewItem) {
                      onCancel();
                    } else {
                      setFormData(item as Record<string, unknown>);
                      setIsEditing(false);
                    }
                  }}
                  className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border border-slate-200 text-foreground/60 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {activeTab !== 'submissions.json' && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    <Edit3 className="size-4" />
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border border-slate-200 text-foreground/60 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
        </div>
      </GlassContainer>
    </div>
  );
}
