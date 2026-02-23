/**
 * T004: LLM provider configuration from env. No keys in code; validation at startup.
 */
export interface LlmProviderConfig {
  enabled: boolean;
  apiKey: string;
  model: string;
}

export interface LlmConfig {
  claude: LlmProviderConfig;
  openai: LlmProviderConfig;
  gemini: LlmProviderConfig;
}

function readBool(env: string | undefined): boolean {
  if (env === undefined || env === '') return false;
  return env.toLowerCase() === 'true' || env === '1';
}

export function getLlmConfig(): LlmConfig {
  const claudeEnabled = readBool(process.env.CLAUDE_ENABLED);
  const openaiEnabled = readBool(process.env.OPENAI_ENABLED);
  const geminiEnabled = readBool(process.env.GEMINI_ENABLED);

  return {
    claude: {
      enabled: claudeEnabled,
      apiKey: process.env.CLAUDE_API_KEY ?? '',
      model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-20250514',
    },
    openai: {
      enabled: openaiEnabled,
      apiKey: process.env.OPENAI_API_KEY ?? '',
      model: process.env.OPENAI_MODEL ?? 'gpt-4o',
    },
    gemini: {
      enabled: geminiEnabled,
      apiKey: process.env.GEMINI_API_KEY ?? '',
      model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
    },
  };
}

/** Validate config at startup: if a provider is enabled, its API key must be set (non-empty). */
export function validateLlmConfig(config: LlmConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (config.claude.enabled && !config.claude.apiKey.trim()) {
    errors.push('CLAUDE_ENABLED is true but CLAUDE_API_KEY is missing or empty');
  }
  if (config.openai.enabled && !config.openai.apiKey.trim()) {
    errors.push('OPENAI_ENABLED is true but OPENAI_API_KEY is missing or empty');
  }
  if (config.gemini.enabled && !config.gemini.apiKey.trim()) {
    errors.push('GEMINI_ENABLED is true but GEMINI_API_KEY is missing or empty');
  }
  return { valid: errors.length === 0, errors };
}
