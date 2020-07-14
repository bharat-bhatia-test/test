import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { CommonService } from "../../@theme/services/common.service";
import { ValidationService } from "../../@theme/services/validation.service";
import { LoginResponse } from "../../pages/admin.interface";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService
  ) {}
  ngOnInit() {
    this.setLoginForm();
  }
  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, this.validationService.passwordValidator],
      ],
      user_type: ["1", []],
    });
  }
  onSubmit() {
    if (!this.loginForm.valid) {
      this.validationService.validateAllFormFields(this.loginForm);
      return false;
    }
    this.commonService.login(this.loginForm.value).subscribe(
      (response: LoginResponse) => {
        const { success, data } = response;
        if (success) {
          const {
            accessToken: { token },
            user_id,
          } = data;
          window.localStorage["token"] = token;
          window.localStorage["user_id"] = user_id;
          this.commonService.goToHome();
        }
        this.loginForm.reset();
      },
      (error) => {
        if (error.error.status === 400) {
          this.commonService.errorHandling(error.error, this.loginForm);
        }
      }
    );
  }
}
