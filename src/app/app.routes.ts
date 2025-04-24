import { Routes } from '@angular/router';
import { MeuFormularioComponent } from './meu-formulario/meu-formulario.component';
import { HomeComponent } from './components/home/home.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DetalhesComponent } from './components/detalhes/detalhes.component';
import { CheckoutEntregaComponent } from './components/checkout-entrega/checkout-entrega.component';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core'; // Importe 'inject' aqui

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [authGuard]
    },
    {
        path: 'cadastro',
        component: MeuFormularioComponent,
        data: { isRegister: true },
        
    },
    {
        path: 'login',
        component: MeuFormularioComponent,
        data: { isRegister: false },
       
    },
    {
        path: 'carrinho',
        component: CarrinhoComponent,
        canActivate: [authGuard]
    },
    {
        path: 'detalhes/:nome',
        component: DetalhesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'checkout/entrega',
        component: CheckoutEntregaComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

