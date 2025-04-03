import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../data/clients';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, TableDirective, ButtonDirective } from '@coreui/angular';

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
        ButtonDirective
    ]
})
export class ClientListComponent implements OnInit {
    clients: Client[] = [];

    constructor(private clientService: ClientService) {}

    ngOnInit() {
        this.clientService.getAllClients().subscribe(clients => {
            this.clients = clients;
        });
    }
}
