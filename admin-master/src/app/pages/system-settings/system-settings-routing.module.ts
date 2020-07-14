import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemSettingsComponent } from './system-settings/system-settings.component';


const routes: Routes = [
  {
    path: '',
    component: SystemSettingsComponent,
    data: {
      title: 'System Settings',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
