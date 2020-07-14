import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { NbToastrService } from '@nebular/theme';
import { GlobalService } from '../../../@theme/services/global.service';
import { CaregiverService } from '../../../@theme/services/caregiver.service';
import { ChangePasswordSendingData, AdminChangePasswordResponse } from '../../admin.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  adminUserId: string = "";
  constructor(
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private toastr: NbToastrService,
    private globalService: GlobalService,
    private elementReference: ElementRef,
    private caregiverService: CaregiverService,
    private router: Router
  ) {
    this.adminUserId = localStorage.getItem("user_id");
  }

  ngOnInit() {
    this.setChangePasswordForm();
  }
  setChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group(
      {
        old_password: new FormControl('', [
          Validators.required,
          this.validationService.passwordValidator,
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
    for (const key of Object.keys(this.changePasswordForm.controls)) {
      if (this.changePasswordForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        invalidControl.focus();
        break;
      }
    }
  }
  public submitChangePassword() {
    if (!this.changePasswordForm.valid) {
      this.validationService.validateAllFormFields(this.changePasswordForm);
      this.setFocus();
      return false;
    }
    const dataToSend: ChangePasswordSendingData = {
      user_type: "1", // As we are changing the User name and Password of Admin (1==> Admin, 2==> Caregiver, 3==> Client)
      id: this.adminUserId,
      old_password: this.changePasswordForm.value.old_password,
      password: this.changePasswordForm.value.password,
    };
    this.caregiverService.changePassword(dataToSend).subscribe(
      (returnData: AdminChangePasswordResponse) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success("", message);
          setTimeout(() => {
            localStorage.clear();
            this.router.navigate(["/"]);
          }, 2000);
        }
      },
      err => {
        this.globalService.errorHandling(err.error, this.changePasswordForm);
      }
    );
  }
}
