import { Component, OnInit, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { ValidationService } from '../../../../@theme/services/validation.service';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { GlobalService } from '../../../../@theme/services/global.service';
import { ConstantService } from '../../../../@theme/services/constant.service';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { NbDateService } from '@nebular/theme';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import { DataToSendTempArray, ConstantEducationObject, ConstantCurrentEmployerObject, ConstantPreviousEmployerObject, GetWorkInfoReponseObject, AddUpdateCaregiverWorkInfoObject } from '../../../admin.interface';
interface GetUserPersonalInfoObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    caregiver_type: string;
  };
}
@Component({
  selector: 'work-experience',
  templateUrl: './work-experience.component.html'
})
export class WorkExperienceComponent implements OnInit {
  workInfoForm: FormGroup;
  isRnEn: boolean = true;
  yearsOfExperience: string = '0';
  monthsOfExperience: string = '0';
  showEducationBlock: boolean = false;
  showAnotherPreviousEmployer: boolean = true;
  showAddMoreEducation: boolean = true;
  registeredNumber: string = '';
  currentCaregiverType: string = '';
  deletedEmployer: Array<Number> = [];
  deletedEducation: Array<Number> = [];
  showRemoveEmployer: boolean = true;
  showRemoveEducation: boolean = true;
  currentStepFromStorage: string;
  minDate: object;
  monthsArray: Array<object> = [
    {
      id: 1,
      name: 'January',
    },
    {
      id: 2,
      name: 'February',
    },
    {
      id: 3,
      name: 'March',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'May',
    },
    {
      id: 6,
      name: 'June',
    },
    {
      id: 7,
      name: 'July',
    },
    {
      id: 8,
      name: 'August',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'October',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'December',
    },
  ];
  years = [];
  educationYears = [];
  currentUrlSection: string;
  profileMode: boolean = false;
  moment: any = {};
  constructor(
    private validationService: ValidationService,
    private caregiverService: CaregiverService,
    private router: Router,
    private toastr: NbToastrService,
    private global: GlobalService,
    private formBuilder: FormBuilder,
    private elementReference: ElementRef,
    private constant: ConstantService,
    private navigationService: NavigationService,
    protected dateService: NbDateService<Date>,

  ) {
    this.moment = extendMoment(Moment);
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.registeredNumber = parts[5];
    }
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
  }
  async ngOnInit() {
    await this.setWorkInfoForm();
    this.getUserPersonalInfo();
    this.getWorkInfo();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    // this.minDate = this.dateService.addDay(this.dateService.today(), 0);
    const date = new Date();
    const iterationNUmber = Number(date.getFullYear()) - 1999;
    const iterationEducationNUmber = Number(date.getFullYear()) - 1979;
    this.years = Array(iterationNUmber)
      .fill(1)
      .map((x, i) => i + 2000);
    this.educationYears = Array(iterationEducationNUmber)
      .fill(1)
      .map((x, i) => i + 1980);
  }
  getUserPersonalInfo() {
    this.caregiverService.getUserPersonalInfo(this.registeredNumber).subscribe(
      (returnData: GetUserPersonalInfoObject) => {
        const { success, data } = returnData;
        if (success) {
          const { caregiver_type } = data;
          this.currentCaregiverType = String(caregiver_type);
        } else {
          this.currentCaregiverType = '0';
        }
        if (
          this.currentCaregiverType === '1' ||
          this.currentCaregiverType === '2'
        ) {
          this.isRnEn = true;
          this.workInfoForm.controls['licence_expiry_date'].setValidators([Validators.required]);
          this.workInfoForm.controls['licence_expiry_date'].updateValueAndValidity();
        } else {
          this.isRnEn = false;
          this.workInfoForm.controls['licence_expiry_date'].clearValidators();
          this.workInfoForm.controls['licence_expiry_date'].updateValueAndValidity();
        }
      }
    );
  }
  setProperDates(fromMonth, fromyear, toMonth, toYear, index, years_experience, months_experience) {
    if (fromMonth && fromMonth !== '' && fromyear && fromyear !== '' && toMonth && toMonth !== '' && toYear && toYear !== '') {
      const fromDate = new Date(fromyear, fromMonth - 1, 1);
      const toDate = new Date(toYear, toMonth - 1, 1);
      if (fromDate.getTime() >= toDate.getTime()) {
        this.workInfoForm
          .get('previous_employer_details')
        ['controls'][index].controls.from_month.setErrors({
          serverError: this.constant.FROM_DATE_SMALLER,
        });
      } else {
        // Calculate Experience
        let dy = toDate.getFullYear() - fromDate.getFullYear();
        let dm = toDate.getMonth() - fromDate.getMonth();
        if (dm < 0) {
          dy -= 1;
          dm += 12;
        }
        years_experience.setValue(dy);
        months_experience.setValue(dm);
        this.workInfoForm
          .get('previous_employer_details')
        ['controls'][index].controls.from_month.setErrors(null);
      }
    } else {
      this.workInfoForm
        .get('previous_employer_details')
      ['controls'][index].controls.from_month.setErrors({
        serverError: this.constant.SELECT_FROM_TO,
      });
    }
  }
  checkDateValidation(event, type, index) {
    const fromMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_month.value;
    const fromYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_year.value;
    const toMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_month.value;
    const toYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_year.value;
    const years_experience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.years_experience;
    const months_experience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.months_experience;
    this.setProperDates(fromMonth, fromYear, toMonth, toYear, index, years_experience, months_experience);
  }
  checkEducationDateValidation(event, index) {
    const instituteName = this.workInfoForm.get('education_details')['controls'][index].controls.institute_name.value;
    const startYear = this.workInfoForm.get('education_details')['controls'][index].controls.start_year.value;
    const endYear = this.workInfoForm.get('education_details')['controls'][index].controls.end_year.value;

    if (instituteName && instituteName !== null && instituteName !== '') {
      if (startYear && startYear !== '' && endYear && endYear !== '') {
        if (endYear < startYear) {
          this.workInfoForm
            .get('education_details')
          ['controls'][index].controls.start_year.setErrors({
            serverError: this.constant.FROM_YEAR_SMALLER,
          });
        } else {
          this.workInfoForm
            .get('education_details')
          ['controls'][index].controls.start_year.setErrors(null);
        }
      } else {
        this.workInfoForm
          .get('education_details')
        ['controls'][index].controls.start_year.setErrors({
          serverError: this.constant.SELECT_ALL_YEARS,
        });
      }
    }
  }
  calculateExperience(event, type) {
    const currentEmployerMonth = this.workInfoForm.get('current_employer_month').value;
    const currentEmployerYear = this.workInfoForm.get('current_employer_year').value;
    const currentDate = new Date();
    if (currentEmployerMonth && currentEmployerMonth !== '' && currentEmployerYear && currentEmployerYear !== '') {
      let inputDate: Date;
      if (type === 'year') {
        inputDate = new Date(event, currentEmployerMonth - 1, 1);
      } else if (type === 'month') {
        inputDate = new Date(currentEmployerYear, event - 1, 1);
      }
      let dy = currentDate.getFullYear() - inputDate.getFullYear();
      let dm = currentDate.getMonth() - inputDate.getMonth();
      let dd = currentDate.getDate() - inputDate.getDate();
      if (dd < 0) {
        dm -= 1;
        dd += 30;
      }
      if (dm < 0) {
        dy -= 1;
        dm += 12;
      }
      this.yearsOfExperience = String(dy);
      this.monthsOfExperience = String(dm);
      this.workInfoForm.controls.current_employer_month.setErrors(null);
    } else {
      this.workInfoForm.controls.current_employer_month.setErrors({
        serverError: this.constant.SELECT_MONTH_YEAR,
      });
    }
  }
  getWorkInfo() {
    this.caregiverService.getWorkInfo(this.registeredNumber).subscribe(
      (returnData: GetWorkInfoReponseObject) => {

        const { success, data } = returnData;
        if (success) {
          const { employer, education, show_employer_option, licence_expiry_date } = data[0];
          let { previous_employer_details, current_employer_hospital_name, current_employer_work_type, current_employer_month, current_employer_year, current_employer_id } = data[0];
          if (employer.length === 0) {
            this.showRemoveEmployer = false;
          }
          if (education.length === 0) {
            this.showRemoveEducation = false;
          }
          if (licence_expiry_date) {
            const date = new Date(licence_expiry_date);
            data[0].licence_expiry_date = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
          }
          const object = [];
          previous_employer_details = [];
          employer.map((employeerData) => {
            if (employeerData.is_current_employer === '1') {
              current_employer_hospital_name = employeerData.name;
              current_employer_work_type = employeerData.work_type;
              current_employer_month = employeerData.from_month;
              current_employer_year = employeerData.from_year;
              current_employer_id = employeerData.id;
              data[0].current_employer_hospital_name = employeerData.name;
              data[0].current_employer_work_type = employeerData.work_type;
              data[0].current_employer_month = employeerData.from_month;
              data[0].current_employer_year = employeerData.from_year;
              data[0].current_employer_id = employeerData.id;
              this.setCurrentExperience(current_employer_month, current_employer_year);
            } else {
              employeerData.company_name = employeerData.name;
              object.push(employeerData);
            }
          });
          data[0].show_employer_option = show_employer_option ? show_employer_option : '1';
          this.workInfoForm.patchValue(data[0]);
          const previousEmployerDetails = this.workInfoForm.get(
            'previous_employer_details',
          ) as FormArray;
          object.map((previous, index) => {
            if (index > 0) {
              previousEmployerDetails.push(
                this.createPreviousEmployerDetails(),
              );
            }
          });
          previousEmployerDetails.patchValue(object);
          object.map((previous, index) => {
            this.setPreviousEmployeeExperience(index);
          });
          const educationDetails = this.workInfoForm.get(
            'education_details',
          ) as FormArray;
          education.map((educationDetailsInside, index) => {
            if (index > 0) {
              educationDetails.push(this.createEducationDetails());
            }
          });
          educationDetails.patchValue(education);
        }
      }
    );
  }
  setCurrentExperience(month, year) {
    const currentDate = new Date();
    let inputDate: Date;
    inputDate = new Date(year, month - 1, 1);
    let dy = currentDate.getFullYear() - inputDate.getFullYear();
    let dm = currentDate.getMonth() - inputDate.getMonth();
    let dd = currentDate.getDate() - inputDate.getDate();
    if (dd < 0) {
      dm -= 1;
      dd += 30;
    }
    if (dm < 0) {
      dy -= 1;
      dm += 12;
    }
    this.yearsOfExperience = String(dy);
    this.monthsOfExperience = String(dm);
  }
  setPreviousEmployeeExperience(index) {
    const fromYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_year.value;
    const fromMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_month.value;
    const toYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_year.value;
    const toMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_month.value;
    const yearsExperience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.years_experience;
    const monthsExperience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.months_experience;

    const fromDate = new Date(fromYear, fromMonth - 1, 1);
    const toDate = new Date(toYear, toMonth - 1, 1);
    let dy = toDate.getFullYear() - fromDate.getFullYear();
    let dm = toDate.getMonth() - fromDate.getMonth();
    let dd = toDate.getDate() - fromDate.getDate();

    if (dd < 0) {
      dm -= 1;
      dd += 30;
    }
    if (dm < 0) {
      dy -= 1;
      dm += 12;
    }
    yearsExperience.setValue(dy);
    monthsExperience.setValue(dm);
  }
  addPreviousEmployer() {
    const previousEmployerDetails = this.workInfoForm.get(
      'previous_employer_details',
    ) as FormArray;
    if (previousEmployerDetails.length <= 4) {
      previousEmployerDetails.push(this.createPreviousEmployerDetails());
    } else {
      this.showAnotherPreviousEmployer = false;
    }
    if (previousEmployerDetails.length > 0) {
      this.showRemoveEmployer = true;
    }
  }
  setWorkInfoForm() {
    this.workInfoForm = new FormGroup({
      licence_expiry_date: new FormControl('', []),
      show_employer_option: new FormControl('', [Validators.required]),
      current_employer_hospital_name: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(50),
      ]),
      current_employer_work_type: new FormControl('', []),
      current_employer_month: new FormControl('', []),
      current_employer_year: new FormControl('', []),
      current_employer_id: new FormControl('', []),
      previous_employer_details: this.formBuilder.array([
        this.createPreviousEmployerDetails(),
      ]),
      education_details: this.formBuilder.array([
        this.createEducationDetails(),
      ]),
    });

  }
  createPreviousEmployerDetails(): FormGroup {
    return this.formBuilder.group({
      company_name: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(50),
      ]),
      work_type: new FormControl('', []),
      from_month: new FormControl('', []),
      from_year: new FormControl('', []),
      to_month: new FormControl('', []),
      to_year: new FormControl('', []),
      years_experience: '',
      months_experience: '',
      id: '',
    });
  }
  createEducationDetails(): FormGroup {
    return this.formBuilder.group({
      institute_name: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(50),
      ]),
      degree: new FormControl('', [
        this.validationService.trimValidator,
        Validators.maxLength(50),
      ]),
      start_year: new FormControl('', []),
      end_year: new FormControl('', []),
      id: '',
    });
  }
  setFocus() {
    for (const key of Object.keys(this.workInfoForm.controls)) {
      if (this.workInfoForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }
  setLicenseExpiryDate() {
    // const dateOfBirth = new Date(this.workInfoForm.value.licence_expiry_date);
    // const formatedDated =
    //   dateOfBirth.getFullYear() +
    //   '-' +
    //   ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
    //   '-' +
    //   ('0' + dateOfBirth.getDate()).slice(-2);
    // this.workInfoForm.value.licence_expiry_date = formatedDated;
    const dateOfBirth = new Date(
      this.workInfoForm.value.licence_expiry_date.year,
      this.workInfoForm.value.licence_expiry_date.month - 1,
      this.workInfoForm.value.licence_expiry_date.day,
    );
    const formatedDated =
      dateOfBirth.getFullYear() +
      '-' +
      ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + dateOfBirth.getDate()).slice(-2);
    this.workInfoForm.value.licence_expiry_date = formatedDated;
  }
  setSendingData() {
    const dataToSend: DataToSendTempArray = {
      registration_no: Number(this.registeredNumber),
      caregiver_type: this.currentCaregiverType,
      licence_expiry_date: this.workInfoForm.value.licence_expiry_date,
      show_employer_option: this.workInfoForm.value.show_employer_option,
      employer: [],
    };
    const currentEmployerObject = this.setCurrentEmployer();
    if (currentEmployerObject && currentEmployerObject !== undefined) {
      dataToSend.employer.push(currentEmployerObject);
    }
    this.setPreviousEmployer(dataToSend);
    dataToSend.deleted_employer = this.deletedEmployer;
    dataToSend.deleted_education = this.deletedEducation;
    dataToSend.education = [];
    this.setEducationDetails(dataToSend);
    return dataToSend;
  }
  setEducationDetails(dataToSend) {
    this.workInfoForm.value.education_details.map((education) => {
      if (
        education.degree !== '' &&
        education.end_year !== '' &&
        education.institute_name !== '' &&
        education.start_year !== ''
      ) {
        const educationObject: ConstantEducationObject = {};
        educationObject.institute_name = education.institute_name;
        educationObject.degree = education.degree;
        educationObject.start_year = education.start_year;
        educationObject.end_year = education.end_year;
        if (education.id && education.id > 0) {
          educationObject.id = education.id;
        }
        dataToSend.education.push(educationObject);
      }
    });
  }
  setCurrentEmployer() {
    if (
      this.workInfoForm.value.current_employer_hospital_name !== '' &&
      this.workInfoForm.value.current_employer_month !== '' &&
      this.workInfoForm.value.current_employer_work_type !== '' &&
      this.workInfoForm.value.current_employer_year !== ''
    ) {
      const currentEmployerObject: ConstantCurrentEmployerObject = {
        is_current_employer: String(1),
        name: this.workInfoForm.value.current_employer_hospital_name,
        work_type: this.workInfoForm.value.current_employer_work_type,
        from_month: this.workInfoForm.value.current_employer_month,
        from_year: this.workInfoForm.value.current_employer_year,
      };
      if (this.workInfoForm.value.current_employer_id) {
        currentEmployerObject.id = this.workInfoForm.value.current_employer_id;
      }
      return currentEmployerObject;
    }
  }
  setPreviousEmployer(dataToSend) {
    this.workInfoForm.value.previous_employer_details.map(
      (previous, previousIndex) => {
        if (
          previous.company_name !== '' &&
          previous.from_month !== '' &&
          previous.to_month !== '' &&
          previous.from_year !== '' &&
          previous.to_year !== '' &&
          previous.work_type !== ''
        ) {
          if (previous.to_year < previous.to_year) {
            this.workInfoForm
              .get('previous_employer_details')
            ['controls'][previousIndex].controls.start_year.setErrors({
              serverError: this.constant.SELECT_PROPER_DATES,
            });
          }
          const previousEmployerObject: ConstantPreviousEmployerObject = {
            name: previous.company_name,
            work_type: previous.work_type,
            from_month: previous.from_month,
            from_year: previous.from_year,
            to_month: previous.to_month,
            to_year: previous.to_year,
            is_current_employer: String(0)
          };
          if (previous.id && previous.id > 0) {
            previousEmployerObject.id = previous.id;
          }
          dataToSend.employer.push(previousEmployerObject);
        } else {
          this.workInfoForm
            .get('previous_employer_details')
          ['controls'][previousIndex].controls.from_year.setErrors({
            serverError: this.constant.FILL_ALL,
          });
        }
      },
    );
  }
  checkOverlapping(employer) {
    if (employer && employer !== undefined) {
      const empData = JSON.parse(JSON.stringify(employer));
      const prevEmp = empData.filter((i, idx) => {
        i.tempIdx = idx;
        if (i.from_month && i.from_year) {
          i.from_date = this.moment()
            .year(i.from_year)
            .month(i.from_month - 1)
            .date(1);
        }
        if (i.to_month && i.to_year) {
          i.to_date = this.moment()
            .year(i.to_year)
            .month(i.to_month - 1)
            .date(1);
        } else {
          i.to_date = this.moment().date(1);
        }
        if (i.from_date && i.to_date) {
          i.range = this.moment.range(i.from_date, i.to_date);
        }
        return i;
      });
      const sortedPrevEmp = prevEmp.sort(this.sortDateFn);
      const groupeddata = this.groupByOverlap(sortedPrevEmp);
      return groupeddata;
    }
  }
  sortDateFn(previous, current) {
    const previousTime = previous.from_date
      ? previous.from_date.valueOf()
      : previous.valueOf();
    const currentTime = current.from_date
      ? current.from_date.valueOf()
      : current.valueOf();
    if (previousTime < currentTime) {
      return -1;
    }
    if (previousTime === currentTime) {
      return 0;
    }
    return 1;
  }
  groupByOverlap(prevEmp) {
    let count = 0;
    const groupedData = [];
    while (prevEmp.length) {
      const checkData = prevEmp.slice(1, prevEmp.length);
      const curr = prevEmp[0];
      const group = [curr];
      _.remove(prevEmp, item => curr.tempIdx === item.tempIdx);
      checkData.forEach(item => {
        if (curr.range.overlaps(item.range)) {
          count++;
        }
      });
      groupedData.push(group);
    }
    return count > 0 ? true : false;
  }
  public addWorkInfo() {
    if (!this.workInfoForm.valid) {
      this.validationService.validateAllFormFields(this.workInfoForm);
      this.setFocus();
      return false;
    }
    if (this.workInfoForm.value.licence_expiry_date) {
      this.setLicenseExpiryDate();
    }
    const dataToSend = this.setSendingData();
    const overlap = this.checkOverlapping(dataToSend.employer);
    if (overlap) {
      this.toastr.danger("", this.constant.DATA_OVERLAPPING);
      return false;
    }
    this.caregiverService.addUpdateCaregiverWorkInfo(dataToSend).subscribe(
      (returnData: AddUpdateCaregiverWorkInfoObject) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success("", message);
          this.navigationService.navigateToSkillset(this.registeredNumber);
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.workInfoForm);
          this.validationService.validateAllFormFields(this.workInfoForm);
        }
      },
    );
  }

  addMoreEducation() {
    const educationDetails = this.workInfoForm.get(
      'education_details',
    ) as FormArray;
    if (educationDetails.length <= 4) {
      educationDetails.push(this.createEducationDetails());
    } else {
      this.showAddMoreEducation = false;
    }
    if (educationDetails.length > 0) {
      this.showRemoveEducation = true;
    }
  }
  removePreviousEmployer(index) {
    const previousEmployerDetails = this.workInfoForm.get(
      'previous_employer_details',
    ) as FormArray;
    // Add ID in deleted Employer
    this.deletedEmployer.push(
      this.workInfoForm.get('previous_employer_details')['controls'][index]
        .controls.id.value,
    );
    // Remove from formarray
    previousEmployerDetails.removeAt(index);
  }
  removeEducation(index) {
    const educationDetails = this.workInfoForm.get(
      'education_details',
    ) as FormArray;
    // Add ID in deleted Education
    this.deletedEducation.push(
      this.workInfoForm.get('education_details')['controls'][index].controls.id
        .value,
    );
    // Remove from formarray
    educationDetails.removeAt(index);
  }
}
