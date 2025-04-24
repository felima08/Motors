import { Component, inject, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  carrinhoService = inject(CarrinhoService);
  router = inject(Router);
  @ViewChild('headerDiv') headerDiv!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (window.scrollY > 50) { // Ajuste esse valor conforme necessário
      this.headerDiv.nativeElement.classList.add('scrolled');
    } else {
      this.headerDiv.nativeElement.classList.remove('scrolled');
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    // Garante que a referência ao elemento esteja disponível
  }
}