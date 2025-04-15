import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Client'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      
      {
        path: 'profile',
        loadComponent: () =>
          import('./client-profile/client-profile.component').then(
            (m) => m.ClientProfileComponent
          ),
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./client-profile/client-profile.component').then(
            (m) => m.ClientProfileComponent
          ),
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./client-reservations/client-reservations.component').then(
            (m) => m.ClientReservationsComponent
          ),
        data: {
          title: 'Reservations'
        }
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./client-reviews/client-reviews.component').then(
            (m) => m.ClientReviewsComponent
          ),
        data: {
          title: 'Reviews'
        }
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./client-messages/client-messages.component').then(
            (m) => m.ClientMessagesComponent
          ),
        data: {
          title: 'Messages'
        }
      }
    ]
  }
];
