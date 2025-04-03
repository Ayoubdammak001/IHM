import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importer CommonModule ici pour qu'il soit accessible dans tous les composants
import { CommonModule } from '@angular/common';  // Important pour *ngIf, *ngFor, etc.

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {routes} from "./app.routes";

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
