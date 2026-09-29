import { supabase } from '../lib/supabase';
import { IUserSettings, ISettingsService } from './interfaces';

export class SupabaseSettingsService implements ISettingsService {
  public async getSettings(): Promise<IUserSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        theme: 'dark',
        riskTolerance: 15,
        notificationsEnabled: true,
      };
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (error || !data || data.length === 0) {
      return {
        theme: 'dark',
        riskTolerance: 15,
        notificationsEnabled: true,
      };
    }

    const row = data[0];
    return {
      theme: row.theme || 'dark',
      riskTolerance: Number(row.risk_tolerance) || 15,
      notificationsEnabled: row.notifications_enabled !== false,
    };
  }

  public async saveSettings(settings: IUserSettings): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        theme: settings.theme || 'dark',
        risk_tolerance: settings.riskTolerance ?? 15,
        notifications_enabled: settings.notificationsEnabled ?? true,
        updated_at: new Date().toISOString(),
      });

    return !error;
  }

  // Static convenience methods
  public static async getSettings(): Promise<IUserSettings> {
    return new SupabaseSettingsService().getSettings();
  }

  public static async saveSettings(settings: IUserSettings): Promise<boolean> {
    return new SupabaseSettingsService().saveSettings(settings);
  }
}

export const SettingsService = SupabaseSettingsService;
