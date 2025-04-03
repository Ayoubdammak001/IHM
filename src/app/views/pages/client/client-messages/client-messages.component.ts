import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { Message } from '../../../../models/message.model';
import { AuthService } from '../../../../services/auth.service';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, TableDirective, ButtonDirective, BadgeComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective } from '@coreui/angular';

@Component({
    selector: 'app-client-messages',
    templateUrl: './client-messages.component.html',
    styleUrls: ['./client-messages.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ContainerComponent,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        TableDirective,
        ButtonDirective,
        BadgeComponent,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective
    ]
})
export class ClientMessagesComponent implements OnInit {
    messages: Message[] = [];
    messageForm: FormGroup;
    currentClientId: number;
    loading = false;
    error = '';
    success = '';

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        // Get current user ID from auth service
        const currentUser = this.authService.currentUserValue;
        this.currentClientId = currentUser ? currentUser.id : 1;

        this.messageForm = this.fb.group({
            receiverId: ['', Validators.required],
            subject: ['', Validators.required],
            content: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadMessages();
    }

    loadMessages() {
        this.loading = true;
        this.error = '';

        this.messageService.getMessagesByClientId(this.currentClientId)
            .subscribe({
                next: (messages) => {
                    this.messages = messages;
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Failed to load messages. Please try again.';
                    this.loading = false;
                    console.error('Error loading messages:', err);
                }
            });
    }

    sendMessage() {
        if (this.messageForm.valid) {
            this.loading = true;
            this.error = '';
            this.success = '';

            const formValues = this.messageForm.value;
            const message = {
                senderId: this.currentClientId,
                recipientId: formValues.receiverId,
                content: formValues.content
            };

            this.messageService.sendMessage(message)
                .subscribe({
                    next: () => {
                        this.success = 'Message sent successfully!';
                        this.messageForm.reset();
                        this.loadMessages();
                    },
                    error: (err) => {
                        this.error = 'Failed to send message. Please try again.';
                        this.loading = false;
                        console.error('Error sending message:', err);
                    }
                });
        }
    }

    deleteMessage(id: number) {
        if (confirm('Are you sure you want to delete this message?')) {
            this.loading = true;
            this.error = '';

            this.messageService.deleteMessage(id)
                .subscribe({
                    next: (success) => {
                        if (success) {
                            this.success = 'Message deleted successfully!';
                            this.loadMessages();
                        } else {
                            this.error = 'Failed to delete message.';
                            this.loading = false;
                        }
                    },
                    error: (err) => {
                        this.error = 'Failed to delete message. Please try again.';
                        this.loading = false;
                        console.error('Error deleting message:', err);
                    }
                });
        }
    }

    markAsRead(id: number) {
        this.loading = true;
        this.error = '';

        this.messageService.markAsRead(id)
            .subscribe({
                next: (success) => {
                    if (success) {
                        this.loadMessages();
                    } else {
                        this.error = 'Failed to mark message as read.';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Failed to mark message as read. Please try again.';
                    this.loading = false;
                    console.error('Error marking message as read:', err);
                }
            });
    }
}
