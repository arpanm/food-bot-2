import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import type { DishDoc, RestaurantDoc } from './search.service';
import { SearchService } from './search.service';

const TOPIC_RESTAURANTS = 'restaurant.events';
const TOPIC_MENU = 'menu.events';

@Injectable()
export class IndexConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka | null = null;
  private consumer: Awaited<ReturnType<Kafka['consumer']>> | null = null;

  constructor(private readonly search: SearchService) {}

  async onModuleInit(): Promise<void> {
    const brokers = process.env.KAFKA_BROKERS;
    if (!brokers || !brokers.trim()) return;
    this.kafka = new Kafka({ clientId: 'search-service', brokers: brokers.trim().split(',') });
    this.consumer = this.kafka.consumer({ groupId: 'search-index-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: TOPIC_RESTAURANTS, fromBeginning: true });
    await this.consumer.subscribe({ topic: TOPIC_MENU, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        if (!value) return;
        try {
          const event = JSON.parse(value) as { type: string; payload: unknown };
          if (topic === TOPIC_RESTAURANTS) await this.handleRestaurantEvent(event);
          else if (topic === TOPIC_MENU) await this.handleMenuEvent(event);
        } catch {
          // log and skip malformed messages
        }
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) await this.consumer.disconnect();
  }

  /** Idempotent: index by id. */
  async handleRestaurantEvent(event: { type: string; payload: unknown }): Promise<void> {
    const p = event.payload as RestaurantDoc;
    if (!p?.id) return;
    if (event.type === 'restaurant.deleted') {
      await this.search.deleteRestaurant(p.id);
      return;
    }
    if (event.type === 'restaurant.created' || event.type === 'restaurant.updated') {
      await this.search.indexRestaurant({
        id: p.id,
        name: p.name ?? '',
        type: p.type ?? '',
        address: p.address,
        rating: p.rating,
      });
    }
  }

  /** Idempotent: index by id. */
  async handleMenuEvent(event: { type: string; payload: unknown }): Promise<void> {
    const p = event.payload as DishDoc;
    if (!p?.id) return;
    if (event.type === 'dish.deleted') {
      await this.search.deleteDish(p.id);
      return;
    }
    if (event.type === 'dish.created' || event.type === 'dish.updated') {
      await this.search.indexDish({
        id: p.id,
        restaurantId: p.restaurantId,
        name: p.name ?? '',
        type: p.type ?? '',
        priceCents: p.priceCents ?? 0,
        available: p.available ?? true,
      });
    }
  }
}
