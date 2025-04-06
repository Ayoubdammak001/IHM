import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, ExtraOptions } from '@angular/router'; // 👈 Ajout ici
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// ✅ Options pour scroll vers fragment (id="...")
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollOffset: [0, 70], // optionnel : décale si tu as une navbar fixe
};

@NgModule({
  declarations: [
    AppComponent,
    // autres composants ici
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes, routerOptions) // 👈 Appliquer les options ici
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
