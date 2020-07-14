import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CaregiverRoutingModule } from './caregiver-routing.module';
import { ListComponent } from './list/list.component';
import { NewCaregiverComponent } from './new-caregiver/new-caregiver.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfileViewResolver } from './profile-view.resolver';

@NgModule({
  declarations: [ListComponent, NewCaregiverComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NgxDatatableModule,
    CaregiverRoutingModule,
    ThemeModule
  ],
  providers: [ProfileViewResolver]
})
export class CaregiverModule { }
