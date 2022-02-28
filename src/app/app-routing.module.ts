import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'calendario/evento/:id',
    loadChildren: () =>
      import('./page-calendar-event/page-calendar-event.module').then(
        (m) => m.PageCalendarEventPageModule
      ),
  },
  {
    path: 'calendar-list',
    loadChildren: () => import('./calendar-list/calendar-list.module').then( m => m.CalendarListPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
