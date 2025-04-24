// car-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../carrinho/carrinho.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable, take } from 'rxjs';
import { EstoqueMap } from '../models/car/estoque-map.model';




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
    @Input() estoque$!: Observable<EstoqueMap>; // Use a interface EstoqueMap
    @Input() vendido: boolean | undefined;
    

    ngOnInit(): void {
      this.estoque$.pipe(
          take(1)
      ).subscribe((estoque: EstoqueMap) => { // Tipagem explícita aqui também
          console.log(`[CarCardComponent] Estoque recebido para ${this.car.name}:`, estoque);
          console.log(`[CarCardComponent] ID do carro ${this.car.name}:`, this.car.id);
          const carId = this.car.id;
          if (estoque && estoque[carId]) {
              console.log(`[CarCardComponent] Estoque para ${this.car.name} (por ID):`, estoque[carId]);
          } else {
              console.log(`[CarCardComponent] Estoque INDEFINIDO para ${this.car.name} (por ID) ou objeto de estoque vazio.`);
          }
      });
  }

    onAddToCart(car: Car) {
        this.addToCart.emit(car);
    }

    onViewDetails(car: Car) {
        this.viewDetails.emit(car);
    }
}