import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-messages.component.html',
  styleUrls: ['./client-messages.component.scss']
})
export class ClientMessagesComponent implements OnInit {
  messages: Message[] = [];
  messageForm: FormGroup;
  loading = true;
  sending = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.messageForm = this.formBuilder.group({
      recipientId: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadMessages(currentUser.id);
    }
  }

  private loadMessages(userId: number): void {
    this.messageService.getByUserId(userId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading messages. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.messageForm.invalid) return;

    this.sending = true;
    this.error = '';

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const message = {
        ...this.messageForm.value,
        senderId: currentUser.id,
        date: new Date()
      };

      this.messageService.add(message).subscribe({
        next: () => {
          this.sending = false;
          this.messageForm.reset();
          this.loadMessages(currentUser.id);
        },
        error: () => {
          this.sending = false;
          this.error = 'Error sending message. Please try again.';
        }
      });
    }
  }
}
