import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompletedMatchesRoutingModule } from './completed-matches-routing.module';
import { ListComponent } from './list/list.component';
import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CompletedMatchesDetailsComponent } from './completed-matches-details/completed-matches-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ListComponent, CompletedMatchesDetailsComponent],
  imports: [
    CommonModule,
    CompletedMatchesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NgxDatatableModule,
    NgbModule
  ]
})
export class CompletedMatchesModule { }
