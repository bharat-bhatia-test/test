import { Component, OnInit, ElementRef } from '@angular/core';
import { SystemSettingsService } from '../../../@theme/services/system-settings.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidationService } from '../../../@theme/services/validation.service';
import { NbToastrService } from '@nebular/theme';
import { GetSystemSettings, SettingsData, AddUpdateSystemSettingsResposneData } from '../../admin.interface';

@Component({
  selector: 'system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  systemData: Array<SettingsData> = [];
  systemForm: FormGroup;
  settings: Array<{ title: string, values: number }> = [];

  constructor(
    private systemSettingsService: SystemSettingsService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private toastr: NbToastrService,
    private elementReference: ElementRef
  ) { }

  ngOnInit() {
    this.getSystemSettings();
    this.setSystemForm();
  }
  getSystemSettings() {
    this.systemSettingsService.getSystemSettings().subscribe((returnData: GetSystemSettings) => {
      const { success, data } = returnData;
      if (success) {
        this.systemData = data;
        const temparray: any = {};
        this.systemData.map(function (formName) {
          temparray[`${formName.title}`] = formName.value;
        });
        this.systemForm.patchValue(temparray);
      }
    });
  }
  onSubmit() {
    if (!this.systemForm.valid) {
      this.validationService.validateAllFormFields(this.systemForm);
      return false;
    }
    const dataToSend = {
      settings: {}
    };
    for (let i = 0; i <= 4; i++) {
      const obj: any = {};
      obj.title = Object.keys(this.systemForm.value)[i];
      obj.value = Object.values(this.systemForm.value)[i];
      this.settings.push(obj);
    }
    dataToSend.settings = this.settings;
    if (!this.systemForm.valid) {
      this.validationService.validateAllFormFields(this.systemForm);
      for (const key of Object.keys(this.systemForm.controls)) {
        if (this.systemForm.controls[key].invalid) {
          const invalidControl = this.elementReference.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]',
          );
          invalidControl.focus();
          break;
        }
      }
      return false;
    }
    this.systemSettingsService.addUpdateSystemSettings(dataToSend).subscribe((returnData: AddUpdateSystemSettingsResposneData) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }

  setSystemForm() {
    this.systemForm = this.formBuilder.group({
      caregiver_service_fee: ["", [
        Validators.required,
        this.validationService.onlyNumber,
        this.validationService.checkServiceFees]],
      client_service_fee: ["", [Validators.required, this.validationService.onlyNumber,
      this.validationService.checkClientServiceFees]],
      caregiver_referral: [{ value: 100, disabled: false }, [Validators.required, this.validationService.onlyNumber]],
      sort_by_exp: ["", Validators.required],
      sort_by_rating: ["", Validators.required]
    });
  }
}
