import { Routes } from '@angular/router';
import { MeuFormularioComponent } from './meu-formulario/meu-formulario.component';
import { HomeComponent } from './components/home/home.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DetalhesComponent } from './components/detalhes/detalhes.component';
import { CheckoutEntregaComponent } from './components/checkout-entrega/checkout-entrega.component'; // Importe o CheckoutEntregaComponent

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'cadastro',
    component: MeuFormularioComponent,
    data: { isRegister: true }
  },
  {
    path: 'login',
    component: MeuFormularioComponent,
    data: { isRegister: false }
  },
  {
    path: 'carrinho',
    component: CarrinhoComponent
  },
  {
    path: 'detalhes/:nome',
    component: DetalhesComponent
  },
  {
    path: 'checkout/entrega',
    component: CheckoutEntregaComponent // Adicione a rota para o CheckoutEntregaComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];