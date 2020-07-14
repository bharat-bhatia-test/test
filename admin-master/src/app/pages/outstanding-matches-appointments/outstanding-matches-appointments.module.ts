import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { OutstandingMatchesAppointmentsRoutingModule } from './outstanding-matches-appointments-routing.module';
import { ListComponent } from './list/list.component';
import { AppontmentDetailsComponent } from './appontment-details/appontment-details.component';
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
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ListComponent, AppontmentDetailsComponent],
  imports: [
    CommonModule,
    OutstandingMatchesAppointmentsRoutingModule,
    NgxDatatableModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class OutstandingMatchesAppointmentsModule { }
