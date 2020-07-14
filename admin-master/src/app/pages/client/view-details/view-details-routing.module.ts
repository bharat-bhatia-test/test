import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PersonalInfoAcntUserComponent } from './personal-info-acnt-user/personal-info-acnt-user.component';
import { PersonalInfoCareReceiverComponent } from './personal-info-care-receiver/personal-info-care-receiver.component';
import { CareReceiverBackgroundComponent } from './care-receiver-background/care-receiver-background.component';
import { CareReceiverMedicalHistoryComponent } from './care-receiver-medical-history/care-receiver-medical-history.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReferralBonusComponent } from './referral-bonus/referral-bonus.component';


const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: PersonalInfoAcntUserComponent,
        data: {
          title: "Personal Info of Account User",
        },
      },
      {
        path: "account-user-personal-info",
        component: PersonalInfoAcntUserComponent,
        data: {
          title: "Personal Info of Account User",
        },
      },
      {
        path: "care-receiver-personal-info",
        component: PersonalInfoCareReceiverComponent,
        data: {
          title: "Personal Info of Care Receiver",
        },
      },
      {
        path: "care-receiver-background",
        component: CareReceiverBackgroundComponent,
        data: {
          title: "Care Receiver Background",
        },
      },
      {
        path: "care-receiver-medical-history",
        component: CareReceiverMedicalHistoryComponent,
        data: {
          title: "Care Receiver Medical History",
        },
      },
      {
        path: "appointments",
        component: AppointmentsComponent,
        data: {
          title: "Upcoming and Past Appointments",
        },
      },
      {
        path: "referral-bonus",
        component: ReferralBonusComponent,
        data: {
          title: "Referral Bonus",
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewDetailsRoutingModule { }
