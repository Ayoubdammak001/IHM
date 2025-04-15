import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { Message } from '../../../../models/message.model';
import { AuthService } from '../../../../services/auth.service';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, TableDirective, ButtonDirective, BadgeComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective } from '@coreui/angular';

// Material Paginator
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user.service";

// Custom Paginator Intl Provider
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'First page';
  itemsPerPageLabel = 'Items per page:';
  lastPageLabel = 'Last page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return 'Page 1 of 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  }
}

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
        FormControlDirective,
        MatPaginatorModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
    ]
})
export class ClientMessagesComponent implements OnInit {
    messages: Message[] = [];
    paginatedMessages: Message[] = [];
    messageForm: FormGroup;
    currentClientId: number;
    loading = false;
    error = '';
    success = '';

    // Pagination properties
    totalItems = 0;
    pageSize = 5;
    pageSizeOptions = [5, 10, 25];
    pageIndex = 0;

    providers: User[] = [];
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
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
    this.loadProviders();
    this.loadUsers();
  }

  usersMap: { [id: number]: User } = {};

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.usersMap = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as { [id: number]: User });
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      }
    });
  }

  loadProviders() {
    this.userService.getProviders().subscribe({
      next: (providers) => {
        this.providers = providers;
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
      }
    });
  }

    loadMessages() {
        this.loading = true;
        this.error = '';

        this.messageService.getMessagesByClientId(this.currentClientId)
            .subscribe({
                next: (messages) => {
                    this.messages = messages;
                    this.updatePagination();
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

    // Pagination methods
    handlePageEvent(e: PageEvent) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.updatePaginatedResults();
    }

    updatePagination() {
        this.totalItems = this.messages.length;
        this.pageIndex = 0; // Reset to first page
        this.updatePaginatedResults();
    }

    updatePaginatedResults() {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedMessages = this.messages.slice(startIndex, endIndex);
    }

  getUserName(id: number): string {
    return this.usersMap[id]?.username ?? `User #${id}`;
  }

}
