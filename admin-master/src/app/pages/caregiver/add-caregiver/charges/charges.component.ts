import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../../../@theme/services/validation.service';
import { GlobalService } from '../../../../@theme/services/global.service';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { NbToastrService } from '@nebular/theme';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { ConstantService } from '../../../../@theme/services/constant.service';
import { GetCharges, ChargesObject, InputArray, FinalObjectCharges, ChargesFromAPIObject, TempArrayChargesComponent, AddUpdateChargesObject } from '../../../admin.interface';

@Component({
  selector: 'charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit {
  currentStepFromStorage: String;
  CaregiverChargesForm = new FormGroup({});
  uniqueNumber: number = 0;
  hourlyRateArray: Array<String> = ['1', '2', '3', '4', '5', '6', '7'];
  chargesFromAPI: Array<ChargesFromAPIObject> = [];
  registrationNo: number = 0;
  editMode: boolean = false;
  chargesData: Array<ChargesObject>;
  fb = new FormBuilder();
  currentUrlSection: string = '';
  profileMode: boolean = false;
  callAPI: boolean = true;
  constructor(
    private validationService: ValidationService,
    private router: Router,
    private global: GlobalService,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService,
    private navigationService: NavigationService,
    private constant: ConstantService
  ) {
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.registrationNo = parts[5];
    }
  }
  ngOnInit() {
    this.setChargesForm();
    this.onlinePaymentValidation();
    this.getCharges();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  setChargesObject(data) {
    const { account_name, account_no, bank_code, bank_name, branch_code, charges, fps_mobile_number, payment_method_cheque, payment_method_online } = data;
    const chargesObj = {
      hourly_rate: [],
      fps_mobile_number: '',
      bank_name: '',
      bank_code: '',
      branch_code: '',
      account_no: '',
      account_name: '',
      payment_method_online: false,
      payment_method_cheque: false,
    };
    if (charges.length > 0) {
      this.CaregiverChargesForm.controls.hourly_rate['controls'].map(
        (control, index) => {
          const matched = charges.find(
            element => element.hour === index + 1,
          );
          if (matched) {
            chargesObj.hourly_rate.push(matched);
          } else {
            chargesObj.hourly_rate.push({
              id: '',
              caregiver_id: '',
              hour: index + 1,
              price: '',
            });
          }
        },
      );
    }
    chargesObj.fps_mobile_number = fps_mobile_number;
    chargesObj.bank_name = bank_name;
    chargesObj.bank_code = bank_code;
    chargesObj.branch_code = branch_code;
    chargesObj.account_no = account_no;
    chargesObj.account_name = account_name;
    chargesObj.payment_method_online = Boolean(payment_method_online);
    chargesObj.payment_method_cheque = Boolean(payment_method_cheque);
    return chargesObj;
  }
  getCharges() {
    this.caregiverService
      .getCharges(this.registrationNo)
      .subscribe((returnData: GetCharges) => {
        const { success, data } = returnData;
        if (success) {
          const { charges } = data;
          this.chargesFromAPI = charges;
          const chargesObj = this.setChargesObject(data);
          this.CaregiverChargesForm.patchValue(chargesObj);
          this.chargesData = this.CaregiverChargesForm.value.hourly_rate;
          if (this.chargesData.length !== 0) {
            this.editMode = true;
          }
        }
      });
  }
  onlinePaymentValidation() {
    const fpsMobileNumber = this.CaregiverChargesForm.get('fps_mobile_number');
    const bankName = this.CaregiverChargesForm.get('bank_name');
    const bankCode = this.CaregiverChargesForm.get('bank_code');
    const branchCode = this.CaregiverChargesForm.get('branch_code');
    const accountNo = this.CaregiverChargesForm.get('account_no');
    const accountName = this.CaregiverChargesForm.get('account_name');
    this.CaregiverChargesForm.get(
      'payment_method_online',
    ).valueChanges.subscribe(paymentMethodOnline => {
      if (paymentMethodOnline === true) {
        fpsMobileNumber.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        bankName.setValidators([Validators.required]);
        bankCode.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        branchCode.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        accountNo.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        accountName.setValidators([Validators.required]);
      } else if (paymentMethodOnline === false) {
        this.CaregiverChargesForm.controls['fps_mobile_number'].setValue(null);
        this.CaregiverChargesForm.controls['bank_name'].setValue(null);
        this.CaregiverChargesForm.controls['bank_code'].setValue(null);
        this.CaregiverChargesForm.controls['branch_code'].setValue(null);
        this.CaregiverChargesForm.controls['account_no'].setValue(null);
        this.CaregiverChargesForm.controls['account_name'].setValue(null);
        fpsMobileNumber.setValidators(null);
        bankName.setValidators(null);
        bankCode.setValidators(null);
        branchCode.setValidators(null);
        accountNo.setValidators(null);
        accountName.setValidators(null);
      }
      fpsMobileNumber.updateValueAndValidity();
      bankName.updateValueAndValidity();
      bankCode.updateValueAndValidity();
      branchCode.updateValueAndValidity();
      accountNo.updateValueAndValidity();
      accountName.updateValueAndValidity();
    });
  }
  createHourlyRate(hourlyInput) {
    return this.fb.array(
      hourlyInput.map(i => {
        return this.fb.group({
          hour: i,
          price: '',
          value: '',
          id: '',
        });
      }),
    );
  }
  changeMode(event, i) {
    this.editMode = true;
    const charges = this.CaregiverChargesForm.get('hourly_rate') as FormArray;
    charges.at(i).setValue({
      price: event.target.value,
      hour: charges.controls[i]['controls']['hour']['value'],
      value: charges.controls[i]['controls']['value']['value'],
      id: charges.controls[i]['controls']['id']['value'],
    });
  }
  createChargesArray(chargesArray) {
    this.chargesFromAPI.map((apiResponse: ChargesObject) => {
      const { id, hour } = apiResponse;
      const tempArray: TempArrayChargesComponent = {};
      const matched = this.CaregiverChargesForm.value.hourly_rate.find(
        element => element.hour === hour,
      );
      if (hour < 7) {
        tempArray.id = id;
        tempArray.hour = String(hour);
        tempArray.price = matched.price;
      } else {
        const matchedLastNew = this.CaregiverChargesForm.value.hourly_rate.find(
          element => element.hour === 7,
        );
        tempArray.id = id;
        tempArray.hour = String(hour);
        tempArray.price = matchedLastNew.price;
      }
      chargesArray.push(tempArray);
    });
    this.checkHourlyRate(chargesArray);
    return chargesArray;
  }
  checkHourlyRate(chargesArray) {
    this.CaregiverChargesForm.value.hourly_rate.map(
      (inputArray: InputArray) => {
        const { id, hour, price } = inputArray;
        if (id === '' || id === null) {
          chargesArray.push({
            hour,
            price,
          });
        }
      },
    );
    const matchedLast = this.CaregiverChargesForm.value.hourly_rate.find(
      element => element.hour === '7' || element.hour === 7,
    );
    if (matchedLast && matchedLast !== undefined) {
      for (let i = 8; i < 13; i++) {
        const tempArray: TempArrayChargesComponent = {};
        const filter = this.chargesFromAPI.filter(x => Number(x.hour) === i)[0];
        if (filter && filter !== undefined) {
          tempArray.id = this.chargesFromAPI.filter(x => Number(x.hour) === i)[0].id;
        }
        tempArray.hour = String(i);
        tempArray.price = matchedLast.price;
        chargesArray.push(tempArray);
      }
    }
    chargesArray.map((final: FinalObjectCharges) => {
      if (final.price !== null && final.price !== '') {
        this.CaregiverChargesForm.value.charges.push(final);
      } else {
        if (final.id) {
          this.CaregiverChargesForm.value.deleted_charges.push(final.id);
        }
      }
    });
  }
  eventCheck(fieldId) {
    if (this.CaregiverChargesForm.value.payment_method_cheque === true && this.CaregiverChargesForm.value.payment_method_online === true) {
      (document.getElementById(fieldId) as HTMLInputElement).checked = false;
      if (fieldId === 'cheque') {
        this.CaregiverChargesForm.patchValue({
          payment_method_cheque: false
        });
      } else if (fieldId === 'transfer') {
        this.CaregiverChargesForm.patchValue({
          payment_method_online: false
        });
      }
      this.toastr.danger("", this.constant.CANNOT_ACCEPT);
    }
  }
  setFormValues() {
    let j = 0;
    const { hourly_rate } = this.CaregiverChargesForm.value;
    let { payment_method_cheque, payment_method_online } = this.CaregiverChargesForm.value;
    this.CaregiverChargesForm.value.charges = [];
    this.CaregiverChargesForm.value.deleted_charges = [];
    let chargesArray: Array<ChargesObject> = [];
    chargesArray = this.createChargesArray(chargesArray);
    for (let i = 0; i < 6; i++) {
      if (!hourly_rate[i].price) {
        j++;
        if (j === 6) {
          this.toastr.danger("", this.constant.SINGLE_HOUR_INPUT);
          this.callAPI = false;
          return false;
        }
      }
    }
    if (payment_method_cheque === null && payment_method_online === null) {
      this.toastr.danger("", this.constant.SELECT_PAYMENT_METHOD);
      this.callAPI = false;
      return false;
    } else if (payment_method_cheque === false && payment_method_online === false) {
      this.toastr.danger("", this.constant.SELECT_PAYMENT_METHOD);
      this.callAPI = false;
      return false;
    } else {
      this.callAPI = true;
    }
    if (payment_method_online === null) {
      payment_method_online = false;
    }
    this.onlinePaymentValidation();
    payment_method_online = Number(
      payment_method_online,
    );
    payment_method_cheque = Number(
      payment_method_cheque,
    );
    if (payment_method_cheque === 1 && payment_method_online === 1) {
      this.toastr.danger("", this.constant.CANNOT_ACCEPT);
      this.callAPI = false;
      return false;
    }
  }
  addUpdateCharges() {
    if (!this.CaregiverChargesForm.valid) {
      this.validationService.validateAllFormFields(this.CaregiverChargesForm);
      return false;
    }
    this.setFormValues();
    this.CaregiverChargesForm.value.registration_no = this.registrationNo;
    if (this.callAPI) {
      this.caregiverService
        .addUpdateCharges(this.CaregiverChargesForm.value)
        .subscribe(
          (returnData: AddUpdateChargesObject) => {
            const { success, message } = returnData;
            if (success) {
              this.toastr.success("", message);
              this.navigationService.navigateToAppointment(this.registrationNo);
            }
          },
          err => {
            if (err.status === 400) {
              this.global.errorHandling(err, this.CaregiverChargesForm);
              this.validationService.validateAllFormFields(
                this.CaregiverChargesForm,
              );
            }
          },
        );
    }

  }
  setChargesForm() {
    this.CaregiverChargesForm = new FormGroup({
      hourly_rate: this.createHourlyRate(this.hourlyRateArray),
      payment_method_online: new FormControl(),
      payment_method_cheque: new FormControl(),
      fps_mobile_number: new FormControl('', [
        Validators.maxLength(8),
        Validators.minLength(8),
        this.validationService.onlyNumber,
      ]),
      bank_name: new FormControl('', [Validators.maxLength(50)]),
      bank_code: new FormControl('', [Validators.maxLength(15)]),
      branch_code: new FormControl('', [Validators.maxLength(15)]),
      account_no: new FormControl('', [
        Validators.maxLength(20),
        this.validationService.onlyNumber,
      ]),
      account_name: new FormControl('', [Validators.maxLength(20)]),
    });
  }

}
