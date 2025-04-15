import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientProfileComponent } from "../client-profile/client-profile.component";
import { ClientMessagesComponent } from './client-messages/client-messages.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';
import { ClientReservationsComponent } from './client-reservations/client-reservations.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClientRoutingModule,
    ],
    declarations: [
        ClientListComponent,
        ClientProfileComponent,
        ClientMessagesComponent,
        ClientReviewsComponent,
        ClientReservationsComponent
    ]
})
export class ClientModule { }
