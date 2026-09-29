import { MLPrediction, SignalType } from '../types';
import { DEFAULT_FEATURE_IMPORTANCE, DEFAULT_MODEL_PERFORMANCE } from '../data';
import { IPredictionService } from './interfaces';

export class MockPredictionService implements IPredictionService {
  public async getPredictionForSymbol(symbol: string): Promise<MLPrediction> {
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
      featureImportance: [...DEFAULT_FEATURE_IMPORTANCE],
      modelPerformance: { ...DEFAULT_MODEL_PERFORMANCE },
    };
  }

  // Static convenience wrapper
  public static async getPredictionForSymbol(symbol: string): Promise<MLPrediction> {
    return new MockPredictionService().getPredictionForSymbol(symbol);
  }
}

export const PredictionService = MockPredictionService;
