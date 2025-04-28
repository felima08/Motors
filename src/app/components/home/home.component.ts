import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService, Car } from '../carrinho/carrinho.service';
import { Subscription, Observable, map } from 'rxjs'; // Importe Observable e map
import { HeaderComponent } from '../header/header.component';
import { CarCardComponent } from '../car-card/car-card.component';
import { FooterComponent } from "../footer/footer.component";
import { ChatOnlineComponent } from '../chat-online/chat-online.component';
import { EstoqueService } from '../estoque/estoque.service';
import { EstoqueMap } from '../models/car/estoque-map.model'; // Importe a interface EstoqueMap

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ChatOnlineComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RouterModule,
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

    { id: '7', name: 'Roadster Clássico Bege', imageUrl: 'Roadster Clássico Bege.jpeg', price: 150000.00, description: 'Um ícone atemporal para os amantes de carros clássicos e da liberdade da estrada.', destaque: true, vendido: false },

    { id: '8', name: 'Familiar Monovolume Azul', imageUrl: 'Familiar Monovolume Azul.jpg', price: 58000.50, description: 'Espaço e versatilidade para famílias grandes e viagens confortáveis.', destaque: true, vendido: false },

    { id: '9', name: 'Off-Road Aventura Verde', imageUrl: 'Off-Road Aventura Verde.jpg', price: 79900.99, description: 'Construído para superar qualquer terreno e levar você a aventuras inesquecíveis.', destaque: true, vendido: false },

    { id: '10', name: 'Cupê Esportivo Amarelo', imageUrl: 'Cupê Esportivo Amarelo.png', price: 110000.00, description: 'Design arrojado e desempenho emocionante para quem busca esportividade.', destaque: true, vendido: false },

    { id: '11', name: 'Subcompacto Urbano Cinza', imageUrl: 'Subcompacto Urbano Cinza.jpg', price: 32500.75, description: 'Ideal para o dia a dia na cidade, fácil de estacionar e econômico.', destaque: true, vendido: false },

    { id: '12', name: 'Sedan Híbrido Branc', imageUrl: 'Sedan Híbrido Branco.webp', price: 68000.25, description: 'Combinação de eficiência energética e conforto para uma condução sustentável.', destaque: true, vendido: false }
  ];
  carsDestaque: Car[] = [];
  purchaseMessage: string = '';

  private carrinhoSubscription: Subscription | undefined;
  private carrinhoService = inject(CarrinhoService);
  private snackBar = inject(MatSnackBar);
  private estoqueService = inject(EstoqueService); // Injeta o EstoqueService

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.carregarDestaquesComEstoque();
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(() => { });
  }

  ngAfterViewInit(): void {
    console.log('HomeComponent initialized and view children are ready.');
  }

  ngOnDestroy(): void {
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }
    console.log('HomeComponent destroyed.');
  }

  getEstoqueParaCarro(carId: string): Observable<EstoqueMap> {
    return this.estoqueService.estoque$.pipe(
      map(estoque => ({ [carId]: estoque[carId] !== undefined ? estoque[carId] : 0 }))
    );
  }

  carregarDestaquesComEstoque(): void {
    this.carsDestaque = this.cars.filter(car => car.destaque);
  }

  adicionarAoCarrinho(car: Car): void {
    const adicionado = this.carrinhoService.adicionarAoCarrinho(car);
    if (adicionado) {
      this.snackBar.open(`"${car.name}" adicionado ao carrinho!`, 'Fechar', {
        duration: 1000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      console.log(`"${car.name}" adicionado ao carrinho.`);
    } else {
      this.snackBar.open(`Estoque esgotado para "${car.name}" ou limite no carrinho atingido!`, 'Fechar', {
        duration: 1500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      console.log(`"${car.name}" - Estoque esgotado ou limite atingido.`);
    }
  }

  viewDetails(car: Car): void {
    this.router.navigate(['/detalhes', car.name.toLowerCase().replace(/ /g, '-')]);
  }
}