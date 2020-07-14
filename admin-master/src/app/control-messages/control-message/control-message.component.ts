import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../@theme/services/validation.service';

@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
})
export class ControlMessageComponent implements OnInit {
  @Input() control: FormControl;
  @Input() fieldName: string;
  constructor() {}

  ngOnInit(): void {}
  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        if (propertyName === 'serverError') {
          return this.control.errors[propertyName];
        }
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName],
          this.fieldName
        );
      }
    }

    return null;
  }
}
