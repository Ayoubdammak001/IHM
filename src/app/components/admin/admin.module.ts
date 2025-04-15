import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { routes } from './routes';
// ... other imports ...

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHomeComponent,
    // ... other components ...
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DatePipe
  ]
})
export class AdminModule { } 