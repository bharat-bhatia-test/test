import { Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '../../../../../node_modules/@swimlane/ngx-datatable/esm5/public-api';
import { OutstandingMatchesAppointmentsService } from '../../../@theme/services/outstanding-matches-appointments.service';
import { NbToastrService } from '@nebular/theme';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { ConstantService } from '../../../@theme/services/constant.service';
import { GlobalService } from '../../../@theme/services/global.service';
import { LocationObject, AppointmentObject, LocationWithSub, DataToSendListComponent, GetOutstandingMatchAppointmentListObject } from '../../admin.interface';


@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  outStandingMatchSearchForm: FormGroup;
  dataToSend: DataToSendListComponent = {};
  size: number = 0;
  pageNumber: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  SelectionType: SelectionType;
  ColumnMode: ColumnMode;
  caregiver_status: Array<string> = ['Awaiting Response', 'Accepted', 'All Rejected'];
  appointmentsList: Array<AppointmentObject> = [];
  locationsList: Array<LocationObject> = [];
  constructor(
    private outstandingService: OutstandingMatchesAppointmentsService,
    private toastr: NbToastrService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private constant: ConstantService,
    private global: GlobalService
  ) {
    this.pageNumber = 0;
    this.size = 10;
  }

  async  ngOnInit() {
    this.setSearchForm();
    await this.getLocations();
    this.setPage({ offset: 0 });
  }
  async getLocations() {
    const response = await this.outstandingService.getLocationsList().toPromise();
    const { success, data } = response;
    if (success) {
      if (data.length > 0) {
        data.map((location: LocationWithSub) => {
          if (location.subLocations.length > 0) {
            location.subLocations.map((finalLocation: LocationObject) => {
              this.locationsList.push(finalLocation);
            });
          }
        });
      }
    }
  }
  setSearchForm() {
    this.outStandingMatchSearchForm = this.formBuilder.group({
      date_range: new FormControl('', []),
      start_time: new FormControl('', []),
      end_time: new FormControl('', []),
      caregiver_type: new FormControl('', []),
      caregiver_accepted: new FormControl('', []),
      caregiver_not_accepted: new FormControl('', []),
      is_accepted_by_caregiver: new FormControl('', []),
      mobile_number: ['', [
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
      ]],
      email: ['', [this.validationService.emailValidator]],
    });
  }
  clearFilter() {
    this.outStandingMatchSearchForm.reset();
    this.outStandingMatchSearchForm.patchValue({
      is_accepted_by_caregiver: ""
    });
    this.dataToSend = {};
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  outStandingMatchSearch() {
    if (!this.outStandingMatchSearchForm.valid) {
      this.validationService.validateAllFormFields(this.outStandingMatchSearchForm);
      return false;
    }
    const { email, mobile_number, start_time, end_time, caregiver_accepted, is_accepted_by_caregiver } = this.outStandingMatchSearchForm.value;
    if (email) {
      this.dataToSend.email = email;
    }
    if (mobile_number) {
      this.dataToSend.mobile_number = mobile_number;
    }
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    if (endTime.getTime() < startTime.getTime()) {
      this.toastr.danger("", this.constant.TO_DATE_GREATER);
      return false;
    }
    if (start_time) {
      const startTimeNew = new Date(start_time);
      startTimeNew.setDate(startTimeNew.getDate() + 1);
      this.dataToSend.start_time = startTimeNew.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/).slice(0, 10)[1];
    }
    if (end_time) {
      const endTimeNew = new Date(end_time);
      endTimeNew.setDate(endTimeNew.getDate() + 1);
      this.dataToSend.end_time = endTimeNew.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/).slice(0, 10)[1];
    }
    if (caregiver_accepted) {
      this.dataToSend.caregiver_status = caregiver_accepted;
    } else {
      delete this.dataToSend.caregiver_status;
    }
    this.dataToSend.isAcceptedByCaregiver = "";
    if (is_accepted_by_caregiver) {
      this.dataToSend.isAcceptedByCaregiver = is_accepted_by_caregiver;
    }
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  setData(dataFromAPI) {
    this.size = dataFromAPI.recordPerPage;
    this.totalElements = dataFromAPI.totalRecords;
    this.totalPages = dataFromAPI.pages;
    this.pageNumber = dataFromAPI.currentPage - 1;
    this.appointmentsList = dataFromAPI.data;
    if (this.appointmentsList.length > 0) {
      this.appointmentsList.map((appointment: AppointmentObject) => {
        appointment.statusToShow = "Awaiting Response";
        appointment.locationName = "";
        if (appointment.client.service_user_district) {
          appointment.locationName = this.locationsList.filter(x => x.id = Number(appointment.client.service_user_district))[0].name;
        }
        appointment.showConfirm = false;
        const appointmentRejected: Array<number> = [];
        if (appointment.caregiverDetail.length > 0) {
          appointment.caregiverDetail.map((caregiverDetails) => {
            if (caregiverDetails.status === this.global.bookingStatusRejected) {
              appointmentRejected.push(caregiverDetails.id);
            }
            if (caregiverDetails.status === this.global.bookingStatusAccepted) {
              appointment.showConfirm = true;
              appointment.statusToShow = "Accepted";
            }
          });
        }
        if (appointmentRejected.length === appointment.caregiverDetail.length) {
          appointment.statusToShow = "All Rejected";
        }
      });
    }
  }
  setPage(pageInfo) {
    let page: number = 0;
    if (pageInfo["offset"] !== undefined) {
      page = pageInfo["offset"] + 1;
    } else if (pageInfo["page"] !== undefined) {
      page = pageInfo["page"];
    }
    this.dataToSend.pageNumber = page;
    this.dataToSend.recordPerPage = this.size;
    this.outstandingService.getOutstandingMatchAppointmentList(this.dataToSend).subscribe((returnData: GetOutstandingMatchAppointmentListObject) => {
      const { success, data, message } = returnData;
      if (success) {
        this.setData(data);
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
}
