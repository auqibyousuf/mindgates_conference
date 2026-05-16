import React from 'react';
import { GlassContainer } from './GlassContainer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  emptyMessage = "No data found" 
}: DataTableProps<T>) {
  return (
    <GlassContainer variant="light" className="overflow-hidden border-none shadow-2xl p-0 bg-white/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/10">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={cn(
                    "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/70",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {data.length > 0 ? (
              data.map((item) => (
                <tr 
                  key={item.id} 
                  className="group hover:bg-primary/[0.02] transition-colors duration-300"
                >
                  {columns.map((col, i) => (
                    <td 
                      key={i} 
                      className={cn(
                        "px-8 py-6 text-[13px] font-semibold text-foreground/70 group-hover:text-primary transition-colors",
                        col.className
                      )}
                    >
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : String(item[col.accessor] || '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center">
                       <div className="size-2 bg-primary/20 rounded-full animate-ping" />
                    </div>
                    <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">
                      {emptyMessage}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassContainer>
  );
}
