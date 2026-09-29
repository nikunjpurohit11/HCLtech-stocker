import { MarketIndex } from '../types';

export const MOCK_INDICES: MarketIndex[] = [
  {
    symbol: 'NIFTY 50',
    name: 'NSE Nifty 50 Index',
    value: 25482.50,
    change: 142.30,
    changePercent: 0.56,
    high: 25520.10,
    low: 25390.40,
    sparkline: [25390, 25410, 25405, 25435, 25420, 25460, 25450, 25475, 25465, 25482.5],
  },
  {
    symbol: 'NIFTY BANK',
    name: 'Nifty Bank Index',
    value: 53195.40,
    change: 312.15,
    changePercent: 0.59,
    high: 53260.00,
    low: 52940.80,
    sparkline: [52940, 52990, 53020, 53010, 53110, 53090, 53150, 53140, 53180, 53195.4],
  },
  {
    symbol: 'NIFTY IT',
    name: 'Nifty IT Index',
    value: 41890.20,
    change: -110.80,
    changePercent: -0.26,
    high: 42080.50,
    low: 41820.00,
    sparkline: [42050, 42020, 41980, 41920, 41940, 41880, 41910, 41850, 41870, 41890.2],
  },
  {
    symbol: 'NIFTY NEXT 50',
    name: 'Nifty Next 50 Index',
    value: 72410.80,
    change: 495.20,
    changePercent: 0.69,
    high: 72480.00,
    low: 71980.20,
    sparkline: [71980, 72050, 72120, 72100, 72240, 72280, 72350, 72310, 72390, 72410.8],
  },
];
