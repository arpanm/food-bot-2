/**
 * T024: Simple in-memory circuit breaker. Opens after failureThreshold failures,
 * allows one probe after resetTimeoutMs.
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly failureThreshold: number = 3,
    private readonly resetTimeoutMs: number = 30000
  ) {}

  getState(): 'closed' | 'open' | 'half-open' {
    if (this.state === 'open' && Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
      this.state = 'half-open';
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const s = this.getState();
    if (s === 'open') {
      throw new Error('Circuit breaker is open');
    }
    try {
      const result = await fn();
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      return result;
    } catch (e) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.failureThreshold) {
        this.state = 'open';
      }
      throw e;
    }
  }
}
