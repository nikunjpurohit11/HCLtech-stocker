import { MLPrediction, SignalType } from '../types';

export class PredictionService {
  public static async getPredictionForSymbol(symbol: string): Promise<MLPrediction> {
    const sym = symbol.toUpperCase();

    let direction: SignalType = 'BULLISH';
    let prob = 78;
    if (sym === 'TATAMOTORS') {
      direction = 'BEARISH';
      prob = 71;
    } else if (sym === 'TCS' || sym === 'INFY' || sym === 'KOTAKBANK') {
      direction = 'NEUTRAL';
      prob = 61;
    }

    return {
      symbol: sym,
      modelName: 'AlphaBoost-Ensemble-v4',
      modelType: 'Gradient Boosted Trees (LightGBM + XGBoost)',
      predictedDirection: direction,
      probability: prob,
      predictionHorizon: '5-Day Forward Return',
      predictionDate: '29 Sep 2026 15:30 IST',
      featureImportance: [
        {
          feature: 'RSI (14-Period)',
          importance: 26.4,
          description: 'Momentum oscillator measuring speed and change of price moves',
        },
        {
          feature: '20-Day Realized Volatility',
          importance: 21.8,
          description: 'Historical standard deviation of log returns annualized',
        },
        {
          feature: 'SMA 50 / SMA 200 Ratio',
          importance: 18.5,
          description: 'Structural macro trend positioning indicator (Golden Cross proximity)',
        },
        {
          feature: 'MACD Histogram Momentum',
          importance: 14.7,
          description: 'Short-term exponential moving average acceleration divergence',
        },
        {
          feature: 'Volume Surge Ratio',
          importance: 11.2,
          description: 'Ratio of daily trading volume against 30-day moving average volume',
        },
        {
          feature: 'Bollinger Band %B',
          importance: 7.4,
          description: 'Relative position of price within standard deviation boundaries',
        },
      ],
      modelPerformance: {
        accuracy: 71.4,
        precision: 73.2,
        recall: 69.8,
        f1Score: 71.5,
        rocAuc: 0.78,
        testPeriod: '2023 - 2026 (Out-of-sample Walk-forward)',
      },
    };
  }
}
