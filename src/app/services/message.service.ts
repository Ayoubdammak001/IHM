import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';
import { messages } from '../data/messages';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  // Helper method to convert data Message to model Message
  private convertToModelMessage(dataMessage: any): Message {
    return {
      id: dataMessage.id,
      senderId: dataMessage.senderId,
      recipientId: dataMessage.receiverId,
      content: dataMessage.content,
      date: new Date(dataMessage.date),
      read: dataMessage.isRead
    };
  }

  getAll(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/user/${userId}`);
  }

  add(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  update(id: number, message: Message): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, message);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMessagesByClientId(clientId: number): Observable<Message[]> {
    return of(messages.filter(message => 
      message.senderId === clientId || message.receiverId === clientId
    )).pipe(
      map(dataMessages => dataMessages.map(msg => this.convertToModelMessage(msg)))
    );
  }

  getUnreadMessageCount(clientId: number): Observable<number> {
    return of(messages.filter(message => 
      message.receiverId === clientId && !message.isRead
    ).length);
  }

  sendMessage(message: Omit<Message, 'id' | 'date' | 'read'>): Observable<Message> {
    const dataMessage = {
      id: Math.max(...messages.map(m => m.id)) + 1,
      senderId: message.senderId,
      receiverId: message.recipientId,
      subject: '',  // Add a default subject as it's required in the data model
      content: message.content,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    
    messages.push(dataMessage);
    return of(this.convertToModelMessage(dataMessage));
  }

  markAsRead(messageId: number): Observable<boolean> {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      message.isRead = true;
      return of(true);
    }
    return of(false);
  }

  deleteMessage(messageId: number): Observable<boolean> {
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
} 