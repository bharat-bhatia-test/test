import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { ValidationService } from '../../../../@theme/services/validation.service';
import { NbToastrService } from '@nebular/theme';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ConstantService } from '../../../../@theme/services/constant.service';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { GetLocationList, AvailabilityObject, GetAvailability, Jobject, MainLocationObject, SubGroupObject, TempArrayAvailabilityComponent, ResultObjectReturnData, UpdateAvailabilityObject } from '../../../admin.interface';

@Component({
  selector: 'availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
  availabiltyForm: FormGroup;
  locationList: Array<any> = [];
  fb = new FormBuilder();
  registeredNumber: string = '';
  deletedAvailability: Array<Number> = [];
  moment: any = {};
  daysArray: Array<object> = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];
  days: Array<object> = [
    { day: 'Sunday', date: '1999-01-03' },
    { day: 'Monday', date: '1999-01-04' },
    { day: 'Tuesday', date: '1999-01-05' },
    { day: 'Wednesday', date: '1999-01-06' },
    { day: 'Thursday', date: '1999-01-07' },
    { day: 'Friday', date: '1999-01-08' },
    { day: 'Saturday', date: '1999-01-09' },
  ];
  currentUrlSection: string = '';
  profileMode: boolean = false;
  callAPI: boolean = true;
  constructor(
    private caregiverService: CaregiverService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: NbToastrService,
    private constant: ConstantService,
    private navigationService: NavigationService
  ) {
    this.moment = extendMoment(Moment);
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.registeredNumber = parts[5];
    }
  }
  ngOnInit() {
    const urlParts: object = this.router.url.split('/');
    if (urlParts[2]) {
      this.currentUrlSection = urlParts[2];
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
      localStorage.setItem('caregiverOnBoardCompleted', '1');
    } else {
      this.profileMode = false;
      localStorage.setItem('caregiverOnBoardCompleted', '0');
    }
    this.setAvailabilityForm();
    this.getLocationList();
    setTimeout(() => {
      this.getAvailability();
    }, 1000);
  }
  setAvailabilityForm() {
    this.availabiltyForm = new FormGroup({
      availability_details: this.formBuilder.array([
        this.createAvailabilityDetails(),
      ]),
      locations: new FormArray([]),
    });
  }
  createAvailabilityDetails(): FormGroup {
    return this.formBuilder.group({
      from_day: new FormControl('', [Validators.required]),
      to_day: new FormControl('', []),
      from_time: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumberTime,
      ]),
      to_time: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumberTime,
      ]),
      from_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
      to_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
      id: '',
    });
  }
  getLocationList() {
    this.caregiverService.getLocationList().subscribe(
      (returnData: GetLocationList) => {
        const { success, data } = returnData;
        if (success) {
          this.locationList = data;
          this.availabiltyForm.setControl(
            'locations',
            this.createLocations(this.locationList),
          );
        } else {
          this.locationList = [];
        }
      },
      err => {
        this.locationList = [];
      },
    );
  }
  createLocations(locationListInput) {
    return this.fb.array(
      locationListInput.map(i => {
        return this.fb.group({
          name: i.name,
          id: i.id,
          subGroup: this.createSubLocation(i.subLocations),
        });
      }),
    );
  }
  createSubLocation(subLocation) {
    return this.fb.array(
      subLocation.map(i => {
        return this.fb.group({
          name: i.name,
          selected: false,
          id: i.id,
          parent_id: i.parent_id,
        });
      }),
    );
  }
  refactorAvailability(object, availabilityDetails) {
    object.map((availability: AvailabilityObject, index) => {
      if (availability.from_time === '12:00') {
        availability.from_meridian = 'PM';
        availability.from_time = 12;
      } else {
        availability.from_meridian = this.moment(availability.from_time, 'HH:mm').format('A');
        availability.from_time = this.moment(availability.from_time, 'HH:mm').format('h');
      }
      if (availability.to_time === '23:59') {
        availability.to_meridian = 'AM';
        availability.to_time = 12;
      } else {
        availability.to_meridian = this.moment(availability.to_time, 'HH:mm').format('A');
        availability.to_time = this.moment(availability.to_time, 'HH:mm').format('h');
      }
      if (index > 0) {
        availabilityDetails.push(this.createAvailabilityDetails());
      }
    });
  }
  getAvailability() {
    this.caregiverService.getAvailability(this.registeredNumber).subscribe(
      (returnData: GetAvailability) => {
        const { success, data } = returnData;
        if (success) {
          const availabilityDetails = this.availabiltyForm.get('availability_details') as FormArray;
          if (data.availability.length > 0) {
            this.refactorAvailability(data.availability, availabilityDetails);
          } else {
            data.availability = [];
          }
          availabilityDetails.patchValue(data.availability);
          this.availabiltyForm.patchValue({
            locations: this.prefillLocationSelection(
              this.availabiltyForm.get('locations').value,
              data.locations,
            ),
          });
        }
      }
    );
  }
  removeAvailability(index: number) {
    const availabilityDetails = this.availabiltyForm.get(
      'availability_details',
    ) as FormArray;
    // Add ID in deleted Availability
    this.deletedAvailability.push(
      this.availabiltyForm.get('availability_details')['controls'][index]
        .controls.id.value,
    );
    // Remove from formarray
    availabilityDetails.removeAt(index);
  }
  addAvailabilityOptions() {
    const availabilityDetails = this.availabiltyForm.get(
      'availability_details',
    ) as FormArray;
    availabilityDetails.push(this.createAvailabilityDetails());
  }
  prefillLocationSelection(location, selectedLocations) {
    return location.map(i => {
      if (i.subGroup.length > 0) {
        i.subGroup.map((j: Jobject) => {
          const data = selectedLocations.filter(
            x => Number(x.id) === Number(j.id),
          )[0];
          if (data) {
            j.selected = true;
          } else {
            j.selected = false;
          }
          return j;
        });
      }
      return i;
    });
  }
  checkConflictAvailability(e, day, days) {
    let resDataObj = {
      success: true,
      message: null,
    };
    for (let i = e.from_day; i <= e.to_day; i++) {
      const fromDayDb = this.moment(`${days[i].date} ${e.from_time}`);
      const toDayDb = this.moment(`${days[i].date} ${e.to_time}`);
      const range1 = this.moment.range(fromDayDb, toDayDb);
      for (let j = day.from_day; j <= day.to_day; j++) {
        const fromDayUser = this.moment(`${days[j].date} ${day.from_time}`);
        const toDayUser = this.moment(`${days[j].date} ${day.to_time}`);
        const range2 = this.moment.range(fromDayUser, toDayUser);
        if (range1.overlaps(range2)) {
          resDataObj = {
            success: false,
            message: `Conflicting availability for ${days[e.from_day].day} to ${
              days[e.to_day].day
              } hours`,
          };
        }
      }
    }
    return resDataObj;
  }
  validateAvailabilityEntries() {
    for (const [index, e] of this.availabiltyForm.value.availability_details.entries()) {
      if (Number(e.from_time) === 0) {
        this.callAPI = false;
        this.toastr.danger("", this.constant.HOURS_ERROR);
        return false;
      }
      e.from_day = Number(e.from_day);
      e.to_day = Number(e.from_day); // Since we have removed the to day from our system
      // Check for days conflict
      if (e.from_day > e.to_day) {
        this.callAPI = false;
        this.toastr.danger(this.constant.GREATER_DAY);
        break;
      }
      const checkDay = this.availabiltyForm.value.availability_details.filter(
        (cd, i) => {
          cd.from_day = Number(cd.from_day);
          cd.to_day = Number(cd.to_day);
          return i !== index;
        },
      );
      if (checkDay.length) {
        const results = [];
        for (const day of checkDay) {
          results.push(this.checkConflictAvailability(e, day, this.days));
        }
        if (results.length > 0) {
          results.map((resultData: ResultObjectReturnData) => {
            const { success, message } = resultData;
            if (success === false) {
              this.callAPI = false;
              this.toastr.danger("", message);
              return false;
            }
          });
        }
      }
      this.checkStartEndTime(e);
    }
    for (const [index, e] of this.availabiltyForm.value.availability_details.entries()) {
      e.from_day = String(e.from_day);
      e.to_day = String(e.to_day);
      e.index = index;
    }
  }
  checkStartEndTime(e) {
    let startTimeProper: number;
    let endTimeProper: number;
    if (e.from_meridian === 'PM') {
      if (e.to_time === '12' || e.to_time === 12) {
        startTimeProper = 12;
      } else {
        startTimeProper = Number(Number(e.from_time) + 12);
      }
    } else {
      if (e.from_time === '12' || e.from_time === 12) {
        startTimeProper = 0;
      } else {
        startTimeProper = Number(e.from_time);
      }
    }
    if (e.to_meridian === 'PM') {
      if (e.to_time === '12' || e.to_time === 12) {
        endTimeProper = 12;
      } else {
        endTimeProper = Number(Number(e.to_time) + 12);
      }
    } else {
      if (e.to_time === '12' || e.to_time === 12) {
        endTimeProper = 24;
      } else {
        endTimeProper = Number(e.to_time);
      }
    }
    if (startTimeProper >= endTimeProper) {
      this.callAPI = false;
      this.toastr.danger("", this.constant.FROM_TIME);
      return false;
    }
  }
  setLocation(dataToSend) {
    this.availabiltyForm.value.locations.map((mainLocation: MainLocationObject) => {
      if (mainLocation.subGroup.length > 0) {
        mainLocation.subGroup.map((subLocation: SubGroupObject) => {
          if (subLocation.selected === true) {
            dataToSend.locations.push(subLocation.id);
          }
        });
      }
    });
  }
  setAvailabilityMap(dataToSend) {
    this.availabiltyForm.value.availability_details.map(
      (availability: AvailabilityObject) => {
        const { from_time, from_meridian, to_time, to_meridian, from_day, to_day, id } = availability;
        const tempArray: TempArrayAvailabilityComponent = {};
        tempArray.from_day = from_day;
        tempArray.to_day = to_day;
        if (from_meridian === 'AM') {
          if (from_time === 12 || from_time === '12') {
            tempArray.from_time = '00:00';
          } else {
            tempArray.from_time = ('0' + from_time).slice(-2) + ':00';
          }
        } else if (from_meridian === 'PM') {
          if (from_time === 12 || from_time === '12') {
            tempArray.from_time = '12:00';
          } else {
            tempArray.from_time = String(Number(('0' + from_time).slice(-2)) + 12) + ':00';
          }
        }
        if (to_meridian === 'AM') {
          if (to_time === 12 || to_time === '12') {
            tempArray.to_time = '23:59';
          } else {
            tempArray.to_time = ('0' + to_time).slice(-2) + ':00';
          }
        } else if (to_meridian === 'PM') {
          if (to_time === 12 || to_time === '12') {
            tempArray.to_time = '12:00';
          } else {
            tempArray.to_time = String(Number(('0' + to_time).slice(-2)) + 12) + ':00';
          }
        }
        if (id) {
          tempArray.id = id;
        }
        dataToSend.availability.push(tempArray);
      },
    );
  }
  setDataToSend() {
    this.availabiltyForm.value.to_day = this.availabiltyForm.value.from_day;
    const dataToSend = {
      registration_no: this.registeredNumber,
      deleted_availability: [],
      locations: [],
      availability: [],
    };
    if (this.availabiltyForm.value.locations.length > 0) {
      this.setLocation(dataToSend);
    }
    if (this.availabiltyForm.value.availability_details.length > 0) {
      this.setAvailabilityMap(dataToSend);
    }
    dataToSend.deleted_availability = this.deletedAvailability;
    return dataToSend;
  }
  public addAvailability() {
    if (!this.availabiltyForm.valid) {
      this.validationService.validateAllFormArrayFields(this.availabiltyForm);
      return false;
    }
    this.validateAvailabilityEntries();
    if (this.callAPI) {
      const dataToSend = this.setDataToSend();
      if (dataToSend.locations.length > 5) {
        this.toastr.danger("", this.constant.MAX_LOCATIONS);
        return false;
      }
      this.caregiverService.addUpdateAvailability(dataToSend).subscribe(
        (returnData: UpdateAvailabilityObject) => {
          const { success, message } = returnData;
          if (success) {
            this.toastr.success("", message);
            this.navigationService.navigateToCharges(this.registeredNumber);
          }
        },
        err => {
          if (err.status === 400) {
            err.data.map((errorData) => {
              const { message } = errorData;
              this.toastr.danger("", message);
            });
          }
        },
      );
    }
  }
}
