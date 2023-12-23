import { RouterModule, Routes } from '@angular/router';
import { PageManageEvents } from './manage-events.page';

export const routes: Routes = [
  {
    path: '',
    component: PageManageEvents,
  },
  {
    path: 'listar-inscritos/:eventID',
    title: 'Listar inscritos',
    loadComponent: () =>
      import('src/app/restricted-area/manage-events/list-subscriptions/list-subscriptions.page').then(
        (m) => m.ListSubscriptionsPage
      ),
  },
  {
    path: 'listar-presencas/:eventID',
    title: 'Listar presenças',
    loadComponent: () =>
      import('src/app/restricted-area/manage-events/list-attendances/list.page').then((m) => m.ListPage),
  },
  {
    path: 'coletar-presencas/:eventID',
    title: 'Coletar presenças',
    loadComponent: () =>
      import('src/app/restricted-area/manage-events/attendance-scanner/scanner.page').then((m) => m.ScannerPage),
  },
  {
    path: 'adicionar',
    title: 'Adicionar evento',
    loadComponent: () => import('./add-event/add-event.page').then((m) => m.AddEventPage),
  },
];
