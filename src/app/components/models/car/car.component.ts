import { Component } from '@angular/core';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
    name: string= "";
    imageUrl: string= "";
    price: number = 0;
    description: string= "";
    destaque?: boolean;
    
}


  

