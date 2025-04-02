export interface Review {
  id: number;
  rating: number;
  comment: string;
  date: Date;
  clientId: number;
  providerId: number;
  serviceId: number;
} 