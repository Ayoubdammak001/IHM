import { User } from './user.model';
import {Category} from "./category.model";

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  providerId: number;
  categoryId: number;
  category?: Category;
  provider?: User;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
}

export interface SubCategory {
  id: number;
  name: string;
}
