import { Injectable } from '@nestjs/common';
import { getLlmConfig } from '../config/llm.config';
import type { IntentRequestDto, IntentWorkflowResult } from './dto/intent.dto';
import { VectorCacheService } from './vector-cache.service';

@Injectable()
export class IntentService {
  constructor(private readonly vectorCache: VectorCacheService) {}

  /** T016+T017: Resolve intent and workflow; use cache on hit, else LLM and store. */
  async getIntentAndWorkflow(dto: IntentRequestDto): Promise<IntentWorkflowResult> {
    const cached = this.vectorCache.get(dto.prompt);
    if (cached) return cached;
    const result = await this.generateIntentWorkflow(dto.prompt, dto.context);
    this.vectorCache.set(dto.prompt, result);
    return result;
  }

  private async generateIntentWorkflow(
    prompt: string,
    _context?: Record<string, unknown>
  ): Promise<IntentWorkflowResult> {
    const config = getLlmConfig();
    if (config.claude.enabled && config.claude.apiKey) {
      return this.callClaude(prompt);
    }
    if (config.openai.enabled && config.openai.apiKey) {
      return this.callOpenAI(prompt);
    }
    if (config.gemini.enabled && config.gemini.apiKey) {
      return this.callGemini(prompt);
    }
    return this.stubIntentWorkflow(prompt);
  }

  private stubIntentWorkflow(prompt: string): IntentWorkflowResult {
    const lower = prompt.toLowerCase();
    if (lower.includes('order') || lower.includes('cart')) {
      return {
        intent: 'order_food',
        workflow: {
          steps: [
            { id: 's1', type: 'search_restaurants', params: {} },
            { id: 's2', type: 'add_to_cart', params: {} },
            { id: 's3', type: 'checkout', params: {} },
          ],
        },
      };
    }
    if (lower.includes('party') || lower.includes('bulk')) {
      return {
        intent: 'party_planner',
        workflow: { steps: [{ id: 's1', type: 'party_planner', params: {} }] },
      };
    }
    if (lower.includes('diet') || lower.includes('weekly')) {
      return {
        intent: 'diet_planner',
        workflow: { steps: [{ id: 's1', type: 'diet_planner', params: {} }] },
      };
    }
    return {
      intent: 'search',
      workflow: { steps: [{ id: 's1', type: 'search', params: { query: prompt } }] },
    };
  }

  private async callClaude(_prompt: string): Promise<IntentWorkflowResult> {
    // TODO: use @anthropic-ai/sdk when implementing full T016
    return this.stubIntentWorkflow(_prompt);
  }

  private async callOpenAI(_prompt: string): Promise<IntentWorkflowResult> {
    return this.stubIntentWorkflow(_prompt);
  }

  private async callGemini(_prompt: string): Promise<IntentWorkflowResult> {
    return this.stubIntentWorkflow(_prompt);
  }
}
