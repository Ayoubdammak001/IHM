import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import {ClientProfileComponent} from "../client-profile/client-profile.component";
import { ClientMessagesComponent } from './client-messages/client-messages.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';
import { ClientReservationsComponent } from './client-reservations/client-reservations.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Client'
    },
    children: [
      {
        path: '',
        redirectTo: 'reservations',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ClientListComponent,
        data: {
          title: 'Client List'
        }
      },
      {
        path: 'profile/:id',
        component: ClientProfileComponent,
        data: {
          title: 'Client Profile'
        }
      },
      {
        path: 'messages',
        component: ClientMessagesComponent,
        data: {
          title: 'Client Messages'
        }
      },
      {
        path: 'reviews',
        component: ClientReviewsComponent,
        data: {
          title: 'Client Reviews'
        }
      },
      {
        path: 'reservations',
        component: ClientReservationsComponent,
        data: {
          title: 'Client Reservations'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
