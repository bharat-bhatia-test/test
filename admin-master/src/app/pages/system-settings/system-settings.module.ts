import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesModule } from '../../control-messages/control-messages.module';


@NgModule({
  declarations: [SystemSettingsComponent],
  imports: [
    CommonModule,
    SystemSettingsRoutingModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    ControlMessagesModule,
    NbUserModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class SystemSettingsModule { }
