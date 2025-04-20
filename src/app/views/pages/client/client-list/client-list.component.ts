import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/user.model';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  TableDirective,
  ButtonDirective
} from '@coreui/angular';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    MatPaginatorModule
  ]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  paginatedClients: Client[] = [];

  loading = false;
  error = '';

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  totalItems = 0;
  currentClientId!: number;

  constructor(private clientService: ClientService,private authService: AuthService,) {}

  ngOnInit(): void {
    this.setUserIdAndLoadClient();

  }

  setUserIdAndLoadClient(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.id) {
      this.currentClientId = currentUser.id;
      this.loadClientById(this.currentClientId);
    } else {
      this.error = 'No user connected';
    }
  }
  loadClientById(id: number): void {
    this.loading = true;
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        if (client) {
          this.clients = [client]; // mettre en tableau
          this.totalItems = 1;
          this.paginate();
        } else {
          this.clients = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load client.';
        this.loading = false;
      }
    });
  }
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginate();
  }

  paginate(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClients = this.clients.slice(start, end);
  }
}
