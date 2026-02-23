export interface PreferenceNode {
  dayOfWeek?: number; // 0-6
  hourOfDay?: number; // 0-23
  category?: string;
  subcategory?: string;
  restaurantId?: string;
  dishId?: string;
  weight?: number;
}

export interface RecordPreferenceDto {
  userId: string;
  dayOfWeek?: number;
  hourOfDay?: number;
  category?: string;
  subcategory?: string;
  restaurantId?: string;
  dishId?: string;
  weightDelta?: number; // default +1
}

export interface UserContextDto {
  userId: string;
  preferences: PreferenceNode[];
  lastActiveAt?: string;
}
