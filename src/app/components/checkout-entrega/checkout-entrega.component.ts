// src/app/checkout-entrega/checkout-entrega.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CarrinhoService } from '../carrinho/carrinho.service';

@Component({
  selector: 'app-checkout-entrega',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './checkout-entrega.component.html',
  styleUrls: ['./checkout-entrega.component.css']
})
export class CheckoutEntregaComponent {
  etapaAtual: number = 1; // 1: Entrega, 2: Pagamento, 3: Confirmação, 4: Concluído
  entregaForm: FormGroup;
  pagamentoForm: FormGroup;
  itensCarrinho = inject(CarrinhoService).getCarrinho();
  total = inject(CarrinhoService).getTotal();
  numeroPedidoSimulado = Math.random().toString(36).substring(2, 10).toUpperCase();
  pedidoConcluido = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.entregaForm = this.fb.group({
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      metodoEnvio: ['PAC', Validators.required]
    });

    this.pagamentoForm = this.fb.group({
      numeroCartao: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nomeTitular: ['', Validators.required],
      dataValidade: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }
  

  avancarEtapa(): void {
    if (this.etapaAtual < 4) {
      this.etapaAtual++;
    }
  }

  voltarEtapa(): void {
    if (this.etapaAtual > 1) {
      this.etapaAtual--;
    }
  }

  finalizarPedido(): void {
    if (this.entregaForm.valid && this.pagamentoForm.valid) {
      console.log('Pedido Finalizado com os dados:', this.entregaForm.value, this.pagamentoForm.value, this.itensCarrinho, this.total);
      inject(CarrinhoService).limparCarrinho();
      this.pedidoConcluido = true;
      this.etapaAtual = 4;
    } else {
      this.markFormGroupTouched(this.entregaForm);
      this.markFormGroupTouched(this.pagamentoForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  voltarParaCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }
}