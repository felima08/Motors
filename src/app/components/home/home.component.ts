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
import { HeaderComponent } from '../header/header.component';
import { CarComponent } from '../models/car/car.component';

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  destaque?: boolean;
  estoque?: number; // Adicionando a propriedade estoque
  vendido?: boolean; // Adicionando a propriedade vendido
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
    HeaderComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  cars: Car[] = [
    { name: 'Esportivo Azul Veloz', imageUrl: '/carro azul esportivo.jpg', price: 75000.00, description: 'Um carro esportivo elegante e potente para quem busca adrenalina.', destaque: true, estoque: 5, vendido: false },
    { name: 'Sedan Confortável Vermelho', imageUrl: 'prata.jpg', price: 48000.50, description: 'Ideal para a família, oferece conforto e segurança em cada viagem.', destaque: true, estoque: 3, vendido: false },
    { name: 'SUV Aventura Cinza', imageUrl: 'suv cinza.jpg', price: 62500.99, description: 'Pronto para qualquer aventura, com espaço e robustez para o seu dia a dia.', destaque: true, estoque: 2, vendido: false },
    { name: 'Hatch Compacto Vermelho', imageUrl: 'Hatch Compacto Vermelho.jpg', price: 35200.00, description: 'Ágil e econômico, perfeito para a cidade.', destaque: true, estoque: 7, vendido: false },
    { name: 'Picape Robusta Preta', imageUrl: 'Picape Robusta Preta.jpg', price: 88900.00, description: 'Força e capacidade para o trabalho e lazer.', destaque: true, estoque: 0, vendido: true },
    { name: 'Elétrico Sustentável Branco', imageUrl: 'Elétrico Sustentável Branco.jpg', price: 92100.75, description: 'O futuro da mobilidade, com zero emissão e alta tecnologia.', destaque: true, estoque: 8, vendido: false },
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
  ) { }

  ngOnInit(): void {
    this.carregarDestaques();
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(() => { });
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
    if (car.estoque && car.estoque > 0 && !car.vendido) {
      car.estoque--;
      if (car.estoque === 0) {
        car.vendido = true;
      }
      this.carrinhoService.adicionarAoCarrinho(car);
      this.snackBar.open(`${car.name} adicionado ao carrinho! Estoque restante: ${car.estoque}`, 'Fechar', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
      console.log(`"${car.name}" adicionado ao carrinho. Estoque restante: ${car.estoque}`);
    } else if (car.vendido) {
      this.snackBar.open(`${car.name} já foi vendido!`, 'Fechar', {
        duration: 2000,
        panelClass: ['warn-snackbar']
      });
      console.log(`"${car.name}" já foi vendido!`);
    } else {
      this.snackBar.open(`${car.name} está fora de estoque!`, 'Fechar', {
        duration: 2000,
        panelClass: ['warn-snackbar']
      });
      console.log(`"${car.name}" está fora de estoque!`);
    }
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