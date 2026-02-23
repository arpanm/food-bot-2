import { Injectable } from '@nestjs/common';

export interface RestaurantDoc {
  id: string;
  name: string;
  type: string;
  address?: string;
  rating?: number;
}

export interface DishDoc {
  id: string;
  restaurantId: string;
  name: string;
  type: string;
  priceCents: number;
  available: boolean;
}

export interface SearchRestaurantsQuery {
  query?: string;
  type?: string;
}

export interface SearchDishesQuery {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

/** In-memory implementation for T012; replace with Elasticsearch when ES is configured. */
@Injectable()
export class SearchService {
  private restaurants = new Map<string, RestaurantDoc>();
  private dishes = new Map<string, DishDoc>();

  async indexRestaurant(doc: RestaurantDoc): Promise<void> {
    this.restaurants.set(doc.id, { ...doc });
  }

  async indexDish(doc: DishDoc): Promise<void> {
    this.dishes.set(doc.id, { ...doc });
  }

  async deleteRestaurant(id: string): Promise<void> {
    this.restaurants.delete(id);
    for (const [dishId, d] of this.dishes) {
      if (d.restaurantId === id) this.dishes.delete(dishId);
    }
  }

  async deleteDish(id: string): Promise<void> {
    this.dishes.delete(id);
  }

  async searchRestaurants(q: SearchRestaurantsQuery): Promise<RestaurantDoc[]> {
    let list = Array.from(this.restaurants.values());
    if (q.query && q.query.trim()) {
      const lower = q.query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) || (r.type && r.type.toLowerCase().includes(lower))
      );
    }
    if (q.type && q.type.trim()) {
      const type = q.type.trim().toLowerCase();
      list = list.filter((r) => r.type && r.type.toLowerCase() === type);
    }
    return list;
  }

  async searchDishes(q: SearchDishesQuery): Promise<DishDoc[]> {
    let list = Array.from(this.dishes.values());
    if (q.query && q.query.trim()) {
      const lower = q.query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) || (d.type && d.type.toLowerCase().includes(lower))
      );
    }
    if (q.type && q.type.trim()) {
      const type = q.type.trim().toLowerCase();
      list = list.filter((d) => d.type && d.type.toLowerCase() === type);
    }
    if (q.minPrice != null) list = list.filter((d) => d.priceCents >= q.minPrice!);
    if (q.maxPrice != null) list = list.filter((d) => d.priceCents <= q.maxPrice!);
    if (q.available !== undefined) list = list.filter((d) => d.available === q.available);
    return list;
  }
}
