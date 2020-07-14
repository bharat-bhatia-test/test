import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { CaregiverService } from '../../../@theme/services/caregiver.service';
import { NbToastrService } from '@nebular/theme';
import { GlobalService } from '../../../@theme/services/global.service';
import { NavigationService } from '../../../@theme/services/navigation.service';
import { RegistrationData, RegisterByAdminResponseObject } from '../../admin.interface';

@Component({
  selector: 'new-caregiver',
  templateUrl: './new-caregiver.component.html'
})
export class NewCaregiverComponent implements OnInit {
  caregiverRegisterForm: FormGroup;
  score: number = 0;
  constructor(
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private elementReference: ElementRef,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService,
    private globalService: GlobalService,
    private navigationService: NavigationService
  ) { }
  ngOnInit() {
    this.setRegisterForm();
  }
  public setRegisterForm() {
    this.caregiverRegisterForm = this.formBuilder.group(
      {
        email: new FormControl('', [
          Validators.required,
          this.validationService.emailValidator,
        ]),
        password: new FormControl('', [
          Validators.required,
          this.validationService.passwordValidator,
        ]),
        cnfmpassword: new FormControl('', [
          Validators.required,
          this.validationService.passwordValidator,
        ])
      },
      {
        validators: this.validationService.MatchPassword,
      }
    );
  }
  setFocus() {
    for (const key of Object.keys(this.caregiverRegisterForm.controls)) {
      if (this.caregiverRegisterForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        invalidControl.focus();
        break;
      }
    }
  }
  public caregiverRegister() {
    if (!this.caregiverRegisterForm.valid) {
      this.validationService.validateAllFormFields(this.caregiverRegisterForm);
      this.setFocus();
      return false;
    }
    const dataToSend: RegistrationData = {
      email: this.caregiverRegisterForm.value.email,
      password: this.caregiverRegisterForm.value.password,
      user_type: "2", // 2=caregiver,3=client
    };
    this.caregiverService.registerByAdmin(dataToSend).subscribe(
      (returnData: RegisterByAdminResponseObject) => {
        const { success, data, message } = returnData;
        if (success) {
          this.toastr.success("", message);
          this.navigationService.navigateTopersonal(data.registration_no);
        }
      },
      err => {
        this.globalService.errorHandling(err.error, this.caregiverRegisterForm);
      }
    );
  }
  passwordStrength(event) {
    const pass = event.target.value;
    this.score = 0;
    if (pass == null) {
      this.score = -1;
      return this.score;
    }
    if (pass.length < 6) {
      this.score = 1;
      return this.score;
    }
    if (/[0-9]/.test(pass)) {
      this.score++;
    }
    if (/[a-z]/.test(pass)) {
      this.score++;
    }
    if (/[A-Z]/.test(pass)) {
      this.score++;
    }
    return this.score;
  }
}
