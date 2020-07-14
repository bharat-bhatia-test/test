import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationServiceOld {
  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any,
    fieldName?: any
  ) {
    if (!fieldName) {
      fieldName = 'This';
    }
    const config = {
      required: `${fieldName} is required`,
    };
    return config[validatorName];
  }

  // Validate all fields on submit
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
