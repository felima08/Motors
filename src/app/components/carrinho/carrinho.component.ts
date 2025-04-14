import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

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
        <h2><mat-icon>shopping_cart</mat-icon> Seu Carrinho de Compras</h2>
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
                <mat-icon>chevron_left</mat-icon> Continuar Comprando
              </button>
              <button mat-raised-button color="warn" (click)="limparCarrinho()" class="clear-btn">
                <mat-icon>delete_sweep</mat-icon> Limpar Carrinho
              </button>
              <button mat-raised-button color="primary" (click)="finalizarCompra()" class="checkout-btn">
                <mat-icon>check_circle</mat-icon> Finalizar Compra
              </button>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Modal de Confirmação -->
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
            <button mat-raised-button color="primary" (click)="showConfirmation = false; limparCarrinho()">
              <mat-icon>home</mat-icon> Voltar à Página Inicial
            </button>
            <button mat-stroked-button color="primary" routerLink="/meus-pedidos">
              <mat-icon>receipt</mat-icon> Ver Meus Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
   

    .cart-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: 'Roboto', sans-serif;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #bbdefb; /* light-blue */
    }

    .cart-header h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1976d2; /* primary-blue */
      margin: 0;
      font-weight: 500;
    }

    .cart-header mat-icon {
      color: #1976d2; /* primary-blue */
    }

    .item-count {
      background: #1976d2; /* primary-blue */
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #bbdefb; /* light-blue */
      margin-bottom: 1rem;
    }

    .empty-cart h3 {
      color: #1976d2; /* primary-blue */
      margin-bottom: 0.5rem;
    }

    .empty-cart p {
      color: #263238; /* text-dark */
      margin-bottom: 1.5rem;
    }

    .shop-button {
      background: #1976d2;
      color: white;
      font-weight: 500;
    }

   

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
    }

    .cart-item {
      display: flex;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .cart-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .item-image {
      position: relative;
      width: 180px;
      height: 120px;
      margin-right: 1.5rem;
      border-radius: 6px;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .color-badge {
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      margin: 0 0 0.5rem 0;
      color: var(--text-dark);
      font-size: 1.1rem;
      font-weight: 500;
    }

    .item-meta {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .item-price {
      color: var(--primary-blue);
      font-weight: bold;
      font-size: 1.1rem;
    }

    .item-color {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      color: var(--text-dark);
      font-size: 0.9rem;
    }

    .item-color mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--dark-blue);
    }

    .remove-btn {
      color: #f44336;
      align-self: flex-start;
    }

    .summary-card {
      padding: 1.5rem;
      position: sticky;
      top: 1rem;
    }

    .summary-card h3 {
      margin-top: 0;
      color: var(--primary-blue);
      font-weight: 500;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
    }

    .free-shipping {
      color: #4caf50;
      font-weight: 500;
    }

    .total {
      font-size: 1.2rem;
      margin: 1.5rem 0;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin-top: 2rem;
    }

    .continue-btn {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
    }

    .clear-btn {
      background: #f44336;
      color: white;
    }

    .checkout-btn {
      background: #1976d2;
      color: white;
      font-weight: 500;
    }

    button mat-icon {
      margin-right: 0.5rem;
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
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .confirmation-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    .confirmation-icon {
      color: #4CAF50;
      font-size: 60px;
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
    }

    .confirmation-header h3 {
      color: var(--primary-blue);
      margin: 0;
      text-align: center;
    }

    .confirmation-body {
      padding: 16px 0;
      color: var(--text-dark);
    }

    .confirmation-body p {
      margin: 8px 0;
    }

    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
      flex-wrap: wrap;
    }

    .confirmation-actions button {
      margin: 0;
    }

    @media (max-width: 600px) {
      .confirmation-card {
        width: 90%;
        padding: 16px;
      }
      
      .confirmation-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .confirmation-actions button {
        width: 100%;
      }
    }
  `]
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: CarroCarrinho[] = [];
  total: number = 0;
  showConfirmation: boolean = false;

  private carrinhoService = inject(CarrinhoService);

  ngOnInit(): void {
    this.itensCarrinho = this.carrinhoService.getCarrinho().map(car => ({ car }));
    this.calcularTotal();
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-car.jpg';
  }

  removerItem(car: any): void {
    this.carrinhoService.removerDoCarrinho(car);
    this.itensCarrinho = this.carrinhoService.getCarrinho().map(c => ({ car: c }));
    this.calcularTotal();
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.itensCarrinho = [];
    this.total = 0;
  }

  calcularTotal(): void {
    this.total = this.itensCarrinho.reduce((sum, item) => sum + item.car.price, 0);
  }

  finalizarCompra(): void {
    this.showConfirmation = true;
  }

  gerarNumeroPedido(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}