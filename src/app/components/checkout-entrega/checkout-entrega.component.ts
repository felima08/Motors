import { Component, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CarrinhoService, Car } from '../carrinho/carrinho.service'; // Importe a interface Car
import { QRCodeComponent } from 'angularx-qrcode';
import { EstoqueService } from '../estoque/estoque.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importe MatSnackBar
import { Clipboard } from '@angular/cdk/clipboard'; // Importe Clipboard
import { ApiService } from '../../services/api.service'; // Importe o ApiService
import { ChatOnlineComponent } from '../chat-online/chat-online.component';
import { MatCardModule } from '@angular/material/card'; // Importe MatCardModule



@Component({
    selector: 'app-checkout-entrega',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ChatOnlineComponent,
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
        MatCardModule, // Adicione MatCardModule aqui
    ],
    templateUrl: './checkout-entrega.component.html',
    styleUrls: ['./checkout-entrega.component.css']
})
export class CheckoutEntregaComponent implements AfterViewInit {
    etapaAtual: number = 1; // Inicia na etapa de entrega
    entregaForm: FormGroup;
    pagamentoForm: FormGroup;
    itensCarrinho: Car[] = inject(CarrinhoService).getCarrinho(); // Obtém diretamente o array de Car
    total = inject(CarrinhoService).getTotal();
    numeroPedidoSimulado = Math.random().toString(36).substring(2, 10).toUpperCase();
    pedidoConcluido = false;
    metodosPagamento: string[] = ['Cartão de Crédito', 'Pix', 'Débito', 'Boleto'];
    opcoesParcelamento: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Opções de parcelamento
    qrCodePixSimulado: string = '';
    codigoPixSimulado: string = '';
    private estoqueService = inject(EstoqueService); // Injeção do EstoqueService
    private snackBar = inject(MatSnackBar); // Injeção do MatSnackBar
    private clipboard = inject(Clipboard); // Injeção do Clipboard
    private carrinhoService = inject(CarrinhoService);
    private apiService = inject(ApiService); // Injeta o ApiService
    cupomDigitado: string | null = null; // Adicione para receber o cupom
    descontoAplicado: number = 0; // Adicione para receber o desconto

    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
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

        // Recebe os dados do cupom via queryParams
        this.route.queryParams.subscribe(params => {
            if (params['cupom']) {
                this.cupomDigitado = params['cupom'];
            }
            if (params['desconto']) {
                this.descontoAplicado = parseFloat(params['desconto']);
                this.total -= this.descontoAplicado; // Aplica o desconto ao total
            } else {
                this.total = inject(CarrinhoService).getTotal(); // Garante o total inicial
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

    dadosEntrega: any = {}; // Declare a variável no topo da classe

    avancarEtapa(): void {
        if (this.etapaAtual === 1 && this.entregaForm.valid) {
            this.dadosEntrega = { ...this.entregaForm.value }; // Salva os dados de entrega
            this.etapaAtual = 2;
        } else if (this.etapaAtual === 2 && this.pagamentoForm.valid) {
            // ... (seu código existente para a etapa de pagamento)
            this.etapaAtual = 3;
        } else if (this.etapaAtual < 4) {
            this.etapaAtual++;
        }
    }

    voltarEtapa(): void {
        if (this.etapaAtual > 1) {
            this.etapaAtual--;
        }
    }

    async finalizarPedido(): Promise<void> {
        console.log('[CheckoutEntregaComponent] cupomDigitado:', this.cupomDigitado);
        console.log('[CheckoutEntregaComponent] descontoAplicado:', this.descontoAplicado);
        console.log('[CheckoutEntregaComponent] dadosEntrega:', this.dadosEntrega);

        const loggedInUserString = localStorage.getItem('loggedInUser');
        let userId: string | null = null;

        if (loggedInUserString) {
            try {
                const user = JSON.parse(loggedInUserString);
                userId = user.id;
            } catch (error) {
                console.error('Erro ao parsear loggedInUser:', error);
                this.snackBar.open('Erro ao obter informações do usuário.', 'Fechar', { duration: 3000 });
                return;
            }
        }

        if (!userId) {
            this.snackBar.open('Você precisa estar logado para finalizar a compra.', 'Fechar', { duration: 3000 });
            this.router.navigate(['/login']);
            return;
        }

        if (this.itensCarrinho.length === 0) {
            this.snackBar.open('Seu carrinho está vazio.', 'Fechar', { duration: 2000 });
            return;
        }

        const itensCompradosIds = this.itensCarrinho.map(car => car.id);

        const novaCompra = {
            id: 'compra_' + Date.now(),
            itensComprados: itensCompradosIds,
            total: this.total,
            dataCompra: new Date().toISOString(),
            usuarioId: userId,
            enderecoEntrega: this.entregaForm.value,
            cupomUsado: this.cupomDigitado,
            valorDesconto: this.descontoAplicado
        };

        console.log('[CheckoutEntregaComponent] Dados da compra a serem enviados:', novaCompra);

        try {
            const responseCompra = await this.apiService.post('compras', novaCompra).toPromise();
            console.log('[CheckoutEntregaComponent] Resposta do POST /compras:', responseCompra);

            // Marcar produtos como vendidos APÓS registrar a compra
            for (const car of this.itensCarrinho) {
                console.log('[CheckoutEntregaComponent] Marcando como vendido:', car.id);
                await this.estoqueService.baixarEstoque(car.id);
            }

            this.pedidoConcluido = true;
            this.etapaAtual = 4;
            this.carrinhoService.limparCarrinho();
            this.snackBar.open('Pedido realizado com sucesso!', 'Fechar', { duration: 3000 });


        } catch (error) {
            console.error('Erro ao finalizar o pedido:', error);
            this.snackBar.open('Erro ao finalizar o pedido. Tente novamente.', 'Fechar', { duration: 3000 });
        }
    }

    copiarParaAreaTransferencia(codigo: string): void {
        this.clipboard.copy(codigo);
        this.snackBar.open('Código Pix copiado para a área de transferência!', 'Fechar', {
            duration: 2000,
        });
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
        const valorTotal = this.total
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

    getDataPedidoFormatada(): string {
        return new Date().toLocaleDateString();
    }

    getHoraPedidoFormatada(): string {
        return new Date().toLocaleTimeString();
    }
}