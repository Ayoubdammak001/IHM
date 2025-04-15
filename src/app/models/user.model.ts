import { Role, Gender } from './enums';
import { Review } from './review.model';
import { Service } from './service.model';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: boolean;
  phone?: string;
  address?: string;
  description?: string;
}

export interface Client extends User {
  reviewHistory: Review[];
}

export interface Provider extends User {
  skills: string[];
  services: Service[];
}

export interface Admin extends User {}
