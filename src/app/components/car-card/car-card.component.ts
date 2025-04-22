// src/app/car-card/car-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../carrinho/carrinho.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent {
  @Input() car!: Car;
  @Output() addToCart = new EventEmitter<Car>();
  @Output() viewDetails = new EventEmitter<Car>();
  @Input() estoque: number | undefined; 
  @Input() vendido: boolean | undefined;

  onAddToCart(car: Car) {
    this.addToCart.emit(car);
  }

  onViewDetails(car: Car) {
    this.viewDetails.emit(car);
  }
}
