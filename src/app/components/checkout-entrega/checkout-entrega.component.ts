import { Component, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CarrinhoService, } from '../carrinho/carrinho.service'; // Importe a interface Car
import { QRCodeComponent } from 'angularx-qrcode';
import { EstoqueService } from '../estoque/estoque.service';
import { CarComponent } from '../models/car/car.component';

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
        RouterLink,
        QRCodeComponent,
    ],
    templateUrl: './checkout-entrega.component.html',
    styleUrls: ['./checkout-entrega.component.css']
})
export class CheckoutEntregaComponent implements AfterViewInit {
    etapaAtual: number = 1; // Inicia na etapa de entrega
    entregaForm: FormGroup;
    pagamentoForm: FormGroup;
    itensCarrinho = inject(CarrinhoService).getCarrinho();
    total = inject(CarrinhoService).getTotal();
    numeroPedidoSimulado = Math.random().toString(36).substring(2, 10).toUpperCase();
    pedidoConcluido = false;
    metodosPagamento: string[] = ['Cartão de Crédito', 'Pix', 'Débito', 'Boleto'];
    opcoesParcelamento: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Opções de parcelamento
    qrCodePixSimulado: string = '';
    codigoPixSimulado: string = '';
    private estoqueService = inject(EstoqueService); // Injeção do EstoqueService

    constructor(private fb: FormBuilder, private router: Router) {
        this.entregaForm = this.fb.group({
            endereco: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required],
            cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
            metodoEnvio: ['PAC', Validators.required]
        });

        this.pagamentoForm = this.fb.group({
            metodoPagamento: ['', Validators.required],
            numeroCartao: ['', [Validators.pattern(/^\d{16}$/)]],
            nomeTitular: [''],
            dataValidade: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
            cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
            parcelas: ['', Validators.required] // Adicionado controle para parcelas
        });

        this.desabilitarCamposCartao();

        this.pagamentoForm.get('metodoPagamento')?.valueChanges.subscribe(metodo => {
            if (metodo === 'Cartão de Crédito') {
                this.habilitarCamposCartao();
            } else {
                this.desabilitarCamposCartao();
                this.pagamentoForm.patchValue({
                    numeroCartao: '',
                    nomeTitular: '',
                    dataValidade: '',
                    cvv: '',
                    parcelas: '' // Limpa as parcelas ao mudar o método de pagamento
                });
            }
        });
    }

    desabilitarCamposCartao() {
        this.pagamentoForm.get('numeroCartao')?.disable();
        this.pagamentoForm.get('nomeTitular')?.disable();
        this.pagamentoForm.get('dataValidade')?.disable();
        this.pagamentoForm.get('cvv')?.disable();
        this.pagamentoForm.get('parcelas')?.disable(); // Desabilita o campo de parcelas

        this.pagamentoForm.get('numeroCartao')?.clearValidators();
        this.pagamentoForm.get('nomeTitular')?.clearValidators();
        this.pagamentoForm.get('dataValidade')?.clearValidators();
        this.pagamentoForm.get('cvv')?.clearValidators();
        this.pagamentoForm.get('parcelas')?.clearValidators(); // Limpa as validações de parcelas

        this.pagamentoForm.get('numeroCartao')?.updateValueAndValidity();
        this.pagamentoForm.get('nomeTitular')?.updateValueAndValidity();
        this.pagamentoForm.get('dataValidade')?.updateValueAndValidity();
        this.pagamentoForm.get('cvv')?.updateValueAndValidity();
        this.pagamentoForm.get('parcelas')?.updateValueAndValidity(); // Atualiza a validade das parcelas
    }

    habilitarCamposCartao() {
        this.pagamentoForm.get('numeroCartao')?.enable();
        this.pagamentoForm.get('nomeTitular')?.enable();
        this.pagamentoForm.get('dataValidade')?.enable();
        this.pagamentoForm.get('cvv')?.enable();
        this.pagamentoForm.get('parcelas')?.enable(); // Habilita o campo de parcelas

        this.pagamentoForm.get('numeroCartao')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        this.pagamentoForm.get('nomeTitular')?.setValidators([Validators.required]);
        this.pagamentoForm.get('dataValidade')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]);
        this.pagamentoForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        this.pagamentoForm.get('parcelas')?.setValidators([Validators.required]); // Adiciona validação para parcelas

        this.pagamentoForm.get('numeroCartao')?.updateValueAndValidity();
        this.pagamentoForm.get('nomeTitular')?.updateValueAndValidity();
        this.pagamentoForm.get('dataValidade')?.updateValueAndValidity();
        this.pagamentoForm.get('cvv')?.updateValueAndValidity();
        this.pagamentoForm.get('parcelas')?.updateValueAndValidity(); // Atualiza a validade das parcelas
    }

    ngAfterViewInit(): void {
        this.exibirQRCodeSeNecessario();
    }

    gerarDadosPixSimulado(): void {
        this.qrCodePixSimulado = this.gerarStringAleatoria(150);
        this.codigoPixSimulado = this.gerarStringAleatoria(32).toUpperCase();
        this.exibirQRCodeSeNecessario(); // Chama aqui também para garantir a geração imediata se já estiver na etapa correta
    }

    exibirQRCodeSeNecessario(): void {
        if (this.etapaAtual === 3 && this.pagamentoForm.value.metodoPagamento === 'Pix' && this.qrCodePixSimulado) {
            // Não precisamos mais chamar gerarQRCode diretamente
        }
    }

    gerarStringAleatoria(tamanho: number): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        for (let i = 0; i < tamanho; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    avancarEtapa(): void {
        if (this.etapaAtual === 1 && this.entregaForm.valid) {
            this.etapaAtual = 2;
        } else if (this.etapaAtual === 2 && this.pagamentoForm.valid) {
            if (this.pagamentoForm.get('metodoPagamento')?.value === 'Pix') {
                this.gerarDadosPixSimulado();
                this.etapaAtual = 3; // Vai para a etapa de exibição do Pix
            } else {
                this.etapaAtual = 3; // Avança para a confirmação para outros métodos
            }
        } else if (this.etapaAtual < 4) {
            this.etapaAtual++;
        }
    }

    voltarEtapa(): void {
        if (this.etapaAtual > 1) {
            this.etapaAtual--;
        }
    }

    finalizarPedido(): void {
        console.log('Pedido finalizado (simulado)');
        this.pedidoConcluido = true;
        this.etapaAtual = 4;

        // Baixar o estoque para cada item no carrinho
        this.itensCarrinho.forEach(item => {
            this.estoqueService.baixarEstoque(item.id); // Assumindo que 'item.id' é o ID do carro
        });
    }

    copiarParaAreaTransferencia(codigo: string): void {
        console.log('Código Pix copiado (simulado):', codigo);
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

    calcularValorParcela(): number {
        const valorTotal = this.total;
        const numParcelas = this.pagamentoForm.get('parcelas')?.value;

        if (numParcelas > 1) {
            // Simulação de juros simples: 1% por parcela
            const taxaJuros = 0.01 * (numParcelas - 1);
            const valorComJuros = valorTotal * (1 + taxaJuros);
            return valorComJuros / numParcelas;
        } else {
            return valorTotal;
        }
    }
}