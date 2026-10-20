"use client";

import React, { useState } from 'react';
import { Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import siteConfig from '@/data/siteConfig.json';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check for demonstration
    // In a real app, this would be an API call
    if (password === 'MindgatesPortal$2026') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex p-2 rounded-3xl bg-white shadow-2xl shadow-primary/10 scale-125 mb-4">
            <Logo className="size-12" variant="primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Management Console</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/30 mt-2">Mindgates Research Portal</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-2xl shadow-primary/5 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Access Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="size-3" />
                Invalid credentials
              </div>
            )}

            <Button 
              type="submit"
              variant="primary"
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              Sign In
              <ChevronRight className="size-4" />
            </Button>

            <Button 
              type="button"
              onClick={() => router.push('/')}
              variant="light"
              className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-slate-50 text-foreground/40 hover:bg-slate-100 border border-slate-100 hover:-translate-y-0.5"
            >
              Go to Homepage
            </Button>
          </form>

          <p className="text-center text-[9px] text-foreground/30 font-medium">
            Authorized Personnel Only. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
