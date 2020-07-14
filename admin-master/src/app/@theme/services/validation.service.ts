import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any,
    fieldName?: any,
  ) {
    if (!fieldName) {
      fieldName = 'This';
    }
    const config = {
      required: `${fieldName} is required`,
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidPassword:
        'Invalid password. Password must be 6 characters long, at least 1 capital character, at least 1 numeric character',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      min: `Minimum length ${validatorValue.min}`,
      max: `Maximum length ${validatorValue.max}`,
      equalTo: `Confirm password not matching`,
      invalidUrl: `Invalid website url`,
      invalidPattern: `${fieldName} is Invalid`,
      fieldRequired: `GST/CIN/Portfolio required`,
      docfieldRequired: `GST/CIN/PAN required`,
      invalidNumber: `Please enter valid number`,
      // invalidNumber: `Only Positive Numbers are allowed`,
      invalidTime: `Please enter hour between 0 to 12`,
      whitespace: `Whitespaces are not allowed`,
      invalidWordCount: `Only 50 words are allowed`,
      invalidChar: `Only Characters are allowed`,
      invalidHeight: `Invalid height`,
      mobileFormat: `Invalid mobile number`,
      invalidFees: `Please enter fees % below 30`,
      invalidClientFees: `Please enter fees % below 20`
    };

    return config[validatorName];
  }
  trimValidator(control) {
    if (control.value && control.value !== null) {
      control.value = String(control.value);
      if (control.value.startsWith(' ')) {
        return { whitespace: true };
      }
    }
    return null;
  }

  emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        return null;
      } else {
        return { invalidEmailAddress: true };
      }
    } else {
      return null;
    }
  }

  // ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$
  // ^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$

  passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value) {
      if (
        control.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,}$/)
      ) {
        return null;
      } else {
        return { invalidPassword: true };
      }
    }
  }

  urlValidator(control) {
    if (control.value) {
      if (control.value.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)) {
        return null;
      } else {
        return { invalidUrl: true };
      }
    }
  }

  alphaNumericValidator(control) {
    if (control.value) {
      if (control.value.match(/^[a-z A-Z0-9_]*$/)) {
        return null;
      } else {
        return { invalidPattern: true };
      }
    }
  }
  wordCountValidator(control) {
    if (control.value) {
      if (control.value.split(' ').length <= 50) {
        return null;
      } else {
        return { invalidWordCount: true };
      }
    }
  }

  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('cnfmpassword').value; // to get value in input tag
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        AC.get('cnfmpassword').setErrors({ equalTo: true });
      } else {
        AC.get('cnfmpassword').setErrors(null);
      }
    }
  }

  mobileNumber(control) {
    if (control.value) {
      if (control.value.split('').length === 8) {
        return null;
      } else {
        return { mobileFormat: true };
      }
    }
  }

  // ^[1-9]+[0-9]*$
  // (^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)

  onlyNumber(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,10}(\.\d{0,2})?$/)) {
        return null;
      } else {
        return { invalidNumber: true };
      }
    }
  }
  onlyNumberTime(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,10}(\.\d{0,2})?$/)) {
        if (control.value <= 12) {
          return null;
        } else {
          return { invalidTime: true };
        }
      } else {
        return { invalidNumber: true };
      }
    }
  }
  heightValidation(control) {
    if (control.value) {
      if (control.value.toString().match(/^[0-9]+\.([ ]?[0-9]{1,2}[\"]?|)$/)) {
        return null;
      } else {
        return { invalidHeight: true };
      }
    }
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

  // Validate all fields on submit for formarray
  validateAllFormArrayFields(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((field: any) => {
      Object.values(field.controls).forEach((subField: any) => {
        Object.keys(subField.controls).forEach(innerField => {
          const control = subField.get(innerField);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
        });
      });
    });
  }

  onlyChars(control) {
    if (control.value) {
      if (
        control.value
          .toString()
          .match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
      ) {
        return null;
      } else {
        return { invalidChar: true };
      }
    }
  }
  checkServiceFees(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,10}(\.\d{0,2})?$/)) {
        if (control.value <= 30) {
          return null;
        } else {
          return { invalidFees: true };
        }
      } else {
        return { invalidNumber: true };
      }
    }
  }
  checkClientServiceFees(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,10}(\.\d{0,2})?$/)) {
        if (control.value <= 20) {
          return null;
        } else {
          return { invalidClientFees: true };
        }
      } else {
        return { invalidNumber: true };
      }
    }
  }
}
