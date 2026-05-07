"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw, FileText, Settings, Database, CheckCircle2, AlertCircle, Plus, Trash2, Edit3, ChevronRight, X } from 'lucide-react';
import { GlassContainer } from '@/components/GlassContainer';

type AdminStatus = { type: 'success' | 'error', msg: string } | null;

interface FileConfig {
  name: string;
  label: string;
  icon: React.ElementType;
  type: 'object' | 'array';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('siteConfig.json');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [newItemMode, setNewItemMode] = useState(false);

  const files: FileConfig[] = [
    { name: 'siteConfig.json', label: 'Site Settings', icon: Settings, type: 'object' },
    { name: 'conferences.json', label: 'Conferences', icon: Database, type: 'array' },
    { name: 'books.json', label: 'Books/Publications', icon: FileText, type: 'array' },
    { name: 'awards.json', label: 'Awards/Honors', icon: Database, type: 'array' },
    { name: 'editors.json', label: 'Editorial Board', icon: Database, type: 'array' },
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
        throw new Error('Failed to fetch');
      }
    } catch {
      setStatus({ type: 'error', msg: 'Could not load content' });
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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

  const currentFile = files.find(f => f.name === activeTab);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-10 items-start">
           {/* Sidebar */}
           <div className="w-full space-y-4">
              <div className="p-4 mb-2">
                 <h1 className="text-2xl font-serif font-bold text-foreground">Admin <span className="text-primary italic">Panel</span></h1>
                 <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Management Console</p>
              </div>
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
                   {currentFile?.type === 'object' ? (
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
                     />
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}

function FieldEditor({ label, value, onChange, isNested = false }: { label: string, value: unknown, onChange: (val: unknown) => void, isNested?: boolean }) {
  if (Array.isArray(value)) {
    return (
      <div className={`space-y-3 ${isNested ? 'pl-4 border-l-2 border-primary/10 py-2' : ''}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{label.replace(/([A-Z])/g, ' $1')}</label>
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

  const stringValue = String(value || "");
  const isLongText = stringValue.length > 100 || label.toLowerCase().includes('message') || label.toLowerCase().includes('description');

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 block">{label.replace(/([A-Z])/g, ' $1')}</label>
      {isLongText ? (
        <textarea 
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-24 leading-relaxed"
        />
      ) : (
        <input 
          type="text"
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      )}
    </div>
  );
}

function ObjectEditor({ data, onSave, loading }: { data: Record<string, unknown>, onSave: (d: unknown) => void, loading: boolean }) {
  const [formData, setFormData] = useState<Record<string, unknown>>(data);

  return (
    <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-xl bg-white space-y-8">
       <div className="grid grid-cols-1 gap-6">
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

function ArrayEditor({ data, onSave, onDelete, onAdd, loading, editingIndex, setEditingIndex, newMode, setNewMode }: {
  data: unknown[],
  onSave: (i: number, d: unknown) => void,
  onDelete: (i: number) => void,
  onAdd: (d: unknown) => void,
  loading: boolean,
  editingIndex: number | null,
  setEditingIndex: (i: number | null) => void,
  newMode: boolean,
  setNewMode: (b: boolean) => void
}) {
  if (!data || !Array.isArray(data)) return null;

  if (newMode) {
    const emptyItem = Object.keys(data[0] || {}).reduce((acc: Record<string, unknown>, key) => {
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
    />;
  }

  if (editingIndex !== null) {
    return <ItemForm item={data[editingIndex]} onSave={(updatedItem: unknown) => onSave(editingIndex, updatedItem)} onCancel={() => setEditingIndex(null)} loading={loading} title="Edit Item" />;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
       {data.map((item: unknown, i: number) => {
          const it = item as Record<string, unknown>;
          return (
            <div 
              key={i} 
              onClick={() => setEditingIndex(i)}
              className="bg-white/80 p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between gap-4 cursor-pointer"
            >
               <div className="grow space-y-0.5">
                  <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors">{String(it.title || it.name || `Item ${i + 1}`)}</h3>
                  <p className="text-[11px] text-foreground/40 font-medium line-clamp-1">{String(it.date || it.category || it.institution || it.type || "")}</p>
               </div>
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(i);
                    }}
                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                  >
                     <Edit3 className="size-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(i);
                    }}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                     <Trash2 className="size-4" />
                  </button>
               </div>
               <ChevronRight className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          );
       })}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel, loading, title }: {
  item: unknown,
  onSave: (d: unknown) => void,
  onCancel: () => void,
  loading: boolean,
  title: string
}) {
  const [formData, setFormData] = useState<Record<string, unknown>>(item as Record<string, unknown>);

  return (
    <div className="animate-in zoom-in-95 duration-200">
      <GlassContainer variant="light" className="p-8 md:p-10 border-none shadow-2xl bg-white space-y-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-xl font-serif font-bold text-foreground">{title}</h3>
            <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <X className="size-5 text-foreground/40" />
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id') return null;
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
