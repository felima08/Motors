import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

interface CarroCarrinho {
  car: any;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h2><mat-icon>shopping_cart</mat-icon> Seu Carrinho</h2>
        <span class="item-count">{{ itensCarrinho.length }} {{ itensCarrinho.length === 1 ? 'item' : 'itens' }}</span>
      </div>

      <div *ngIf="itensCarrinho.length === 0" class="empty-cart">
        <mat-icon class="empty-icon">remove_shopping_cart</mat-icon>
        <h3>Seu carrinho está vazio</h3>
        <p>Explore nossos veículos e encontre o perfeito para você!</p>
        <button mat-raised-button color="primary" routerLink="/home" class="shop-button">
          <mat-icon>directions_car</mat-icon> Voltar para a Loja
        </button>
      </div>

      <div *ngIf="itensCarrinho.length > 0" class="cart-content">
        <div class="items-section">
          <mat-card *ngFor="let item of itensCarrinho" class="cart-item">
            <div class="item-image">
              <img [src]="item.car.imageUrl" alt="{{ item.car.name }}" (error)="handleImageError($event)">
              <div class="color-badge" *ngIf="item.car.color" [style.background-color]="item.car.colorHex || '#607d8b'"></div>
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.car.name }}</h3>
              <div class="item-meta">
                <span class="item-price">R$ {{ item.car.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                <span *ngIf="item.car.color" class="item-color">
                  <mat-icon>palette</mat-icon> {{ item.car.color }}
                </span>
              </div>
            </div>

            <button mat-icon-button class="remove-btn" (click)="removerItem(item.car)" matTooltip="Remover item">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card>
        </div>

        <mat-divider></mat-divider>

        <div class="summary-section">
          <mat-card class="summary-card">
            <h3>Resumo da Compra</h3>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>R$ {{ total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
            </div>

            <div class="summary-row">
              <span>Frete</span>
              <span class="free-shipping">Grátis</span>
            </div>

            <mat-divider></mat-divider>

            <div class="summary-row total">
              <strong>Total</strong>
              <strong>R$ {{ total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</strong>
            </div>

            <div class="action-buttons">
              <button mat-stroked-button routerLink="/home" class="continue-btn">
                Continuar Comprando
              </button>
              <button mat-raised-button color="warn" (click)="limparCarrinho()" class="clear-btn">
                Limpar Carrinho
              </button>
              <button mat-raised-button color="primary" (click)="finalizarCompra()" class="checkout-btn">
                Finalizar Compra
              </button>
            </div>
          </mat-card>
        </div>
      </div>

      <div *ngIf="showConfirmation" class="confirmation-overlay">
        <div class="confirmation-card">
          <button mat-icon-button class="close-btn" (click)="showConfirmation = false">
            <mat-icon>close</mat-icon>
          </button>

          <div class="confirmation-header">
            <mat-icon class="confirmation-icon">check_circle</mat-icon>
            <h3>Compra Finalizada com Sucesso!</h3>
          </div>

          <mat-divider></mat-divider>

          <div class="confirmation-body">
            <p>Obrigado por sua compra!</p>
            <p><strong>Número do Pedido:</strong> #{{ gerarNumeroPedido() }}</p>
            <p><strong>Total:</strong> R$ {{ total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
            <p>Enviamos os detalhes para o seu e-mail.</p>
          </div>

          <mat-divider></mat-divider>

          <div class="confirmation-actions">
            <button mat-raised-button color="primary" (click)="showConfirmation = false; limparCarrinho(); navigateToHome()">
              Voltar à Página Inicial
            </button>
            <button mat-stroked-button color="primary" routerLink="/meus-pedidos">
              Ver Meus Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 900px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }

    .cart-header h2 {
      margin: 0;
    }

    .item-count {
      background-color: #f0f0f0;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.9em;
    }

    .empty-cart {
      text-align: center;
      padding: 30px;
      color: #777;
    }

    .empty-icon {
      font-size: 2em;
      margin-bottom: 10px;
    }

    .shop-button {
      margin-top: 20px;
    }

    .cart-content {
      display: flex;
      gap: 20px;
    }

    .items-section {
      flex-grow: 1;
    }

    .cart-item {
      display: flex;
      align-items: center;
      border: 1px solid #eee;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
    }

    .item-image {
      width: 100px;
      height: 70px;
      margin-right: 15px;
      overflow: hidden;
      border-radius: 5px;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .color-badge {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-left: 5px;
      border: 1px solid #ccc;
    }

    .item-details {
      flex-grow: 1;
    }

    .item-name {
      margin-top: 0;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .item-meta {
      font-size: 0.9em;
      color: #555;
    }

    .item-price {
      font-weight: bold;
      color: #333;
    }

    .item-color {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .remove-btn {
      color: #d32f2f;
    }

    .summary-section {
      width: 300px;
    }

    .summary-card {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 5px;
    }

    .summary-card h3 {
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .total {
      font-weight: bold;
      font-size: 1.1em;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    .continue-btn {
      border: 1px solid #1976d2;
      color: #1976d2;
    }

    .clear-btn {
      background-color: #f44336;
      color: white;
    }

    .checkout-btn {
      background-color: #1976d2;
      color: white;
    }

    /* Estilos para a confirmação de compra */
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .confirmation-card {
      background: white;
      border-radius: 5px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: #777;
    }

    .confirmation-header {
      margin-bottom: 20px;
    }

    .confirmation-icon {
      font-size: 2em;
      color: #4caf50;
      margin-bottom: 10px;
    }

    .confirmation-body {
      margin-bottom: 20px;
    }

    .confirmation-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  `]
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  itensCarrinho: CarroCarrinho[] = [];
  total: number = 0;
  showConfirmation: boolean = false;

  private carrinhoService = inject(CarrinhoService);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private carrinhoSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(cars => {
      this.itensCarrinho = cars.map(car => ({ car }));
      this.calcularTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-car.jpg';
  }

  removerItem(car: any): void {
    this.carrinhoService.removerDoCarrinho(car);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
  }

  calcularTotal(): void {
    this.total = this.carrinhoService.getTotal();
  }

  finalizarCompra(): void {
    if (this.itensCarrinho.length > 0) {
      const detalhesCompra = {
        itensComprados: this.itensCarrinho.map(item => ({
          name: item.car.name,
          price: item.car.price
        })),
        total: this.total,
        dataCompra: new Date().toISOString(),
        // Adicione aqui informações do usuário se estiver disponível
      };

      this.apiService.salvarCompra(detalhesCompra).subscribe({
        next: (response: any) => {
          this.showConfirmation = true;
        },
        error: (error: any) => {
          this.snackBar.open('Erro ao finalizar a compra.', 'Fechar', { duration: 3000 });
          console.error('Erro ao salvar compra:', error);
        }
      });
    } else {
      this.snackBar.open('Seu carrinho está vazio. Adicione itens para finalizar a compra.', 'Fechar', { duration: 3000 });
    }
  }

  gerarNumeroPedido(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}