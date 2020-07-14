import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ValidationService } from '../../../../@theme/services/validation.service';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { GlobalService } from '../../../../@theme/services/global.service';
import { NbDateService } from '@nebular/theme';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { GetAccountUserInfo, LanguageCheckedObject, AccountUser, TempArrayLanguageChecked, DataToSendPersonalINfo, AddUpdateCaregiverInfoObject } from '../../../admin.interface';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html'
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;
  maxDate: object = {};
  profileMode: boolean = true;
  fb = new FormBuilder();
  caregiverRegistrationNumber: string = "";
  personalInfoObject: AccountUser;
  showOtherLanguageOption: boolean = false;
  otherLanguageName: FormControl;
  languageArray: object = [
    { value: 1, name: 'Cantonese', selected: false },
    { value: 2, name: 'English', selected: false },
    { value: 3, name: 'Mandarin', selected: false },
    { value: 4, name: 'Others', selected: false },
  ];
  caregiverType: object = [
    { id: "1", name: 'RN' },
    { id: "2", name: 'EN' },
    { id: "3", name: 'HW' },
    { id: "4", name: 'PCW' },
    { id: "5", name: 'Out-patient Escort' }
  ];
  valueChinese: string = '1';
  valueEnglish: string = '2';
  max: Date;
  enableReferral: boolean = false;
  constructor(
    private validationService: ValidationService,
    private caregiverService: CaregiverService,
    private router: Router,
    private toastr: NbToastrService,
    protected dateService: NbDateService<Date>,
    private global: GlobalService,
    private navigationService: NavigationService) {
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.caregiverRegistrationNumber = parts[5];
    }
    this.max = this.dateService.addDay(this.dateService.today(), 0);
  }
  ngOnInit() {
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.setPersonalInfoForm();
    this.getUserPersonalInfo();
  }
  getUserPersonalInfo() {
    this.caregiverService.getUserPersonalInfo(this.caregiverRegistrationNumber).subscribe(
      (returnData: GetAccountUserInfo) => {
        const { success, data } = returnData;
        if (success) {
          const { user: { salute, mobile_number, email, preferred_communication_language, dob }, user_id, registration_no, caregiver_type, current_step, languages } = data;
          data.caregiver_type = caregiver_type ? caregiver_type : '1';
          data.preferred_communication_language = preferred_communication_language ? preferred_communication_language : '1';
          data.salute = salute;
          data.email = email;
          data.mobile_number = mobile_number;
          data.dob = dob ? new Date(dob) : null;
          this.personalInfoForm.patchValue(data);
          this.personalInfoForm.patchValue({
            language: this.prefillLanguageSelection(
              this.personalInfoForm.get('language').value,
              languages,
            ),
          });
          this.personalInfoObject = data;
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('registration_no', String(registration_no));
          if (current_step !== null) {
            this.enableReferral = false;
          } else {
            this.enableReferral = true;
          }

        }
      }
    );
  }
  showOthers() {
    this.personalInfoForm.controls.language.value.map(
      (languageChecked: LanguageCheckedObject, index) => {
        if (index === 3 && languageChecked.selected === true) {
          this.showOtherLanguageOption = true;
          if (
            !this.personalInfoForm.controls.otherLanguageName &&
            this.personalInfoForm.controls.otherLanguageName === undefined
          ) {
            this.otherLanguageName = new FormControl('', [
              Validators.required,
              this.validationService.trimValidator,
              Validators.maxLength(30),
            ]);
            this.personalInfoForm.addControl(
              'otherLanguageName',
              this.otherLanguageName,
            );
            this.personalInfoForm
              .get('otherLanguageName')
              .updateValueAndValidity();
          }
        } else if (index === 3 && languageChecked.selected === false) {
          this.showOtherLanguageOption = false;
          this.personalInfoForm.removeControl('otherLanguageName');
        }
      },
    );
  }
  prefillLanguageSelection(languages, selectedLanguages) {
    return languages.map(i => {
      const data = selectedLanguages.filter(
        x => Number(x.language) === Number(i.value),
      )[0];

      if (data) {
        i.selected = true;
        if (i.value === 4) {
          this.showOtherLanguageOption = true;
          this.otherLanguageName = new FormControl('', [
            Validators.required,
            this.validationService.trimValidator,
            Validators.maxLength(30),
          ]);
          this.personalInfoForm.addControl(
            'otherLanguageName',
            this.otherLanguageName,
          );
          this.personalInfoForm
            .get('otherLanguageName')
            .updateValueAndValidity();
          this.personalInfoForm.patchValue({
            otherLanguageName: data.other_lang,
          });
        }
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  setPersonalInfoForm() {
    this.personalInfoForm = new FormGroup({
      salute: new FormControl('', [Validators.required]),
      chinese_name: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(30),
      ]),
      english_name: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(30),
        this.validationService.alphaNumericValidator,
      ]),
      nick_name: new FormControl('', [
        Validators.required,
        this.validationService.trimValidator,
        Validators.maxLength(20)
      ]),
      email: new FormControl('', [
        this.validationService.trimValidator,
        Validators.required,
        this.validationService.emailValidator,
      ]),
      hkid_card_no: new FormControl('', [
        this.validationService.trimValidator,
        this.validationService.alphaNumericValidator,
        Validators.maxLength(8),
      ]),
      dob: new FormControl('', [Validators.required]),
      language: this.createLanguages(this.languageArray),
      caregiver_type: new FormControl('', [Validators.required]),
      mobile_number: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(8),
        Validators.minLength(8),
        this.validationService.onlyNumber,
      ]),
      refferers_email: new FormControl({ value: '', disabled: true }, [
        this.validationService.trimValidator,
        this.validationService.emailValidator,
      ]),
      preferred_communication_language: new FormControl('', [
        Validators.required,
      ]),
    });
    this.personalInfoForm.patchValue({
      preferred_communication_language: "1"
    });
  }
  createLanguages(languageInputs) {
    return this.fb.array(
      languageInputs.map(i => {
        return this.fb.group({
          name: i.name,
          selected: i.selected,
          value: i.value,
        });
      }),
    );
  }
  setBirthDate() {
    if (this.personalInfoForm.value.dob) {
      const dateOfBirth = new Date(this.personalInfoForm.value.dob);
      const formatedDated =
        dateOfBirth.getFullYear() +
        '-' +
        ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateOfBirth.getDate()).slice(-2);
      this.personalInfoForm.value.dob = formatedDated;
    } else {
      this.personalInfoForm.value.dob = "";
    }
  }
  makeSelectedLanguage(languageSelected) {
    this.personalInfoForm.value.language.map((language: LanguageCheckedObject, index) => {
      if (language.selected === true) {
        const tempArray: TempArrayLanguageChecked = {};
        tempArray.language = language.value;
        if (index === 3) {
          tempArray.other_lang = this.personalInfoForm.value.otherLanguageName;
        }
        languageSelected.push(tempArray);
      }
    });
  }
  public addPersonalInfo() {
    if (!this.personalInfoForm.valid) {
      this.validationService.validateAllFormFields(this.personalInfoForm);
      return false;
    }
    this.setBirthDate();
    const languageSelected: Array<LanguageCheckedObject> = [];
    this.makeSelectedLanguage(languageSelected);
    this.personalInfoForm.value.languages = languageSelected;
    this.personalInfoForm.value.registration_no = this.caregiverRegistrationNumber;
    let dataToSend: DataToSendPersonalINfo = {};
    dataToSend = this.personalInfoForm.value;
    if (
      dataToSend.refferers_email === '' ||
      dataToSend.refferers_email === null
    ) {
      delete dataToSend.refferers_email;
    }
    dataToSend.caregiver_type = String(dataToSend.caregiver_type);
    this.caregiverService.addUpdateCaregiverInfo(dataToSend).subscribe(
      (returnData: AddUpdateCaregiverInfoObject) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success("", message);
          this.navigationService.navigateToWork(this.caregiverRegistrationNumber);
        }
      },
      err => {
        if (err.error.error.status === 400) {
          this.global.errorHandling(err.error, this.personalInfoForm);
          this.validationService.validateAllFormFields(this.personalInfoForm);
        }
      },
    );
  }
}
