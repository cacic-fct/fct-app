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
    loadComponent: () => import('./development-tools/development-tools.page').then((m) => m.DevelopmentToolsPage),
    canActivate: [DevelopmentOnlyGuard],
  },
  // General routes
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'sobre',
    data: { preload: true },
    title: 'Sobre',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'privacidade',
    data: { preload: true },
    title: 'Política de privacidade',
    loadComponent: () => import('./about/privacy-policy/privacy-policy.page').then((m) => m.PrivacyPolicyPage),
  },
  {
    path: 'privacy',
    redirectTo: 'privacidade',
    pathMatch: 'full',
  },
  {
    path: 'privacy-policy',
    redirectTo: 'privacidade',
    pathMatch: 'full',
  },
  {
    path: 'politica-de-privacidade',
    redirectTo: 'privacidade',
    pathMatch: 'full',
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
    loadComponent: () => import('./about/licenses/licenses.page').then((m) => m.LicensesPage),
  },
  {
    path: 'manual-do-calouro',
    title: 'Manual do Calouro',
    loadComponent: () => import('src/app/freshmen/manual/manual.page').then((m) => m.ManualPage),
  },
  {
    path: 'calouros',
    title: 'Página dos calouros',
    loadComponent: () => import('src/app/freshmen/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  // Unused route
  // {
  //   path: 'scan',
  //   title: 'Escanear',
  //   loadComponent: () =>
  //     import('./page-qr-scanner-public/page-qr-scanner.page').then((m) => m.PageQrScannerPage),
  //   ...canActivate(redirectUnauthorizedToLogin),
  // },
  {
    path: 'login',
    loadComponent: () => import('src/app/auth/login/login.page').then((m) => m.LoginPage),
    ...canActivate(redirectLoggedInToMenu),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () => import('src/app/auth/register/register.page').then((m) => m.RegisterPage),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'perfil',
    title: 'Perfil',
    data: { preload: true },
    loadComponent: () => import('src/app/profile/profile-info/profile-info.page').then((m) => m.ProfileInfoPage),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'entidades',
    title: 'Entidades estudantis',
    loadComponent: () =>
      import('src/app/freshmen/student-organizations/student-organizations.page').then(
        (m) => m.StudentOrganizationsPage
      ),
  },
  {
    path: 'eventos/inscrever/:eventID',
    title: 'Inscrição',
    loadComponent: () =>
      import('src/app/tabs/major-events-display/subscribe/subscribe.page').then((m) => m.SubscribePage),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'inscricoes',
    title: 'Minhas participações',
    loadComponent: () => import('src/app/profile/my-attendances/my-attendances.page').then((m) => m.MyAttendancesPage),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'confirmar-presenca/:eventID',
    title: 'Confirmar presença em um evento',
    loadComponent: () =>
      import('src/app/modals/confirm-attendance/confirm-attendance').then((m) => m.ConfirmAttendancePage),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'certificado/verificar/:param',
    loadComponent: () =>
      import('./validate-certificate/validate-certificate.page').then((m) => m.ValidateCertificatePage),
  },
  // Redirect not found routes (404) to index
  // Must be the last route
  {
    path: '**',
    redirectTo: '',
  },
];
