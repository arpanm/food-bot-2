import { Injectable } from '@nestjs/common';
import type { PreferenceNode, RecordPreferenceDto, UserContextDto } from './dto/preference.dto';

/** In-memory preference graph (tree: dayOfWeek → hourOfDay → category → subcategory → restaurant → dish). T014. */
@Injectable()
export class PreferenceService {
  private preferences = new Map<string, PreferenceNode[]>();
  private sessionCache = new Map<string, { lastActiveAt: string; [key: string]: unknown }>();

  async getUserContext(userId: string): Promise<UserContextDto> {
    const prefs = this.preferences.get(userId) ?? [];
    const session = this.sessionCache.get(userId);
    return {
      userId,
      preferences: [...prefs],
      lastActiveAt: session?.lastActiveAt,
    };
  }

  async recordPreference(dto: RecordPreferenceDto): Promise<void> {
    const key = `${dto.userId}`;
    let list = this.preferences.get(key) ?? [];
    const delta = dto.weightDelta ?? 1;
    const match = list.find(
      (n) =>
        n.dayOfWeek === dto.dayOfWeek &&
        n.hourOfDay === dto.hourOfDay &&
        n.category === dto.category &&
        n.subcategory === dto.subcategory &&
        n.restaurantId === dto.restaurantId &&
        n.dishId === dto.dishId
    );
    if (match) {
      match.weight = (match.weight ?? 0) + delta;
    } else {
      list.push({
        dayOfWeek: dto.dayOfWeek,
        hourOfDay: dto.hourOfDay,
        category: dto.category,
        subcategory: dto.subcategory,
        restaurantId: dto.restaurantId,
        dishId: dto.dishId,
        weight: delta,
      });
    }
    this.preferences.set(key, list);
    this.sessionCache.set(key, {
      ...this.sessionCache.get(key),
      lastActiveAt: new Date().toISOString(),
    });
  }

  async setSession(userId: string, data: Record<string, unknown>): Promise<void> {
    const key = userId;
    const existing = this.sessionCache.get(key) ?? {};
    this.sessionCache.set(key, { ...existing, ...data, lastActiveAt: new Date().toISOString() });
  }

  async getSession(userId: string): Promise<Record<string, unknown>> {
    return { ...(this.sessionCache.get(userId) ?? {}) };
  }
}
