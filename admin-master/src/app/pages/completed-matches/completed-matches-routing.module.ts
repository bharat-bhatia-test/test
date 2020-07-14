import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CompletedMatchesDetailsComponent } from './completed-matches-details/completed-matches-details.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {
      title: 'Completed Match List',
    },
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: 'Completed Match List',
    }
  },
  {
    path: 'details/:id',
    component: CompletedMatchesDetailsComponent,
    data: {
      title: 'Completed Match Details',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompletedMatchesRoutingModule { }
