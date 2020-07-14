import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PagesComponent } from "./pages.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        redirectTo: "client",
        pathMatch: "full",
      },
      {
        path: "client",
        loadChildren: () =>
          import("./client/client.module").then((m) => m.ClientModule),
        // canActivateChild: [PageGuard],
      },
      {
        path: "caregiver",
        loadChildren: () =>
          import("./caregiver/caregiver.module").then((m) => m.CaregiverModule),
        // canActivateChild: [PageGuard],
      },
      {
        path: "system-settings",
        loadChildren: () =>
          import("./system-settings/system-settings.module").then((m) => m.SystemSettingsModule),
        // canActivateChild: [PageGuard],
      },
      {
        path: "outstanding-matches",
        loadChildren: () =>
          import("./outstanding-matches-appointments/outstanding-matches-appointments.module").
            then((m) => m.OutstandingMatchesAppointmentsModule),
        // canActivateChild: [PageGuard],
      },
      {
        path: "completed-matches",
        loadChildren: () =>
          import("./completed-matches/completed-matches.module").
            then((m) => m.CompletedMatchesModule),
        // canActivateChild: [PageGuard],
      },
      {
        path: "password",
        loadChildren: () =>
          import("./password/password.module").
            then((m) => m.PasswordModule),
        // canActivateChild: [PageGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
