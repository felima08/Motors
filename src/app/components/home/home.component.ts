import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  destaque?: boolean;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <header class="header">
      <div class="logo-container">
        <h1 class="logo">
          <mat-icon class="logo-icon">directions_car</mat-icon> FG Premium Motors
        </h1>
      </div>

      <nav class="nav-menu">
        <a class="nav-link active">Inicio</a>
        <a class="nav-link" routerLink="/perfil">Perfil</a>
        <a class="nav-link" href="https://wa.me/SEUNUMERODOTELEFONE" target="_blank">Contato</a>
        <a class="nav-red" (click)="logout()">Sair</a>
        <a class="nav-link cart-link" routerLink="/carrinho">
          <mat-icon>shopping_cart</mat-icon> Carrinho ({{ carrinhoService.getCarrinho().length }})
        </a>
      </nav>
    </header>

    <div class="main-content">
      <div class="search-bar-below-header">
        <mat-form-field appearance="outline">
          <mat-label>Buscar Modelos</mat-label>
          <input matInput type="text" [(ngModel)]="searchTerm" (input)="buscarProdutos()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <h2 class="section-title" *ngIf="!searchTerm || searchResults.length === 0">Nossos Modelos em Destaque</h2>
      <h2 class="section-title" *ngIf="searchTerm && searchResults.length > 0">Resultados da Busca</h2>

      <mat-grid-list cols="3" rowHeight="380px" gutterSize="20px">
        <mat-grid-tile *ngFor="let car of (searchTerm ? searchResults : carsDestaque)">
          <mat-card class="car-card" (click)="adicionarAoCarrinho(car)" style="cursor: pointer;">
            <img mat-card-image [src]="car.imageUrl" alt="{{ car.name }}">
            <mat-card-header>
              <mat-card-title>{{ car.name }}</mat-card-title>
              <mat-card-subtitle>R$ {{ car.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="car-description">{{ car.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" (click)="$event.stopPropagation(); adicionarAoCarrinho(car)">
                <mat-icon>add_shopping_cart</mat-icon> Adicionar ao Carrinho
              </button>
              <button mat-button color="accent" (click)="viewDetails(car)">
                <mat-icon>info</mat-icon> Detalhes
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile *ngIf="searchTerm && searchResults.length === 0 && !carsDestaque.length">
          <mat-card class="no-results">
            <mat-card-content>
              Nenhum modelo em destaque no momento.
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile *ngIf="searchTerm && searchResults.length === 0 && carsDestaque.length > 0">
          <mat-card class="no-results">
            <mat-card-content>
              Nenhum modelo encontrado para "{{ searchTerm }}".
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <div *ngIf="purchaseMessage" class="purchase-message">
        {{ purchaseMessage }}
      </div>
    </div>

    <div class="chat-widget">
      <button class="chat-button" (click)="toggleChat()">
        <mat-icon>chat</mat-icon> Fale Conosco
        <span class="unread-count" *ngIf="chatUnreadMessages > 0">{{chatUnreadMessages}}</span>
      </button>
      <div class="chat-container" [class.open]="isChatOpen">
        <div class="chat-header">
          <mat-icon>person</mat-icon> Atendimento ao Cliente
          <button class="close-button" (click)="toggleChat()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="chat-body">
          <div *ngFor="let msg of messages" class="message" [class.sent]="msg.isUser" [class.received]="!msg.isUser">
            {{msg.text}}
            <div class="message-time">{{msg.timestamp | date:'HH:mm'}}</div>
          </div>
          <div class="typing-indicator" *ngIf="isTyping">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
        <div class="chat-footer">
          <mat-form-field class="message-input">
            <textarea matInput [(ngModel)]="newMessage"
                      (keydown.enter)="sendMessage()"
                      placeholder="Digite sua mensagem..."></textarea>
          </mat-form-field>
          <button mat-icon-button color="primary"
                  class="send-button"
                  (click)="sendMessage()"
                  [disabled]="!newMessage.trim()">
            <mat-icon>send</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      background-color: #3f51b5;
      color: white;
      padding: 1em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .logo {
      margin: 0;
      font-size: 1.5em;
      cursor: pointer;
    }

    .logo-icon {
      margin-right: 0.5em;
      cursor: pointer;
    }

    .nav-menu {
      display: flex;
      gap: 1em;
      cursor: pointer;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5em 1em;
      border-radius: 5px;
      cursor: pointer;
    }

    .nav-link:hover {
      background-color: #303f9f;
    }


    .nav-link.active {
      font-weight: bold;
    }
    .nav-red{
      color: white;
      text-decoration: none;
      padding: 0.5em 1em;
      border-radius: 5px;
      cursor: pointer;
      background-color: #dc3545; /* Vermelho Bootstrap */

    }

    .cart-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: auto;
      margin-right:20px;
    }

    .cart-link mat-icon {
      margin-right: 0.3em;
    }

    .main-content {
      padding: 20px;
      margin-top: 80px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .search-bar-below-header {
      width: 100%;
      max-width: 400px;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 2em;
      color: #3f51b5;
      margin-bottom: 20px;
      width: 100%;
      text-align: left;
    }

    .mat-grid-list {
      width: 100%;
    }

    .car-card {
      max-width: 350px;
    }

    .car-card img {
      height: 200px;
      object-fit: cover;
      transition: box-shadow 0.3s ease-in-out, filter 0.3s ease-in-out;
    }

    .car-card:hover img {
      box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
      filter: brightness(1.1);
    }

    .car-description {
      font-size: 0.9em;
      color: #555;
    }

    .mat-card-actions {
      display: flex;
      justify-content: space-around;
    }

    .purchase-message {
      margin-top: 20px;
      padding: 15px;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 5px;
      border: 1px solid #a5d6a7;
    }

    .no-results {
      padding: 20px;
      text-align: center;
      color: #777;
    }

    /* Esconde o container de busca anterior */
    .search-container {
      display: none;
    }

    /* Estilos do Chat */
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-button {
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 15px 20px;
      font-size: 1em;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .chat-button:hover {
      background-color: #303f9f;
      transform: translateY(-2px);
    }

    .chat-button .unread-count {
      background-color: #ff4081;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
    }

    .chat-container {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      width: 350px;
      height: 450px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      bottom: 70px;
      right: 0;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      visibility: hidden;
    }

    .chat-container.open {
      opacity: 1;
      transform: translateY(0);
      visibility: visible;
    }

    .chat-header {
      background-color: #3f51b5;
      color: white;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-header mat-icon {
      margin-right: 10px;
    }

    .close-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
    }

    .chat-body {
      padding: 15px;
      flex-grow: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background-color: #f9f9f9;
    }

    .message {
      padding: 10px 15px;
      border-radius: 18px;
      max-width: 80%;
      position: relative;
      word-break: break-word;
    }

    .message.received {
      background-color: white;
      align-self: flex-start;
      border-bottom-left-radius: 5px;
    }

    .message.sent {
      background-color: #e3f2fd;
      align-self: flex-end;
      border-bottom-right-radius: 5px;
    }

    .message-time {
      font-size: 0.7em;
      color: #666;
      margin-top: 5px;
      text-align: right;
    }

    .typing-indicator {
      display: flex;
      align-self: flex-start;
      padding: 10px 15px;
      background-color: white;
      border-radius: 18px;
      margin-bottom: 10px;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background-color: #666;
      border-radius: 50%;
      margin: 0 2px;
      animation: typingAnimation 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) {
      animation-delay: 0s;
    }
    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typingAnimation {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    .chat-footer {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      background-color: white;
    }

    .message-input {
      flex-grow: 1;
      margin-right: 10px;
    }

    .message-input textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 10px 15px;
      resize: none;
      min-height: 40px;
      max-height: 100px;
      outline: none;
      transition: border 0.3s;
    }

    .message-input textarea:focus {
      border-color: #3f51b5;
    }

    .send-button {
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .send-button:hover {
      background-color: #303f9f;
    }
    
    .send-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  cars: Car[] = [
    { name: 'Esportivo Azul Veloz', imageUrl: '/pexels-wavyvisuals-377312923-19938881.jpg', price: 75000.00, description: 'Um carro esportivo elegante e potente para quem busca adrenalina.', destaque: true },
    { name: 'Sedan Confortável Vermelho', imageUrl: '/pexels-egeardaphotos-2148533277-31575930.jpg', price: 48000.50, description: 'Ideal para a família, oferece conforto e segurança em cada viagem.' },
    { name: 'SUV Aventura Cinza', imageUrl: 'L66325GL_303103289_077-1024x576.jpeg', price: 62500.99, description: 'Pronto para qualquer aventura, com espaço e robustez para o seu dia a dia.', destaque: true },
    { name: 'Hatch Compacto Vermelho', imageUrl: 'pexels-jisso-heby-597210750-26834309.jpg', price: 35200.00, description: 'Ágil e econômico, perfeito para a cidade.' },
    { name: 'Picape Robusta Preta', imageUrl: 'images.jpg', price: 88900.00, description: 'Força e capacidade para o trabalho e lazer.' },
    { name: 'Elétrico Sustentável Branco', imageUrl: '01.jpg', price: 92100.75, description: 'O futuro da mobilidade, com zero emissão e alta tecnologia.', destaque: true },
  ];
  
  carsDestaque: Car[] = [];
  purchaseMessage: string = '';
  searchTerm: string = '';
  searchResults: Car[] = [];
  isSearchVisible: boolean = false;
  private carrinhoSubscription: Subscription | undefined;

  // Variáveis do chat
  isChatOpen: boolean = false;
  newMessage: string = '';
  messages: Message[] = [
    { text: 'Olá! Como posso ajudar você hoje?', isUser: false, timestamp: new Date() }
  ];
  isTyping: boolean = false;
  chatUnreadMessages: number = 0;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public carrinhoService: CarrinhoService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.carregarDestaques();
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(() => {});
  }

  ngAfterViewInit(): void {
    this.loadTawkToScript();
  }

  ngOnDestroy(): void {
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }
  }

  private loadTawkToScript(): void {
    if (typeof window !== 'undefined') {
      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://embed.tawk.to/SEU_ID_DO_TAWK_TO/default';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      const firstScriptTag = this.document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(script, firstScriptTag);
    }
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.chatUnreadMessages = 0;
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const userMessage: Message = {
      text: this.newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    this.simulateResponse();
    this.newMessage = '';
  }

  private simulateResponse(): void {
    this.isTyping = true;
    
    setTimeout(() => {
      const responses = [
        'Obrigado pela sua mensagem! Entraremos em contato em breve.',
        'Poderia me informar mais detalhes sobre sua dúvida?',
        'Estamos verificando as informações para te ajudar.',
        'Temos ótimas opções que podem te interessar!',
        'Um momento enquanto verifico isso para você...'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      this.messages.push({
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      });
      
      this.isTyping = false;
      
      if (!this.isChatOpen) {
        this.chatUnreadMessages++;
      }
    }, 1500);
  }

  carregarDestaques(): void {
    this.carsDestaque = this.cars.filter(car => car.destaque);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  adicionarAoCarrinho(car: Car): void {
    this.carrinhoService.adicionarAoCarrinho(car);
    this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  viewDetails(car: Car): void {
    this.router.navigate(['/detalhes', car.name.toLowerCase().replace(/ /g, '-')]);
  }

  buscarProdutos(): void {
    this.searchResults = this.cars.filter(car =>
      car.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}