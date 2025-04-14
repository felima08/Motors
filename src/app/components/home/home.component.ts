import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../carrinho/carrinho.service';

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo-container">
        <h1 class="logo">
          <mat-icon class="logo-icon">directions_car</mat-icon> Felipe Gonçalves Cars
        </h1>
      </div>

      <nav class="nav-menu">
        <a class="nav-link active">Inicio</a>
        <a class="nav-link" >Perfil</a>
        <a class="nav-link" href="https://wa.me/SEUNUMERODOTELEFONE" target="_blank">Contato</a>
        <a class="nav-red" (click)="logout()">Sair</a>
        <a class="nav-link cart-link" routerLink="/carrinho">
          <mat-icon>shopping_cart</mat-icon> Carrinho ({{ carrinhoService.getCarrinho().length }})
        </a>
      </nav>
    </header>

    <div class="main-content">
      <h2 class="section-title">Nossos Modelos em Destaque</h2>

      <mat-grid-list cols="3" rowHeight="380px" gutterSize="20px">
        <mat-grid-tile *ngFor="let car of cars">
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
      </mat-grid-list>

      <div *ngIf="purchaseMessage" class="purchase-message">
        {{ purchaseMessage }}
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
      position: fixed; /* Torna o header fixo na viewport */
      top: 0; /* Alinha o header ao topo da viewport */
      left: 0; /* Alinha o header à esquerda da viewport */
      width: 100%; /* Garante que o header ocupe toda a largura */
      z-index: 100; /* Garante que o header fique acima de outros conteúdos */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Adiciona uma sombra para destacar */
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
      margin-top: 60px; /* Adiciona margem superior para evitar que o conteúdo fique atrás do header fixo */
    }

    .section-title {
      font-size: 2em;
      color: #3f51b5;
      margin-bottom: 20px;
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
      box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3); /* Adiciona uma sombra ao passar o mouse */
      filter: brightness(1.1); /* Aumenta um pouco o brilho */
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
  `],
})
export class HomeComponent {
  cars: Car[] = [
    { name: 'Esportivo Azul Veloz', imageUrl: '/pexels-wavyvisuals-377312923-19938881.jpg', price: 75000.00, description: 'Um carro esportivo elegante e potente para quem busca adrenalina.' },
    { name: 'Sedan Confortável Vermelho', imageUrl: '/pexels-egeardaphotos-2148533277-31575930.jpg', price: 48000.50, description: 'Ideal para a família, oferece conforto e segurança em cada viagem.' },
    { name: 'SUV Aventura Cinza', imageUrl: 'L66325GL_303103289_077-1024x576.jpeg', price: 62500.99, description: 'Pronto para qualquer aventura, com espaço e robustez para o seu dia a dia.' },
    { name: 'Hatch Compacto Vermelho', imageUrl: 'pexels-jisso-heby-597210750-26834309.jpg', price: 35200.00, description: 'Ágil e econômico, perfeito para a cidade.' },
    { name: 'Picape Robusta Preta', imageUrl: 'images.jpg', price: 88900.00, description: 'Força e capacidade para o trabalho e lazer.' },
    { name: 'Elétrico Sustentável Branco', imageUrl: '01.jpg', price: 92100.75, description: 'O futuro da mobilidade, com zero emissão e alta tecnologia.' },
  ];

  purchaseMessage: string = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public carrinhoService: CarrinhoService
  ) {}

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  adicionarAoCarrinho(car: Car) {
    this.carrinhoService.adicionarAoCarrinho(car);
    this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
    console.log('Carro adicionado ao carrinho:', car);
  }

  viewDetails(car: Car) {
    console.log(`Ver detalhes de: ${car.name}`);
    this.router.navigate(['/detalhes', car.name.toLowerCase().replace(/ /g, '-')]);
  }
}