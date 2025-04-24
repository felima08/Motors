import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService, Car } from '../carrinho/carrinho.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription, Observable, first } from 'rxjs'; // Importe 'first', 'take' não está sendo usado diretamente aqui
import { HeaderComponent } from '../header/header.component';
import { CarCardComponent } from '../car-card/car-card.component';
import { EstoqueService } from '../estoque/estoque.service';
import { FooterComponent } from "../footer/footer.component";

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
    FooterComponent
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
        { id: '7', name: 'Roadster Clássico Bege', imageUrl: 'Roadster Clássico Bege.jpeg', price: 150000.00, description: 'Um ícone atemporal para os amantes de carros clássicos e da liberdade da estrada.', destaque: false, vendido: false },
        { id: '8', name: 'Familiar Monovolume Azul', imageUrl: 'Familiar Monovolume Azul.jpg', price: 58000.50, description: 'Espaço e versatilidade para famílias grandes e viagens confortáveis.', destaque: false, vendido: false },
        { id: '9', name: 'Off-Road Aventura Verde', imageUrl: 'Off-Road Aventura Verde.jpg', price: 79900.99, description: 'Construído para superar qualquer terreno e levar você a aventuras inesquecíveis.', destaque: true, vendido: false },
        { id: '10', name: 'Cupê Esportivo Amarelo', imageUrl: 'Cupê Esportivo Amarelo.png', price: 110000.00, description: 'Design arrojado e desempenho emocionante para quem busca esportividade.', destaque: true, vendido: false },
        { id: '11', name: 'Subcompacto Urbano Cinza', imageUrl: 'Subcompacto Urbano Cinza.jpg', price: 32500.75, description: 'Ideal para o dia a dia na cidade, fácil de estacionar e econômico.', destaque: false, vendido: false },
        { id: '12', name: 'Sedan Híbrido Branco', imageUrl: 'Sedan Híbrido Branco.webp', price: 68000.25, description: 'Combinação de eficiência energética e conforto para uma condução sustentável.', destaque: false, vendido: false }
    ];
    carsDestaque: Car[] = [];
    purchaseMessage: string = '';
   
    private carrinhoSubscription: Subscription | undefined;
    estoque$: Observable<{[key: string]: number}>;

    // Variáveis do chat
    isChatOpen: boolean = false;
    newMessage: string = '';
    messages: Message[] = [];
    isTyping: boolean = false;
    chatUnreadMessages: number = 0;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public carrinhoService: CarrinhoService,
        private estoqueService: EstoqueService,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Use o estoque$ do EstoqueService que agora é um Observable<EstoqueMap>
        this.estoque$ = this.estoqueService.estoque$;
    }
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

    private loadTawkToScript(): void { /* ... */ }
    toggleChat(): void { /* ... */ }
    sendMessage(): void { /* ... */ }
    private simulateResponse(): void { /* ... */ }
    carregarDestaques(): void {
        this.carsDestaque = this.cars.filter(car => car.destaque);
    }
    logout(): void { /* ... */ }
    

    adicionarAoCarrinho(car: Car): void {
        this.estoque$.pipe(first()).subscribe(estoque => {
            // 'estoque' aqui também será do tipo EstoqueMap
            if (estoque[car.id] > 0) {
                this.carrinhoService.adicionarAoCarrinho(car);
                this.snackBar.open(`"${car.name}" adicionado ao carrinho!`, 'Fechar', {
                    duration: 1000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom'
                });
                console.log(`"${car.name}" adicionado ao carrinho.`);
            } else {
                this.snackBar.open(`"${car.name}" está fora de estoque!`, 'Fechar', {
                    duration: 1000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom'
                });
                console.log(`"${car.name}" está fora de estoque.`);
            }
        });
    }

    viewDetails(car: Car): void {
        this.router.navigate(['/detalhes', car.name.toLowerCase().replace(/ /g, '-')]);
    }
}