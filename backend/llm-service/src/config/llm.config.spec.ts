import { getLlmConfig, validateLlmConfig } from './llm.config';

describe('llm.config (T004)', () => {
  const origEnv = process.env;

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('readBool returns false for empty or undefined', () => {
    process.env.CLAUDE_ENABLED = '';
    expect(getLlmConfig().claude.enabled).toBe(false);
    delete process.env.CLAUDE_ENABLED;
    expect(getLlmConfig().claude.enabled).toBe(false);
  });

  it('readBool returns true for true or 1', () => {
    process.env.CLAUDE_ENABLED = 'true';
    expect(getLlmConfig().claude.enabled).toBe(true);
    process.env.CLAUDE_ENABLED = '1';
    expect(getLlmConfig().claude.enabled).toBe(true);
  });

  it('validateLlmConfig returns errors when enabled but key missing', () => {
    process.env.CLAUDE_ENABLED = 'true';
    process.env.CLAUDE_API_KEY = '';
    const config = getLlmConfig();
    const result = validateLlmConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('CLAUDE'))).toBe(true);
  });

  it('validateLlmConfig returns valid when enabled and key set', () => {
    process.env.CLAUDE_ENABLED = 'true';
    process.env.CLAUDE_API_KEY = 'sk-test';
    const config = getLlmConfig();
    const result = validateLlmConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
