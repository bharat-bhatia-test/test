import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule,
  NbUserModule,
  NbActionsModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
} from '@nebular/theme';
import { AddCaregiverRoutingModule } from './add-caregiver-routing.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { SkillsetComponent } from './skillset/skillset.component';
import { AvailabilityComponent } from './availability/availability.component';
import { ChargesComponent } from './charges/charges.component';
import { EmailComponent } from './email/email.component';
import { TermsComponent } from './terms/terms.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReferralComponent } from './referral/referral.component';
import { ControlMessagesModule } from '../../../control-messages/control-messages.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DisableControlDirective } from '../../../@theme/directives/diable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsComponent } from './reviews/reviews.component';

@NgModule({
  declarations: [PersonalInfoComponent, WorkExperienceComponent,
    SkillsetComponent, AvailabilityComponent, ChargesComponent,
    EmailComponent, TermsComponent, LayoutComponent, ReferralComponent, AppointmentsComponent, DisableControlDirective, ReviewsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddCaregiverRoutingModule,
    NbAccordionModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbTabsetModule,
    NbUserModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    ThemeModule,
    ControlMessagesModule,
    NgxDatatableModule,
    NgbModule
  ]
})
export class AddCaregiverModule { }
