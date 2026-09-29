import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { TransactionService } from '../services/transactionService';
import { Button } from '../components/common/Button';
import { formatINR, formatDate } from '../utils/formatters';
import { Download, Filter, Search } from 'lucide-react';

interface TransactionsPageProps {
  onSelectStock: (symbol: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onSelectStock }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const list = await TransactionService.getTransactions();
      setTransactions(list);
    }
    load();
  }, []);

  const filtered = transactions.filter(t => {
    const matchSide = filterSide === 'ALL' || t.side === filterSide;
    const matchSearch =
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.companyName.toLowerCase().includes(search.toLowerCase());
    return matchSide && matchSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Symbol', 'Side', 'Type', 'Quantity', 'Price', 'Total Value', 'Status'];
    const rows = filtered.map(t => [
      t.id,
      t.date,
      t.symbol,
      t.side,
      t.orderType,
      t.quantity,
      t.price,
      t.totalValue,
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vertex_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Transaction History & Ledger
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Complete audit trail of all executed paper buy and sell orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID or asset..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#141414] border border-[#313131] rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setFilterSide('ALL')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filterSide === 'ALL' ? 'bg-[#1e1e1e] text-white border border-[#454545]' : 'text-[#a7a7a7]'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterSide('BUY')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filterSide === 'BUY' ? 'bg-[#1e1e1e] text-[#10b981] border border-[#454545]' : 'text-[#a7a7a7]'
            }`}
          >
            Buy Only
          </button>
          <button
            onClick={() => setFilterSide('SELL')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filterSide === 'SELL' ? 'bg-[#1e1e1e] text-[#f43f5e] border border-[#454545]' : 'text-[#a7a7a7]'
            }`}
          >
            Sell Only
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="surface-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-center">Side</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Gross Value</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {filtered.map(tx => (
                <tr
                  key={tx.id}
                  className="hover:bg-[#252525]/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectStock(tx.symbol)}
                >
                  <td className="py-3 px-4 font-mono text-white font-medium">
                    {tx.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#7c7c7c]">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white font-mono group-hover:text-[#6798ff] transition-colors">
                      {tx.symbol}
                    </span>
                    <span className="text-[11px] text-[#7c7c7c] ml-2 truncate">
                      {tx.companyName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                        tx.side === 'BUY'
                          ? 'bg-[#10b981]/15 text-[#10b981]'
                          : 'bg-[#f43f5e]/15 text-[#f43f5e]'
                      }`}
                    >
                      {tx.side}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#a7a7a7]">
                    {tx.orderType}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white">
                    {tx.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#a7a7a7]">
                    {formatINR(tx.price)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-white">
                    {formatINR(tx.totalValue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-[#141414] border border-[#313131] rounded text-[10px] font-mono text-[#10b981]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
