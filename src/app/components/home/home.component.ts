// src/app/home/home.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService, Car } from '../carrinho/carrinho.service'; // Importe a interface Car
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { CarCardComponent } from '../car-card/car-card.component';
import { EstoqueService } from '../estoque/estoque.service'; // Importe o EstoqueService


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
        MatInputModule,
        CarCardComponent,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    cars: Car[] = [
        { id: '1', name: 'Esportivo Azul Veloz', imageUrl: '/carro azul esportivo.jpg', price: 75000.00, description: 'Um carro esportivo elegante e potente para quem busca adrenalina.', destaque: true, vendido: false },
        { id: '2', name: 'Sedan Confortável Prata', imageUrl: 'prata.jpg', price: 48000.50, description: 'Ideal para a família, oferece conforto e segurança em cada viagem.', destaque: true, vendido: false },
        { id: '3', name: 'SUV Aventura Cinza', imageUrl: 'suv cinza.jpg', price: 62500.99, description: 'Pronto para qualquer aventura, com espaço e robustez para o seu dia a dia.', destaque: true, vendido: false },
        { id: '4', name: 'Hatch Compacto Vermelho', imageUrl: 'Hatch Compacto Vermelho.jpg', price: 35200.00, description: 'Ágil e econômico, perfeito para a cidade.', destaque: true, vendido: false },
        { id: '5', name: 'Picape Robusta Preta', imageUrl: 'Picape Robusta Preta.jpg', price: 88900.00, description: 'Força e capacidade para o trabalho e lazer.', destaque: true, vendido: true },
        { id: '6', name: 'Elétrico Sustentável Branco', imageUrl: 'Elétrico Sustentável Branco.jpg', price: 92100.75, description: 'O futuro da mobilidade, com zero emissão e alta tecnologia.', destaque: true, vendido: false },
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
    messages: Message[] = [/* ... suas mensagens do chat ... */];
    isTyping: boolean = false;
    chatUnreadMessages: number = 0;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public carrinhoService: CarrinhoService,
        private estoqueService: EstoqueService, // Injeta o EstoqueService
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

    private loadTawkToScript(): void { /* ... sua lógica de carregamento do Tawk.to ... */ }
    toggleChat(): void { /* ... sua lógica do chat ... */ }
    sendMessage(): void { /* ... sua lógica do chat ... */ }
    private simulateResponse(): void { /* ... sua lógica do chat ... */ }
    carregarDestaques(): void {
        this.carsDestaque = this.cars.filter(car => car.destaque);
    }
    logout(): void { /* ... sua lógica de logout ... */ }
    buscarProdutos(): void {
        this.searchResults = this.cars.filter(car =>
            car.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.isSearchVisible = this.searchTerm.length > 0 && this.searchResults.length > 0;
    }

    adicionarAoCarrinho(car: Car): void {
        this.carrinhoService.adicionarAoCarrinho(car);
        this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
            duration: 2000,
            panelClass: ['success-snackbar']
        });
        console.log(`"${car.name}" adicionado ao carrinho.`);
    }

    viewDetails(car: Car): void {
        this.router.navigate(['/detalhes', car.name.toLowerCase().replace(/ /g, '-')]);
    }

    getEstoqueDoCarro(carId: string): number | undefined {
        return this.estoqueService.getQuantidade(carId);
    }
}