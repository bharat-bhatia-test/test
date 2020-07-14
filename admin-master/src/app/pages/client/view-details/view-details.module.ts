import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDetailsRoutingModule } from './view-details-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { PersonalInfoAcntUserComponent } from './personal-info-acnt-user/personal-info-acnt-user.component';
import { PersonalInfoCareReceiverComponent } from './personal-info-care-receiver/personal-info-care-receiver.component';
import { CareReceiverBackgroundComponent } from './care-receiver-background/care-receiver-background.component';
import { CareReceiverMedicalHistoryComponent } from './care-receiver-medical-history/care-receiver-medical-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesModule } from '../../../control-messages/control-messages.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
  NbRouteTabsetModule
} from '@nebular/theme';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReferralBonusComponent } from './referral-bonus/referral-bonus.component';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [LayoutComponent, PersonalInfoAcntUserComponent,
    PersonalInfoCareReceiverComponent, CareReceiverBackgroundComponent,
    CareReceiverMedicalHistoryComponent,
    AppointmentsComponent,
    ReferralBonusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewDetailsRoutingModule,
    ControlMessagesModule,
    NbActionsModule,
    NbButtonModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NgxDatatableModule,
    ThemeModule
  ]
})
export class ViewDetailsModule { }
