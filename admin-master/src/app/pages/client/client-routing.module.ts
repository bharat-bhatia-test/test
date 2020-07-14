import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {
      title: 'Client List',
    },
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: 'Client List',
    }
  },
  {
    path: "client-view-details/:id",
    loadChildren: () =>
      import("./view-details/view-details.module").then((m) => m.ViewDetailsModule),
    // canActivateChild: [PageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
