'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Table, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableColumn {
  key: string;
  label: string;
}

interface TableData {
  title: string;
  columns: TableColumn[];
  rows: Record<string, any>[];
}

interface InteractiveTableWidgetProps {
  tableData: TableData;
}

export default function InteractiveTableWidget({ tableData }: InteractiveTableWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { title, columns, rows } = tableData;

  // 1. Search Filtering
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter(row => 
      columns.some(col => {
        const val = row[col.key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
      })
    );
  }, [rows, columns, searchQuery]);

  // 2. Sorting
  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;
    const sorted = [...filteredRows];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aString = String(aVal).toLowerCase();
      const bString = String(bVal).toLowerCase();

      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortConfig]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRows, currentPage, rowsPerPage]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // CSV Export
  const downloadCSV = () => {
    const headerRow = columns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(',');
    const dataRows = rows.map(row => 
      columns.map(col => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export
  const downloadJSON = () => {
    const jsonString = JSON.stringify(rows, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 ${
      isFullScreen ? 'fixed inset-4 z-50 flex flex-col bg-white dark:bg-zinc-950 p-6' : 'my-4 flex flex-col'
    }`}>
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 border-b border-zinc-150 dark:border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
            <p className="text-[10px] text-zinc-400">Interactive Data Vault Grid</p>
          </div>
        </div>

        {/* Action buttons and Search input */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-[200px] sm:w-[180px]">
            <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search grid..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 pl-8 pr-3 text-xs bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400"
            />
          </div>

          <Button variant="outline" size="sm" onClick={downloadCSV} className="h-8 gap-1.5 text-xs">
            <Download className="h-3 w-3" />
            CSV
          </Button>

          <Button variant="outline" size="sm" onClick={downloadJSON} className="h-8 gap-1.5 text-xs">
            <Download className="h-3 w-3" />
            JSON
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Grid container */}
      <div className={`overflow-x-auto w-full ${isFullScreen ? 'flex-grow overflow-y-auto' : ''}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              {columns.map((col) => {
                const isSorted = sortConfig?.key === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer select-none px-4 py-3 text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.label}</span>
                      {isSorted ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-zinc-900 dark:text-white" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-900 dark:text-white" />
                      ) : (
                        <div className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/10 transition-colors duration-150"
                >
                  {columns.map((col) => {
                    const cellVal = row[col.key];
                    const isNumber = typeof cellVal === 'number';
                    return (
                      <td key={col.key} className="px-4 py-2.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        {isNumber ? cellVal.toLocaleString() : String(cellVal ?? '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-zinc-400">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 p-3 bg-zinc-50/30 dark:bg-zinc-900/10">
          <div className="text-[10px] text-zinc-400">
            Showing <strong className="text-zinc-700 dark:text-zinc-300">{(currentPage - 1) * rowsPerPage + 1}</strong> to{' '}
            <strong className="text-zinc-700 dark:text-zinc-300">
              {Math.min(currentPage * rowsPerPage, sortedRows.length)}
            </strong>{' '}
            of <strong className="text-zinc-700 dark:text-zinc-300">{sortedRows.length}</strong> entries
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="h-7 px-2.5 text-[11px]"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <Button
                key={pg}
                variant={currentPage === pg ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pg)}
                className={`h-7 w-7 text-[11px] p-0 ${
                  currentPage === pg ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold' : ''
                }`}
              >
                {pg}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="h-7 px-2.5 text-[11px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
