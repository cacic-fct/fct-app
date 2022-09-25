import { NgModule } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { PreloadingStrategyService } from './shared/services/preloading-strategy.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['menu']);

const routes: Routes = [
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'sobre',
    data: { preload: true },
    title: 'Sobre',
    loadChildren: () => import('./page-about/page-about.module').then((m) => m.PageAboutPageModule),
  },
  {
    path: 'about',
    redirectTo: 'sobre',
    pathMatch: 'full',
  },
  {
    path: 'humans.txt',
    redirectTo: 'sobre',
    pathMatch: 'full',
  },
  {
    path: 'licenses',
    redirectTo: 'sobre/licencas',
    pathMatch: 'full',
  },
  {
    path: 'sobre/licencas',
    title: 'Licenças',
    loadChildren: () => import('./page-about/page-licenses/page-licenses.module').then((m) => m.PageLegalPageModule),
  },
  {
    path: 'manual-do-calouro',
    title: 'Manual do Calouro',
    loadChildren: () =>
      import('./page-manual-calouro/page-manual-calouro.module').then((m) => m.PageManualCalouroPageModule),
  },
  {
    path: 'calouros',
    title: 'Página dos calouros',
    loadChildren: () => import('./page-calouros/page-calouros.module').then((m) => m.PageCalourosPageModule),
  },
  {
    path: 'scan',
    title: 'Escanear',
    loadChildren: () =>
      import('./page-qr-scanner-public/page-qr-scanner.module').then((m) => m.PageQrScannerPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'register',
    title: 'Registro',
    loadChildren: () => import('./page-register/page-register.module').then((m) => m.PageRegisterPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'profile',
    title: 'Perfil',
    data: { preload: true },
    loadChildren: () => import('./page-profile/page-profile.module').then((m) => m.PageProfilePageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'entidades',
    title: 'Entidades estudantis',
    loadChildren: () => import('./page-contact-cas/page-contact-cas.module').then((m) => m.PageContactCasPageModule),
  },
  {
    path: 'eventos/inscrever/:id',
    title: 'Inscrição',
    loadChildren: () => import('./page-subscription/page-subscription.module').then((m) => m.PageSubscriptionPageModule),
  },
  {
    path: 'eventos/confirmar-inscricao',
    title: 'Confirme sua inscrição',
    loadChildren: () => import('./page-subscription/page-confirm-subscription/page-confirm-subscription.module').then((m) => m.PageConfirmSubscriptionPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadingStrategyService })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
