import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { NbToastrService } from '@nebular/theme';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { AppointmentObject, CancelAppointmentData, AppointmentDataObject, AppointmentsFormSubmitResponse, CancelBookingResponseObject } from '../../../admin.interface';

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointmentsForm: FormGroup;
  appointmentList: Array<AppointmentObject> = [];
  size: number = 0;
  pageNumber: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  data: AppointmentDataObject;
  showUpcoming: boolean = true;
  showCancel: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService
  ) { }

  ngOnInit() {
    this.setUpcomingAppointmentsForm();
    this.data.appointment = "upcoming";
    this.data.upcomingStatus = "pending";
    this.appointmentsForm.patchValue(this.data);
    this.onInitList({ offset: 0 });
  }
  setUpcomingAppointmentsForm() {
    this.appointmentsForm = this.formBuilder.group({
      registration_no: [""],
      appointment: [""],
      upcomingStatus: [""]
    });
  }
  setPastAppointmentsForm() {
    this.appointmentsForm = this.formBuilder.group({
      registration_no: [""],
      appointment: [""],
      pendingStatus: [""]
    });
  }
  setData(data) {
    const { recordPerPage, totalRecords, pages, currentPage } = data;
    this.size = recordPerPage;
    this.totalElements = totalRecords;
    this.totalPages = pages;
    this.pageNumber = currentPage - 1;
    this.appointmentList = data.data;

    if (this.appointmentList.length > 0) {
      this.appointmentList.map(e => {
        e.status = this.getStatus(e.status);
      });
    }
  }
  onInitList(pageInfo) {
    if (this.showUpcoming === true) {
      this.showCancel = true;
    } else {
      this.showCancel = false;
    }
    let page: number = 0;
    if (pageInfo["offset"] !== undefined) {
      page = pageInfo["offset"] + 1;
    } else if (pageInfo["page"] !== undefined) {
      page = pageInfo["page"];
    }
    this.appointmentsForm.value.registration_no = Number(localStorage.getItem('registration_no'));
    this.appointmentsForm.value.pageNumber = page;
    this.caregiverService.appointmentsFormSubmit(this.appointmentsForm.value).subscribe((returnData: AppointmentsFormSubmitResponse) => {
      const { success, data, message } = returnData;
      if (success) {
        this.setData(data);
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  cancelBooking(row) {
    const dataToSend: CancelAppointmentData = {
      booking_id: row.booking_id
    };
    this.caregiverService.cancelBooking(dataToSend).subscribe((returnData: CancelBookingResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        this.onInitList({ offset: 0 });
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  upcomingOrPending(status) {
    this.showUpcoming = status;
    if (status === true) {
      this.setUpcomingAppointmentsForm();
    } else if (status === false) {
      this.setPastAppointmentsForm();
    }
  }
  getStatus(status) {
    switch (status) {
      case '1':
        return 'To be paid';
      case '2':
        return 'Paid';
      case '3':
        return 'Cancelled';
      case '4':
        return 'Refund';
    }
  }
}
