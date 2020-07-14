import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AppontmentDetailsComponent } from './appontment-details/appontment-details.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {
      title: 'Outstanding Match List',
    },
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: 'Outstanding Match List',
    }
  },
  {
    path: 'details/:id',
    component: AppontmentDetailsComponent,
    data: {
      title: 'Appontment Details',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutstandingMatchesAppointmentsRoutingModule { }
