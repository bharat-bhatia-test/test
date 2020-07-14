import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { NewCaregiverComponent } from './new-caregiver/new-caregiver.component';

const routes: Routes = [
  {
    path: "",
    component: ListComponent,
    data: {
      title: "Caregiver List",
    },
  },
  {
    path: "list",
    component: ListComponent,
    data: {
      title: "Caregiver List",
    },
  },
  {
    path: "new-caregiver",
    component: NewCaregiverComponent,
    data: {
      title: "Add New Caregiver",
    },
  },
  {
    path: "add-new-caregiver",
    loadChildren: () =>
      import("./add-caregiver/add-caregiver.module").then((m) => m.AddCaregiverModule),
    // canActivateChild: [PageGuard],
  },
  {
    path: "onboard",
    loadChildren: () =>
      import("./add-caregiver/add-caregiver.module").then((m) => m.AddCaregiverModule),
    // canActivateChild: [PageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaregiverRoutingModule { }
