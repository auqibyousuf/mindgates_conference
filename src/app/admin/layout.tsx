import React from "react";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isAdmin={true} />
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
