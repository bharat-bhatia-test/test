import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PersonalInfoComponent } from "./personal-info/personal-info.component";
import { WorkExperienceComponent } from "./work-experience/work-experience.component";
import { SkillsetComponent } from "./skillset/skillset.component";
import { AvailabilityComponent } from "./availability/availability.component";
import { ChargesComponent } from "./charges/charges.component";
import { EmailComponent } from "./email/email.component";
import { TermsComponent } from "./terms/terms.component";
import { LayoutComponent } from "./layout/layout.component";
import { ReferralComponent } from "./referral/referral.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { ProfileViewResolver } from "../profile-view.resolver";
import { ReviewsComponent } from "./reviews/reviews.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: PersonalInfoComponent,
        data: {
          title: "Caregiver Info",
        },
      },
      {
        path: "personal-info",
        component: PersonalInfoComponent,
        data: {
          title: "Caregiver Info",
        },
      },
      {
        path: "personal-info/:id",
        component: PersonalInfoComponent,
        data: {
          title: "Caregiver Info",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "work-experience",
        component: WorkExperienceComponent,
        data: {
          title: "Caregiver Work Experience",
        },
      },
      {
        path: "work-experience/:id",
        component: WorkExperienceComponent,
        data: {
          title: "Caregiver Work Experience",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "skillset",
        component: SkillsetComponent,
        data: {
          title: "Caregiver Skills",
        },
      },
      {
        path: "skillset/:id",
        component: SkillsetComponent,
        data: {
          title: "Caregiver Skills",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "availability",
        component: AvailabilityComponent,
        data: {
          title: "Caregiver Availability",
        },
      },
      {
        path: "availability/:id",
        component: AvailabilityComponent,
        data: {
          title: "Caregiver Availability",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "charges",
        component: ChargesComponent,
        data: {
          title: "Caregiver Charges",
        },
      },
      {
        path: "charges/:id",
        component: ChargesComponent,
        data: {
          title: "Caregiver Charges",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "email",
        component: EmailComponent,
        data: {
          title: "Caregiver Email",
        },
      },
      {
        path: "email/:id",
        component: EmailComponent,
        data: {
          title: "Caregiver Email",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "terms",
        component: TermsComponent,
        data: {
          title: "Caregiver Terms and Conditions",
        },
      },
      {
        path: "terms/:id",
        component: TermsComponent,
        data: {
          title: "Caregiver Terms and Conditions",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "referral/:id",
        component: ReferralComponent,
        data: {
          title: "Caregiver Referral",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "appointments/:id",
        component: AppointmentsComponent,
        data: {
          title: "Caregiver Referral",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: "reviews/:id",
        component: ReviewsComponent,
        data: {
          title: "Caregiver Reviews",
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCaregiverRoutingModule {}
