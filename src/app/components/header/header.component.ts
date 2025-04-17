import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';// Importe seu carrinho service

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  carrinhoService = inject(CarrinhoService);
  router = inject(Router);

  logout() {
    // Lógica de logout (limpar token, carrinho, etc.)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']); // Redirecione para a página de login
  }
}