import { Component, OnInit, TemplateRef } from '@angular/core';
import { OutstandingMatchesAppointmentsService } from '../../../@theme/services/outstanding-matches-appointments.service';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDateService } from '@nebular/theme';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { GlobalService } from '../../../@theme/services/global.service';
import { NavigationService } from '../../../@theme/services/navigation.service';
import Swal from 'sweetalert2';
import { ConfirmAppointmentData, CancelAppointmentData, RefundAppointmentData, BookingDetailsObject, BookingDetailsCaregiverObject, GetBookingDetailsObject, ConfirmBookingByAdminResponseObject, CancelAppointmentResponseObject, RefundAppointmentResponseObject } from '../../admin.interface';

@Component({
  selector: 'appontment-details',
  templateUrl: './appontment-details.component.html',
  styleUrls: ['./appontment-details.component.scss']
})
export class AppontmentDetailsComponent implements OnInit {
  confirmBookingForm: FormGroup;
  bookingId: string = "";
  bookingDetails: BookingDetailsObject;
  showConfirm: boolean = false;
  showDelete: boolean = false;
  showRefund: boolean = false;
  max: Date;
  showSpinners: boolean = false;
  showEditDateOption: boolean = true;
  caregiver_status: Array<string> = ['Awaiting Response', 'Accepted', 'Rejected'];
  constructor(
    private outstandingService: OutstandingMatchesAppointmentsService,
    private router: Router,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private dateService: NbDateService<Date>,
    private validationService: ValidationService,
    private global: GlobalService,
    private navigationService: NavigationService
  ) {
    this.max = this.dateService.addDay(this.dateService.today(), 0);
  }

  ngOnInit() {
    const parts: object = this.router.url.split("/");
    if (parts[4] && parts[4] !== '' || parts[4] !== undefined) {
      this.bookingId = parts[4];
    }
    this.getBookingDetails();
    this.setConfirmBookingForm();
  }
  fireSwal() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.cancelAppointment();
      }
    });
  }
  setConfirmBookingForm() {
    this.confirmBookingForm = this.formBuilder.group({
      payment_date_client: new FormControl('', [Validators.required]),
      payment_date_time: new FormControl('', [Validators.required])
    });
  }
  setData(data) {
    const { end_time, payment_status } = data;
    const currentTime = new Date();
    const bookingEndTime = new Date(end_time);
    if (bookingEndTime < currentTime) {
      this.showEditDateOption = false;
    } else {
      this.showEditDateOption = true;
    }
    if (payment_status === this.global.paymentStatusUnpaid) {
      this.showDelete = true;
    } else if (payment_status === this.global.paymentStatusPaid) {
      this.showRefund = true;
    }
    if (this.bookingDetails.caregiverDetail.length > 0) {
      this.bookingDetails.caregiverDetail.map((caregiver: BookingDetailsCaregiverObject) => {
        const { status } = caregiver;
        if (status === this.global.careGiverStatusConfirmed) {
          this.showConfirm = true;
          this.bookingDetails.acceptedCaregvier = caregiver;
        }
        if (!this.bookingDetails.acceptedCaregvier) {
          this.showConfirm = false;
        }
      });
    }
  }
  getBookingDetails() {
    this.outstandingService.getBookingDetails(this.bookingId).subscribe((returnData: GetBookingDetailsObject) => {
      const { success, data } = returnData;
      if (success) {
        this.bookingDetails = data;
        this.setData(data);
      }
    });
  }
  setDate() {
    const { payment_date_client, payment_date_time } = this.confirmBookingForm.value;
    if (payment_date_client !== '' && payment_date_client !== null) {
      this.confirmBookingForm.value.payment_date_client =
        payment_date_client.year + "-" +
        ('0' + payment_date_client.month).slice(-2) + "-" +
        ('0' + payment_date_client.day).slice(-2) + " " +
        ('0' + payment_date_time.hour).slice(-2) + ":" +
        ('0' + payment_date_time.minute).slice(-2) + ":00";
    }
  }
  confirmAppointment() {
    if (!this.confirmBookingForm.valid) {
      this.validationService.validateAllFormFields(this.confirmBookingForm);
      return false;
    }
    const dataToSend: ConfirmAppointmentData = {
      registration_no: this.bookingDetails.acceptedCaregvier.caregiver.registration_no,
      booking_id: this.bookingId,
      caregiver_booking_details_id: this.bookingDetails.acceptedCaregvier.id,
      payment_date_client: ""
    };
    this.setDate();
    const { payment_date_client } = this.confirmBookingForm.value;
    if (payment_date_client && payment_date_client !== "") {
      dataToSend.payment_date_client = this.confirmBookingForm.value.payment_date_client;
    }
    this.outstandingService.confirmBookingByAdmin(dataToSend).subscribe((returnData: ConfirmBookingByAdminResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        (<HTMLInputElement>document.getElementById("closeButton")).click();
        this.navigationService.navigateToOutstandingMatches();
      }
    }, err => {
      this.toastr.danger("", err.message);
      (<HTMLInputElement>document.getElementById("closeButton")).click();
    });
  }
  cancelAppointment() {
    const dataToSend: CancelAppointmentData = {
      booking_id: this.bookingId
    };
    this.outstandingService.cancelAppointment(dataToSend).subscribe((returnData: CancelAppointmentResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.navigationService.navigateToOutstandingMatches();
        this.toastr.success("", message);
      }
    });
  }
  refundAppointment() {
    const dataToSend: RefundAppointmentData = {
      booking_id: this.bookingId,
      payment_status_caregiver: this.global.paymentStatusCaregiverRefund,
      payment_date_caregiver: ""
    };
    if (this.bookingDetails.payment_date_caregiver) {
      const iso = new Date(this.bookingDetails.payment_date_caregiver).toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
      dataToSend.payment_date_caregiver = iso[1] + ' ' + iso[2];
    }
    this.outstandingService.refundAppointment(dataToSend).subscribe((returnData: RefundAppointmentResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.navigationService.navigateToOutstandingMatches();
        this.toastr.success("", message);
      }
    });
  }
  openPopup(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      {});
  }
}
