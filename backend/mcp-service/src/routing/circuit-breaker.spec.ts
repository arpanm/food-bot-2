import { CircuitBreaker } from './circuit-breaker';

describe('CircuitBreaker', () => {
  it('starts closed', () => {
    const cb = new CircuitBreaker(2, 10000);
    expect(cb.getState()).toBe('closed');
  });

  it('opens after failureThreshold failures', async () => {
    const cb = new CircuitBreaker(2, 10000);
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(cb.getState()).toBe('open');
    await expect(cb.execute(() => Promise.resolve(1))).rejects.toThrow('Circuit breaker is open');
  });

  it('succeeds when call succeeds', async () => {
    const cb = new CircuitBreaker(3, 10000);
    const result = await cb.execute(() => Promise.resolve(42));
    expect(result).toBe(42);
    expect(cb.getState()).toBe('closed');
  });
});
