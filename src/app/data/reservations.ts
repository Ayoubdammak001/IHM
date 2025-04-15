import {ReservationStatus} from "../models/enums";

export interface Reservation {
  id: number;
  clientId: number;
  providerId: number;
  serviceId: number;
  serviceName: string;
  date: Date;
  time: string;
  reservationDate: Date;
  status: ReservationStatus;
  notes: string;
}

export const reservations: Reservation[] = [
  {
    id: 1,
    clientId: 1,
    providerId: 1,
    serviceId: 1,
    serviceName: 'Hair Cut',
    date: new Date('2024-03-15'),
    time: '10:00',
    reservationDate: new Date('2024-03-15'),
    status: ReservationStatus.ACCEPTED,
    notes: 'Regular customer'
  },
  {
    id: 2,
    clientId: 2,
    providerId: 2,
    serviceId: 2,
    serviceName: 'Massage',
    date: new Date('2024-03-15'),
    time: '14:30',
    reservationDate: new Date('2024-03-15'),
    status: ReservationStatus.PENDING,
    notes: 'First time client'
  }
];
