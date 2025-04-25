import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-chat-online',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './chat-online.component.html',
  styleUrls: ['./chat-online.component.css']
})
export class ChatOnlineComponent implements OnInit {
  isChatOpen: boolean = false;
  newMessage: string = '';
  messages: Message[] = [];
  isTyping: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const userMessage: Message = {
        text: this.newMessage.trim(),
        isUser: true,
        timestamp: new Date()
      };
      this.messages = [...this.messages, userMessage];
      this.newMessage = '';
      // Aqui você adicionaria a lógica para enviar a mensagem para um servidor
      // ou para simular uma resposta.
      this.simulateResponse();
    }
  }

  private simulateResponse(): void {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      const botMessage: Message = {
        text: 'Olá! Como posso ajudar você hoje?',
        isUser: false,
        timestamp: new Date()
      };
      this.messages = [...this.messages, botMessage];
    }, 1500);
  }
}