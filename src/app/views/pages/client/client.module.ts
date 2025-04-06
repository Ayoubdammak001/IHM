import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';

// ✅ Standalone components à importer ici (pas à déclarer !)
import { ClientListComponent } from './client-list/client-list.component';
import { ClientProfileComponent } from '../client-profile/client-profile.component';
import { ClientMessagesComponent } from './client-messages/client-messages.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';
import { ClientReservationsComponent } from './client-reservations/client-reservations.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientRoutingModule,

    // ✅ Importation des composants standalone
    ClientListComponent,
    ClientProfileComponent,
    ClientMessagesComponent,
    ClientReviewsComponent,
    ClientReservationsComponent,
    
  ]
})
export class ClientModule {}
