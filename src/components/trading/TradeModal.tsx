import React, { useState, useEffect } from 'react';
import { StockQuote, OrderSide, OrderType } from '../../types';
import { PortfolioService } from '../../services/portfolioService';
import { formatINR } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStock?: StockQuote | null;
  stocks: StockQuote[];
  onTradeSuccess?: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  defaultStock,
  stocks,
  onTradeSuccess,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(0);
  const [cashBalance, setCashBalance] = useState<number>(99164.75);
  const [isExecuting, setIsExecuting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (defaultStock) {
      setSelectedSymbol(defaultStock.symbol);
      setLimitPrice(defaultStock.price);
    } else if (stocks.length > 0 && !selectedSymbol) {
      setSelectedSymbol(stocks[0].symbol);
      setLimitPrice(stocks[0].price);
    }
  }, [defaultStock, stocks]);

  useEffect(() => {
    async function loadCash() {
      const summary = await PortfolioService.getSummary();
      setCashBalance(summary.cashBalance);
    }
    if (isOpen) {
      loadCash();
      setNotification(null);
    }
  }, [isOpen]);

  const activeStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  const executionPrice = orderType === 'MARKET' ? (activeStock?.price || 0) : (limitPrice || activeStock?.price || 0);
  const totalValue = quantity * executionPrice;
  const remainingCash = side === 'BUY' ? cashBalance - totalValue : cashBalance + totalValue;
  const isAffordable = side === 'SELL' || totalValue <= cashBalance;

  const handleExecute = async () => {
    if (!activeStock || quantity <= 0) return;

    setIsExecuting(true);
    setNotification(null);

    try {
      const res = await PortfolioService.executePaperTrade({
        symbol: activeStock.symbol,
        companyName: activeStock.companyName,
        side,
        orderType,
        quantity,
        price: executionPrice,
      });

      if (res.success) {
        setNotification({ type: 'success', message: res.message });
        const summary = await PortfolioService.getSummary();
        setCashBalance(summary.cashBalance);
        if (onTradeSuccess) onTradeSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setNotification({ type: 'error', message: res.message });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to process simulated paper trade.' });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Paper Trade"
      subtitle="Simulated order placement using virtual paper funds"
      maxWidth="md"
    >
      <div className="flex flex-col gap-5">
        {/* Buy / Sell Selector */}
        <div className="grid grid-cols-2 p-1 bg-[#141414] border border-[#313131] rounded-xl">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              side === 'BUY'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#a7a7a7] hover:text-white'
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              side === 'SELL'
                ? 'bg-[#f43f5e] text-white shadow-sm'
                : 'text-[#a7a7a7] hover:text-white'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Stock Selector */}
        <div>
          <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1.5">
            Select Asset
          </label>
          <select
            value={selectedSymbol}
            onChange={e => {
              setSelectedSymbol(e.target.value);
              const found = stocks.find(s => s.symbol === e.target.value);
              if (found) setLimitPrice(found.price);
            }}
            className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6798ff] font-mono"
          >
            {stocks.map(s => (
              <option key={s.symbol} value={s.symbol} className="bg-[#1e1e1e] text-white">
                {s.symbol} - {s.companyName} ({formatINR(s.price)})
              </option>
            ))}
          </select>
        </div>

        {/* Order Type & Price Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1.5">
              Order Type
            </label>
            <div className="flex bg-[#141414] border border-[#313131] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setOrderType('MARKET')}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                  orderType === 'MARKET' ? 'bg-[#1e1e1e] text-[#6798ff]' : 'text-[#7c7c7c]'
                }`}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderType('LIMIT');
                  if (!limitPrice && activeStock) setLimitPrice(activeStock.price);
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                  orderType === 'LIMIT' ? 'bg-[#1e1e1e] text-[#6798ff]' : 'text-[#7c7c7c]'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1.5">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.05"
              disabled={orderType === 'MARKET'}
              value={orderType === 'MARKET' ? (activeStock?.price || 0) : limitPrice}
              onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#6798ff] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#a7a7a7] uppercase tracking-wider">
              Quantity (Shares)
            </label>
            <div className="flex gap-1">
              {[5, 10, 25, 50, 100].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantity(qty)}
                  className="px-2 py-0.5 text-[10px] font-mono bg-[#141414] hover:bg-[#313131] text-[#a7a7a7] border border-[#313131] rounded transition-colors cursor-pointer"
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#6798ff]"
          />
        </div>

        {/* Financial Summary Box */}
        <div className="surface-dark border border-[#313131] rounded-xl p-4 flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[#a7a7a7]">
            <span>Estimated Value:</span>
            <span className="font-semibold text-white">{formatINR(totalValue)}</span>
          </div>
          <div className="flex items-center justify-between text-[#a7a7a7]">
            <span>Available Cash:</span>
            <span>{formatINR(cashBalance)}</span>
          </div>
          <div className="border-t border-[#252525] pt-2 flex items-center justify-between">
            <span className="text-[#a7a7a7]">Estimated Balance:</span>
            <span className={`font-semibold ${remainingCash < 0 ? 'text-[#f43f5e]' : 'text-[#6798ff]'}`}>
              {formatINR(remainingCash)}
            </span>
          </div>
        </div>

        {/* Notification feedback */}
        {notification && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs ${
              notification.type === 'success'
                ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
                : 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={side === 'BUY' ? 'primary' : 'danger'}
            size="md"
            onClick={handleExecute}
            disabled={isExecuting || !isAffordable}
            className="w-full sm:w-auto"
          >
            {isExecuting ? 'Transacting...' : `${side} ${quantity} ${activeStock?.symbol}`}
          </Button>
        </div>

        {/* Research Disclaimer */}
        <p className="text-[10px] text-[#7c7c7c] text-center font-mono">
          Simulated paper execution for research & testing. No real-money brokerage order will be executed.
        </p>
      </div>
    </Modal>
  );
};
