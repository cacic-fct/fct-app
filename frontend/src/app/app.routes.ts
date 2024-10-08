import { canActivate } from '@angular/fire/compat/auth-guard';
import { Routes } from '@angular/router';

import {
  DevelopmentOnlyGuard,
  redirectUnauthorizedToLogin,
  redirectLoggedInToMenu,
} from './shared/services/routing/guards.service';

export const routes: Routes = [
  // Development environment only
  {
    path: 'development-tools',
    loadChildren: () => import('./development-tools/development-tools.routes').then((m) => m.routes),
    canActivate: [DevelopmentOnlyGuard],
  },
  // Redirects
  {
    path: 'privacidade',
    redirectTo: 'redirecionamento/privacy-policy',
    pathMatch: 'full',
  },
  {
    path: 'privacy',
    redirectTo: 'redirecionamento/privacy-policy',
    pathMatch: 'full',
  },
  {
    path: 'privacy-policy',
    redirectTo: 'redirecionamento/privacy-policy',
    pathMatch: 'full',
  },
  {
    path: 'politica-de-privacidade',
    redirectTo: 'redirecionamento/privacy-policy',
    pathMatch: 'full',
  },
  {
    path: 'docs',
    redirectTo: 'redirecionamento/docs',
    pathMatch: 'full',
  },
  {
    path: 'sobre',
    redirectTo: 'ajustes/geral/sobre',
    pathMatch: 'full',
  },
  {
    path: 'about',
    redirectTo: 'ajustes/geral/sobre',
    pathMatch: 'full',
  },
  {
    path: 'humans.txt',
    redirectTo: 'ajustes/geral/sobre',
    pathMatch: 'full',
  },
  {
    path: 'login',
    // No preceding slash to preserve query params
    // https://github.com/angular/angular/issues/13315#issuecomment-427254639
    redirectTo: 'entrar',
    pathMatch: 'full',
  },
  {
    path: 'licenses',
    redirectTo: 'ajustes/legal/licencas',
    pathMatch: 'full',
  },
  // General routes
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'entrar',
    title: 'Entrar',
    loadComponent: () => import('src/app/auth/login/login.page').then((m) => m.LoginPage),
    ...canActivate(redirectLoggedInToMenu),
  },
  {
    path: 'perfil',
    title: 'Perfil',
    data: { preload: true },
    loadChildren: () => import('src/app/profile/profile.routes').then((m) => m.routes),
    // TODO: Commented out until we fix data being overwritten
    // ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'eventos/inscrever/:eventID',
    title: 'Inscrição',
    loadChildren: () => import('src/app/tabs/major-events-display/subscribe/subscribe.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'inscricoes',
    title: 'Minhas participações',
    loadChildren: () => import('src/app/profile/my-attendances/my-attendances.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'confirmar-presenca/:eventID',
    title: 'Confirmar presença',
    loadChildren: () => import('src/app/modals/confirm-attendance/confirm-attendance.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'certificado/verificar/:param',
    loadChildren: () => import('./validate-certificate/validate-certificate.routes').then((m) => m.routes),
  },
  {
    path: 'ajustes',
    title: 'Ajustes',
    loadChildren: () => import('./settings/settings.routes').then((m) => m.routes),
  },
  {
    path: 'comissoes',
    title: 'Comissões',
    loadComponent: () => import('./student-area/committees/committees.page').then((m) => m.CommitteesPage),
  },
  {
    path: 'redirecionamento/:id',
    title: 'Redirecionamento',
    loadComponent: () => import('./redirects/redirects.page').then((m) => m.RedirectsPage),
  },
  // Redirect not found routes (404) to index
  // Must be the last route
  {
    path: '**',
    redirectTo: '',
  },
];
