"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, RefreshCw, FileText, Settings, CheckCircle2,
  AlertCircle, Plus, Trash2, Edit3, ChevronRight, X, Bell,
  Calendar, Award, Users, BarChart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassContainer } from '@/components/GlassContainer';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('siteConfig.json');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [newItemMode, setNewItemMode] = useState(false);
  const router = useRouter();

  const files: FileConfig[] = [
    { name: 'siteConfig.json', label: 'Site Settings', icon: Settings, type: 'object' },
    { name: 'conferences.json', label: 'Conferences', icon: Calendar, type: 'array' },
    { name: 'books.json', label: 'Books/Publications', icon: FileText, type: 'array' },
    { name: 'awards.json', label: 'Awards/Honors', icon: Award, type: 'array' },
    { name: 'editors.json', label: 'Editorial Board', icon: Users, type: 'array' },
    { name: 'notifications.json', label: 'Live Updates', icon: Bell, type: 'array' },
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
        setEditingItemIndex(null);
        setNewItemMode(false);
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      setStatus({ type: 'error', msg: 'Failed to save changes' });
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

  const handleDeleteArrayItem = (index: number) => {
    if (!Array.isArray(data)) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      const newData = data.filter((_, i) => i !== index);
      handleSave(newData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-10 items-start">
           {/* Sidebar */}
           <div className="w-full space-y-2 sticky top-32">
              <div className="space-y-1">
                 {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => {
                        setActiveTab(file.name);
                        setData(null);
                        setEditingItemIndex(null);
                        setNewItemMode(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left cursor-pointer ${
                        activeTab === file.name
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-white/50 hover:bg-primary/5 text-foreground/60 border border-transparent"
                      }`}
                    >
                      <file.icon className={`size-4 ${activeTab === file.name ? 'text-white' : 'text-primary'}`} />
                      <span className="font-bold text-[13px]">{file.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           {/* Content Area */}
           <div className="grow space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-white shadow-sm">
                 <div className="space-y-0.5">
                    <h2 className="text-xl font-serif font-bold text-foreground">{currentFile?.label}</h2>
                    <p className="text-xs text-foreground/40">Editing <span className="text-primary font-medium">{activeTab}</span></p>
                 </div>
                 {currentFile?.type === 'array' && editingItemIndex === null && !newItemMode && (
                   <button
                     onClick={() => setNewItemMode(true)}
                     className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer"
                   >
                      <Plus className="size-3.5" />
                      Add New Item
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
                        onDelete={handleDeleteArrayItem}
                        onAdd={handleAddArrayItem}
                        loading={loading}
                        editingIndex={editingItemIndex}
                        setEditingIndex={setEditingItemIndex}
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

function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/20 transition-all"
      >
        {uploading ? <RefreshCw className="size-3 animate-spin" /> : <Plus className="size-3" />}
        Upload File
      </label>
    </div>
  );
}

function SearchableLinkPicker({ value, onChange, onCustom }: { value: string, onChange: (v: string) => void, onCustom: () => void }) {
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-foreground flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all shadow-sm"
      >
        <span className={value ? "text-foreground" : "text-foreground/30"}>
          {currentLink ? `${currentLink.label} (${currentLink.value})` : "Select a page..."}
        </span>
        <ChevronRight className={cn("size-4 text-foreground/20 transition-transform", isOpen ? "rotate-90" : "rotate-0")} />
      </div>

      {isOpen && (
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
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group",
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
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all flex items-center gap-2"
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

function FieldEditor({ label, value, onChange, isNested = false }: { label: string, value: unknown, onChange: (val: unknown) => void, isNested?: boolean }) {
  const isFilePath = !label.toLowerCase().includes('text') && (
                   label.toLowerCase().includes('image') ||
                   label.toLowerCase().includes('brochure') ||
                   label.toLowerCase().includes('proceedings') ||
                   label.toLowerCase().includes('file'));

  const stringValue = String(value || "");
  const isLinkField = !isFilePath && (label.toLowerCase().includes('link') || label.toLowerCase().includes('url') || label.toLowerCase().includes('href'));
  const isDerivedLink = isLinkField && DERIVED_LINKS.some(link => link.value === stringValue);
  const [isCustomLink, setIsCustomLink] = useState(isLinkField && !isDerivedLink && stringValue !== "");

  if (Array.isArray(value)) {
    return (
      <div className={`space-y-3 ${isNested ? 'pl-4 border-l-2 border-primary/10 py-2' : ''}`}>
        <div className="flex justify-between items-center">
           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{label.replace(/([A-Z])/g, ' $1')}</label>
        </div>
        <div className="space-y-2">
          {value.map((item: string, i: number) => (
            <div key={i} className="flex gap-2 group">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newList = [...value];
                  newList[i] = e.target.value;
                  onChange(newList);
                }}
                className="grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={() => {
                  const newList = value.filter((_, idx) => idx !== i);
                  onChange(newList);
                }}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...value, ""])}
            className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider p-2 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="size-3" /> Add Item
          </button>
        </div>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className={`space-y-4 ${isNested ? 'pl-4 border-l-2 border-primary/10 py-2' : ''}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{label.replace(/([A-Z])/g, ' $1')}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          {Object.entries(value).map(([subKey, subValue]) => (
            <FieldEditor
              key={subKey}
              label={subKey}
              value={subValue}
              isNested={true}
              onChange={(newVal) => onChange({ ...(value as Record<string, unknown>), [subKey]: newVal })}
            />
          ))}
        </div>
      </div>
    );
  }

  const isLongText = stringValue.length > 100 || label.toLowerCase().includes('message') || label.toLowerCase().includes('description');

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end pb-1 border-b border-slate-50">
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{label.replace(/([A-Z])/g, ' $1')}</label>
        {isFilePath && <FileUpload onUpload={(url) => onChange(url)} />}
      </div>
      {isLongText ? (
        <textarea
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-24 leading-relaxed"
        />
      ) : isLinkField && !isCustomLink ? (
        <SearchableLinkPicker
          value={stringValue}
          onChange={onChange}
          onCustom={() => setIsCustomLink(true)}
        />
      ) : (
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={stringValue}
            readOnly={isFilePath}
            placeholder={isLinkField ? "https://..." : ""}
            onChange={(e) => !isFilePath && onChange(e.target.value)}
            className={cn(
              "w-full border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 transition-all",
              isFilePath
                ? "bg-slate-50 border-slate-200 text-foreground/40 cursor-not-allowed"
                : "bg-white border-slate-200 text-foreground focus:ring-primary/20"
            )}
          />
          {isLinkField && (
            <button
              onClick={() => {
                setIsCustomLink(false);
                onChange("/"); // Reset to a safe default
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-foreground/40 hover:bg-slate-100 hover:text-primary transition-all shrink-0"
              title="Switch back to suggestions"
            >
              <RefreshCw className="size-4" />
            </button>
          )}
        </div>
      )}

      {isFilePath && stringValue && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex justify-center overflow-hidden">
          {stringValue.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || stringValue.includes('image') ? (
            <NextImage
              src={stringValue}
              width={400}
              height={160}
              className="max-h-40 w-auto rounded-lg shadow-sm hover:scale-105 transition-transform object-contain"
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

function ObjectEditor({ data, onSave, loading }: { data: Record<string, unknown>, onSave: (d: unknown) => void, loading: boolean }) {
  const [formData, setFormData] = useState<Record<string, unknown>>(data);

  return (
    <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-xl bg-white space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {Object.entries(formData).map(([key, value]) => (
            <FieldEditor
              key={key}
              label={key}
              value={value}
              onChange={(newVal) => setFormData((prev) => ({ ...prev, [key]: newVal }))}
            />
          ))}
        </div>
       <div className="pt-6 border-t border-slate-100">
          <button
            onClick={() => onSave(formData)}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
             {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
             Save All Settings
          </button>
       </div>
    </GlassContainer>
  );
}

function StatsEditor({ data, onSave, loading }: { data: { heroStats: Record<string, string>[], globalStats: Record<string, string>[] }, onSave: (d: unknown) => void, loading: boolean }) {
  const [formData, setFormData] = useState(data || { heroStats: [], globalStats: [] });

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
            <select
              value={stat.icon || 'Users'}
              onChange={(e) => handleChange(section, index, 'icon', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Users">Users</option>
              <option value="Calendar">Calendar</option>
              <option value="BookOpen">BookOpen</option>
              <option value="Award">Award</option>
              <option value="Globe">Globe</option>
            </select>
          </div>
        )}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Value (e.g., 500+)</label>
          <input
            type="text"
            value={stat.value || ''}
            onChange={(e) => handleChange(section, index, 'value', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Label</label>
          <input
            type="text"
            value={stat.label || ''}
            onChange={(e) => handleChange(section, index, 'label', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <GlassContainer variant="light" className="p-8 border-none shadow-xl bg-white space-y-6">
        <h3 className="text-xl font-serif font-bold text-foreground">Hero Floating Stats (White Cards)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.heroStats?.map((stat, i) => renderCard(stat, i, 'heroStats'))}
        </div>
      </GlassContainer>

      <GlassContainer variant="light" className="p-8 border-none shadow-xl bg-white space-y-6">
        <h3 className="text-xl font-serif font-bold text-foreground">Global Stats (Blue Section)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formData.globalStats?.map((stat, i) => renderCard(stat, i, 'globalStats'))}
        </div>
      </GlassContainer>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
        >
           {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
           Save Statistics
        </button>
      </div>
    </div>
  );
}

function ArrayEditor({ data, onSave, onDelete, onAdd, loading, editingIndex, setEditingIndex, newMode, setNewMode, activeTab }: {
  data: unknown[],
  onSave: (i: number, d: unknown) => void,
  onDelete: (i: number) => void,
  onAdd: (d: unknown) => void,
  loading: boolean,
  editingIndex: number | null,
  setEditingIndex: (i: number | null) => void,
  newMode: boolean,
  setNewMode: (b: boolean) => void,
  activeTab: string
}) {
  if (!data || !Array.isArray(data)) return null;

  if (newMode) {
    const emptyItem = Object.keys(data[0] || {}).reduce((acc: Record<string, unknown>, key) => {
      if (activeTab === 'notifications.json' && !['text', 'category', 'date'].includes(key)) return acc;
      acc[key] = "";
      return acc;
    }, {});

    return <ItemForm
      item={emptyItem}
      onSave={(item: unknown) => {
        const itemWithId = { ...(item as Record<string, unknown>), id: `item-${Date.now()}` };
        onAdd(itemWithId);
      }}
      onCancel={() => setNewMode(false)}
      loading={loading}
      title="Add New Item"
      activeTab={activeTab}
    />;
  }

  if (editingIndex !== null) {
    return <ItemForm item={data[editingIndex]} onSave={(updatedItem: unknown) => onSave(editingIndex, updatedItem)} onCancel={() => setEditingIndex(null)} loading={loading} title="Edit Item" activeTab={activeTab} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
       {data.map((item: unknown, i: number) => {
          const it = item as Record<string, unknown>;
          return (
            <div
              key={i}
              onClick={() => setEditingIndex(i)}
              className="group relative bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-6 cursor-pointer overflow-hidden"
            >
               {/* Accent bar */}
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 group-hover:w-1.5 group-hover:bg-primary transition-all duration-300" />

               <div className="grow space-y-1.5 pl-2">
                   <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-[15px] text-foreground group-hover:text-primary transition-colors duration-300">
                      {String(it.title || it.name || it.awardName || it.text || `Item ${i + 1}`)}
                    </h3>
                    {(it.active === true || it.status === "Upcoming") && (
                      <span className="size-2 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/20" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      {[
                        it.role,
                        it.author,
                        it.authorName,
                        it.category,
                        it.type,
                        it.date || it.eventDate,
                        it.institution
                      ].filter(Boolean).map((part, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span className="text-foreground/60">{String(part)}</span>
                          {idx < arr.length - 1 && <span className="text-primary/20 text-[8px]">•</span>}
                        </React.Fragment>
                      ))}
                    </p>
                    {!!(it.venue || it.eventVenue) && (
                      <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-primary/20" />
                        {String(it.venue || it.eventVenue)}
                      </p>
                    )}
                    {!!(it.link || it.url || it.href || it.heroButtonLink || it.primaryButtonLink || it.secondaryButtonLink || it.brochureUrl || it.proceedingsUrl) && (
                      <p className="text-[10px] text-primary/60 font-medium lowercase tracking-tight flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-primary/40" />
                        {String(it.link || it.url || it.href || it.heroButtonLink || it.primaryButtonLink || it.secondaryButtonLink || it.brochureUrl || it.proceedingsUrl)}
                      </p>
                    )}
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingIndex(i);
                      }}
                      className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all hover:scale-110 cursor-pointer bg-primary/5"
                    >
                       <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(i);
                      }}
                      className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110 cursor-pointer bg-red-50"
                    >
                       <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors">
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
               </div>
            </div>
          );
       })}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel, loading, title, activeTab }: {
  item: unknown,
  onSave: (d: unknown) => void,
  onCancel: () => void,
  loading: boolean,
  title: string,
  activeTab: string
}) {
  const [formData, setFormData] = useState<Record<string, unknown>>(item as Record<string, unknown>);

  const entries = Object.entries(formData).filter(([key]) => {
    if (activeTab === 'notifications.json') {
      return ['text', 'category', 'date'].includes(key);
    }
    return key !== 'id';
  });

  return (
    <div className="animate-in zoom-in-95 duration-200">
      <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-2xl bg-white space-y-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-xl font-serif font-bold text-foreground">{title}</h3>
            <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <X className="size-5 text-foreground/40" />
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {entries.map(([key, value]) => {
              return (
                <FieldEditor
                  key={key}
                  label={key}
                  value={value}
                  onChange={(newVal) => setFormData((prev) => ({ ...prev, [key]: newVal }))}
                />
              );
            })}
        </div>
        <div className="pt-6 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => onSave(formData)}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save Item
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] border border-slate-200 text-foreground/60 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
        </div>
      </GlassContainer>
    </div>
  );
}
