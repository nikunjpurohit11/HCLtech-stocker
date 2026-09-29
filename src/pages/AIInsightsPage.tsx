import React, { useState, useEffect } from 'react';
import { StockQuote, MLPrediction } from '../types';
import { PredictionService } from '../services/predictionService';
import { SignalBadge } from '../components/common/SignalBadge';
import { Sparkles, Cpu, Layers, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface AIInsightsPageProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
}

export const AIInsightsPage: React.FC<AIInsightsPageProps> = ({
  stocks,
  onSelectStock,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  useEffect(() => {
    async function loadPred() {
      const p = await PredictionService.getPredictionForSymbol(selectedSymbol);
      setPrediction(p);
    }
    loadPred();
  }, [selectedSymbol]);

  const activeStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
              Machine Learning Research Lab
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/20 text-[#a855f7] border border-[#8b5cf6]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AlphaBoost v4.2
            </span>
          </div>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Ensemble gradient boosted trees trained on multi-factor market features for out-of-sample directional research.
          </p>
        </div>

        {/* Stock Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#7c7c7c]">Target Asset:</span>
          <select
            value={selectedSymbol}
            onChange={e => setSelectedSymbol(e.target.value)}
            className="bg-[#141414] border border-[#313131] hover:border-[#8b5cf6] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#8b5cf6]"
          >
            {stocks.map(s => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} ({s.companyName.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Overview & Active Direction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Card */}
        <div className="surface-panel rounded-xl p-5 border-l-2 border-l-[#8b5cf6] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#313131] pb-2 mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Model Architecture
              </span>
              <Cpu className="w-4 h-4 text-[#a855f7]" />
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-mono">
              <div>
                <span className="text-[#7c7c7c] block text-[10px] uppercase">Ensemble Model</span>
                <span className="text-white font-semibold">{prediction?.modelName}</span>
              </div>
              <div>
                <span className="text-[#7c7c7c] block text-[10px] uppercase">Framework</span>
                <span className="text-white">{prediction?.modelType}</span>
              </div>
              <div>
                <span className="text-[#7c7c7c] block text-[10px] uppercase">Prediction Target</span>
                <span className="text-white">{prediction?.predictionHorizon}</span>
              </div>
              <div>
                <span className="text-[#7c7c7c] block text-[10px] uppercase">Validation Period</span>
                <span className="text-[#a7a7a7]">{prediction?.modelPerformance.testPeriod}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#313131] text-[10px] text-[#7c7c7c] font-mono">
            Calibrated using Platt scaling with 10-fold cross validation.
          </div>
        </div>

        {/* Prediction Card */}
        <div className="surface-panel rounded-xl p-5 border-l-2 border-l-[#6798ff] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#313131] pb-2 mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Historical Direction Signal
              </span>
              <span className="text-[10px] text-[#7c7c7c] font-mono">{prediction?.predictionDate}</span>
            </div>

            <div className="p-4 bg-[#141414] border border-[#313131] rounded-xl flex items-center justify-between my-2">
              <div>
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block mb-1">
                  Asset: {activeStock.symbol}
                </span>
                <SignalBadge
                  signal={prediction?.predictedDirection || 'BULLISH'}
                  confidence={prediction?.probability}
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Probability</span>
                <span className="text-2xl font-bold font-mono text-white">
                  {prediction?.probability}%
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a7a7a7] leading-relaxed mt-2">
              The model identifies a statistically significant bullish continuation pattern based on momentum divergence and compressed 20-day volatility.
            </p>
          </div>

          <button
            onClick={() => onSelectStock(selectedSymbol)}
            className="mt-4 text-xs text-[#6798ff] hover:underline font-mono text-left cursor-pointer"
          >
            → Open Full Stock Chart & Order Form
          </button>
        </div>

        {/* Historical Model Accuracy */}
        <div className="surface-panel rounded-xl p-5 border-l-2 border-l-[#10b981] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#313131] pb-2 mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Out-of-Sample Performance
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono my-2">
              <div className="p-2.5 bg-[#141414] rounded-lg border border-[#252525]">
                <span className="text-[10px] text-[#7c7c7c] uppercase block">ROC-AUC</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{prediction?.modelPerformance.rocAuc}</span>
              </div>
              <div className="p-2.5 bg-[#141414] rounded-lg border border-[#252525]">
                <span className="text-[10px] text-[#7c7c7c] uppercase block">Accuracy</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{prediction?.modelPerformance.accuracy}%</span>
              </div>
              <div className="p-2.5 bg-[#141414] rounded-lg border border-[#252525]">
                <span className="text-[10px] text-[#7c7c7c] uppercase block">Precision</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{prediction?.modelPerformance.precision}%</span>
              </div>
              <div className="p-2.5 bg-[#141414] rounded-lg border border-[#252525]">
                <span className="text-[10px] text-[#7c7c7c] uppercase block">F1 Score</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{prediction?.modelPerformance.f1Score}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#313131] text-[10px] text-[#7c7c7c] font-mono">
            Walk-forward testing across 4,200 out-of-sample trading sessions.
          </div>
        </div>
      </div>

      {/* Feature Importance Deep Dive */}
      <div className="surface-panel rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#313131] pb-3">
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Model Feature Importance (Gini Impurity Metric)
            </span>
            <p className="text-[11px] text-[#7c7c7c] mt-0.5">
              Ranked quantitative factor contribution explaining model decision paths.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prediction?.featureImportance.map((item, idx) => (
            <div key={item.feature} className="p-3.5 bg-[#141414] border border-[#252525] rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-white">
                  0{idx + 1}. {item.feature}
                </span>
                <span className="text-[#a855f7] font-bold">{item.importance}%</span>
              </div>

              <div className="w-full bg-[#1e1e1e] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#6798ff] to-[#a855f7] h-full rounded-full"
                  style={{ width: `${item.importance * 3.5}%` }}
                />
              </div>

              <p className="text-[11px] text-[#7c7c7c] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="surface-panel rounded-xl p-4 border border-[#f59e0b]/30 bg-[#f59e0b]/5 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
        <p className="text-xs text-[#a7a7a7] leading-relaxed font-mono">
          <strong className="text-white">Research Disclaimer:</strong> These metrics describe historical model performance on test periods and do not guarantee future market behavior. All machine learning predictions are designed strictly for quantitative research, thesis validation, and simulated paper evaluation.
        </p>
      </div>
    </div>
  );
};
