import { Injectable } from '@nestjs/common';
import type { IntentWorkflowResult } from './dto/intent.dto';

/** T015: Prompt -> intent/workflow cache to reduce LLM calls. In-memory when Qdrant not configured. */
@Injectable()
export class VectorCacheService {
  private cache = new Map<string, IntentWorkflowResult>();

  private cacheKey(prompt: string): string {
    let h = 0;
    const s = prompt.trim().toLowerCase();
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return `prompt_${h}`;
  }

  get(prompt: string): IntentWorkflowResult | null {
    return this.cache.get(this.cacheKey(prompt)) ?? null;
  }

  set(prompt: string, value: IntentWorkflowResult): void {
    this.cache.set(this.cacheKey(prompt), value);
  }
}
