import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import CommonModule for *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routes } from "./app.routes"; // Import your routes here

@NgModule({
  declarations: [
    AppComponent,
    // other components here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes) // Configure the router with the routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
