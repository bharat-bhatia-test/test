// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
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
  NbUserModule
} from '@nebular/theme';
// Routing
import { ClientRoutingModule } from './client-routing.module';

// Components
import { ListComponent } from './list/list.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    ClientRoutingModule,
    FormsModule, ReactiveFormsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    ThemeModule
  ]
})
export class ClientModule { }
