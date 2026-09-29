import { Transaction } from '../types';
import { INITIAL_TRANSACTIONS } from '../data';
import { ITransactionService } from './interfaces';

export class MockTransactionService implements ITransactionService {
  private static transactions: Transaction[] = [...INITIAL_TRANSACTIONS];

  public async getTransactions(limit?: number): Promise<Transaction[]> {
    const list = [...MockTransactionService.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return limit ? list.slice(0, limit) : list;
  }

  public addTransaction(tx: Transaction): void {
    MockTransactionService.transactions.unshift(tx);
  }

  // Static convenience wrappers
  public static async getTransactions(limit?: number): Promise<Transaction[]> {
    return new MockTransactionService().getTransactions(limit);
  }

  public static addTransaction(tx: Transaction): void {
    new MockTransactionService().addTransaction(tx);
  }
}

export const TransactionService = MockTransactionService;
