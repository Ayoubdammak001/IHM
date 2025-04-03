import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../data/clients';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-client-profile',
    templateUrl: './client-profile.component.html',
    styleUrls: ['./client-profile.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ContainerComponent,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        ButtonDirective
    ]
})
export class ClientProfileComponent implements OnInit {
    clientForm: FormGroup;
    client: Client | null = null;
    isEditing = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private clientService: ClientService
    ) {
        this.clientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zipCode: ['', Validators.required],
            company: ['', Validators.required],
            position: ['', Validators.required],
            notes: ['']
        });
    }

    ngOnInit() {
        const clientId = Number(this.route.snapshot.paramMap.get('id'));
        if (clientId) {
            this.clientService.getClientById(clientId).subscribe(client => {
                this.client = client;
                if (client) {
                    this.clientForm.patchValue(client);
                }
            });
        }
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing && this.client) {
            this.clientForm.patchValue(this.client);
        }
    }

    saveChanges() {
        if (this.clientForm.valid && this.client) {
            const updatedClient: Client = {
                ...this.client,
                ...this.clientForm.value
            };
            this.clientService.updateClient(updatedClient).subscribe(client => {
                this.client = client;
                this.isEditing = false;
            });
        }
    }
} 