import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ClientService } from '../../../../@theme/services/client.service';
import { NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';
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
  showUpcomingTable: boolean = true;
  paymentStatusArray: Array<string> = ["To be paid", "Paid", "Cancelled", "Refund"];
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
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
      slug: [""],
      appointment: [""],
      upcomingStatus: [""]
    });
  }
  setPastAppointmentsForm() {
    this.appointmentsForm = this.formBuilder.group({
      slug: [""],
      appointment: [""],
      pendingStatus: [""]
    });
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
  setData(recordPerPage, totalRecords, pages, currentPage, data) {
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
      this.showUpcomingTable = true;
    } else {
      this.showUpcomingTable = false;
    }
    let page: number = 0;
    if (pageInfo["offset"] !== undefined) {
      page = pageInfo["offset"] + 1;
    } else if (pageInfo["page"] !== undefined) {
      page = pageInfo["page"];
    }
    this.appointmentsForm.value.slug = localStorage.getItem('slug');
    this.appointmentsForm.value.pageNumber = page;
    this.clientService.appointmentsFormSubmit(this.appointmentsForm.value).subscribe((returnData: AppointmentsFormSubmitResponse) => {
      const { success, data, message } = returnData;
      if (success) {
        const { recordPerPage, totalRecords, pages, currentPage } = data;
        this.setData(recordPerPage, totalRecords, pages, currentPage, data);
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  cancelBooking(row) {
    const dataToSend: CancelAppointmentData = {
      booking_id: row.booking_id
    };
    this.clientService.cancelBooking(dataToSend).subscribe((returnData: CancelBookingResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        this.onInitList({ offset: 0 });
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  fireSwal(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.cancelBooking(data);
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
}
