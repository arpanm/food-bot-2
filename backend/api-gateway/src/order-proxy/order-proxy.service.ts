import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
const PROXY_TIMEOUT_MS = 15000;

@Injectable()
export class OrderProxyService {
  constructor(private readonly jwt: JwtService) {}

  getUserId(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) return 'anonymous';
    try {
      const token = authHeader.slice(7).trim();
      if (!token) return 'anonymous';
      const payload = this.jwt.verify<{ sub?: string }>(token);
      return (payload?.sub && typeof payload.sub === 'string' ? payload.sub : 'anonymous');
    } catch {
      return 'anonymous';
    }
  }

  private parseErrorMessage(text: string, status: number): string {
    try {
      const parsed = JSON.parse(text) as { message?: string };
      return (parsed?.message ?? text) || `Proxy ${status}`;
    } catch {
      return text || `Proxy ${status}`;
    }
  }

  private parseResponseBody(text: string): unknown {
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private async forward(
    method: string,
    path: string,
    userId: string,
    body?: unknown
  ): Promise<unknown> {
    const url = `${ORDER_SERVICE_URL.replace(/\/$/, '')}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      clearTimeout(timeoutId);
      const text = await res.text();
      if (!res.ok) {
        throw new HttpException(this.parseErrorMessage(text, res.status), res.status);
      }
      return this.parseResponseBody(text);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof HttpException) throw err;
      if (err instanceof Error) {
        if (err.name === 'AbortError') throw new HttpException('Order service timeout', 504);
        throw new HttpException(err.message, 502);
      }
      throw new HttpException('Order proxy error', 502);
    }
  }

  async getCart(userId: string) {
    return this.forward('GET', '/cart', userId);
  }

  async addToCart(userId: string, dto: unknown) {
    return this.forward('POST', '/cart/items', userId, dto);
  }

  async setCartAddress(userId: string, addressId: string) {
    return this.forward('PATCH', '/cart/address', userId, { addressId });
  }

  async checkout(userId: string, dto: { selectedAddressId: string }) {
    return this.forward('POST', '/checkout', userId, dto);
  }

  async listOrders(userId: string) {
    return this.forward('GET', '/orders', userId);
  }

  async getOrder(userId: string, orderId: string) {
    return this.forward('GET', `/orders/${orderId}`, userId);
  }

  async cancelOrder(userId: string, orderId: string) {
    return this.forward('POST', `/orders/${orderId}/cancel`, userId);
  }
}
