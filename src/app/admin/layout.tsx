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
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
