import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientCategoriesComponent } from '../../../../components/client/client-categories/client-categories.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ClientCategoriesComponent
  ]
})
export class ClientDashboardComponent implements OnInit {
  loading = false;
  error = '';
  ngOnInit(): void {}
}
