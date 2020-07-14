import { Component, OnInit, TemplateRef } from '@angular/core';
import { OutstandingMatchesAppointmentsService } from '../../../@theme/services/outstanding-matches-appointments.service';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { GlobalService } from '../../../@theme/services/global.service';
import { NavigationService } from '../../../@theme/services/navigation.service';
import { BookingDetailsObject, CancelAppointmentData, RefundAppointmentData, DateClientPayment, BookingDetailsCaregiverObject, COmpletedMatchesDataToSend, CancelAppointmentResposneObject, RefundAppointmentRsposneObject, ClientPaymentResponseObject, ChangeBookingTimeResponseObject } from '../../admin.interface';

@Component({
  selector: 'completed-matches-details',
  templateUrl: './completed-matches-details.component.html'
})
export class CompletedMatchesDetailsComponent implements OnInit {
  bookingId: string = "";
  bookingDetails: BookingDetailsObject;
  showDelete: boolean = false;
  showPayCaregiver: boolean = true;
  showRefund: boolean = false;
  payCaregiverForm: FormGroup;
  refundPaymentForm: FormGroup;
  changeBookingDateForm: FormGroup;
  showEditDateOption: boolean = true;
  constructor(
    private outstandingService: OutstandingMatchesAppointmentsService,
    private router: Router,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private global: GlobalService,
    private navigationService: NavigationService
  ) { }
  ngOnInit() {
    const parts: object = this.router.url.split("/");
    if (parts[4] && parts[4] !== '' || parts[4] !== undefined) {
      this.bookingId = parts[4];
    }
    this.getBookingDetails();
    this.setPayCaregiverForm();
    this.setRefundPaymentForm();
    this.setChangeBookingDateForm();
  }
  setChangeBookingDateForm() {
    this.changeBookingDateForm = this.formBuilder.group({
      date: new FormControl('', [Validators.required]),
      start_time: new FormControl('', [Validators.required, this.validationService.onlyNumberTime]),
      start_minutes: new FormControl('', [Validators.required]),
      start_meridian: new FormControl('', [Validators.required]),
    });
  }
  setPayCaregiverForm() {
    this.payCaregiverForm = this.formBuilder.group({
      payment_date_client: new FormControl('', [Validators.required]),
      payment_date_time: new FormControl('', [Validators.required])
    });
  }
  setRefundPaymentForm() {
    this.refundPaymentForm = this.formBuilder.group({
      refund_date_client: new FormControl('', [Validators.required]),
      refund_date_time: new FormControl('', [Validators.required])
    });
  }
  getBookingDetails() {
    this.outstandingService.getBookingDetails(this.bookingId).subscribe((returnData) => {
      const { success, data } = returnData;
      if (success) {
        const { end_time, payment_status, payment_status_caregiver } = data;
        // Check for showing edit date popup
        const currentTime = new Date();
        const bookingEndTime = new Date(end_time);
        if (bookingEndTime < currentTime) {
          this.showEditDateOption = false;
        } else {
          this.showEditDateOption = true;
        }
        this.bookingDetails = data;
        if (payment_status === this.global.paymentStatusUnpaid) {
          this.showDelete = true;
        } else if (payment_status === this.global.paymentStatusPaid) {
          this.showRefund = true;
        }
        if (payment_status_caregiver === this.global.paymentStatusCaregiverPaid) {
          this.showPayCaregiver = false;
        }
        if (this.bookingDetails.caregiverDetail.length > 0) {
          this.bookingDetails.caregiverDetail.map((caregiver: BookingDetailsCaregiverObject) => {
            if (caregiver.status === this.global.careGiverStatusConfirmed) {
              this.bookingDetails.acceptedCaregvier = caregiver;
            }
          });
        }
      }
    });
  }
  cancelAppointment() {
    const dataToSend: CancelAppointmentData = {
      booking_id: this.bookingId
    };
    this.outstandingService.cancelAppointment(dataToSend).subscribe((returnData: CancelAppointmentResposneObject) => {
      const { success, message } = returnData;
      if (success) {
        this.navigationService.navigateToCompletedMatches();
        this.toastr.success("", message);
      }
    });
  }
  setDate() {
    const { refund_date_client, refund_date_time } = this.refundPaymentForm.value;
    if (refund_date_client !== '' && refund_date_client !== null) {
      this.refundPaymentForm.value.refund_date_client =
        refund_date_client.year + "-" +
        ('0' + refund_date_client.month).slice(-2) + "-" +
        ('0' + refund_date_client.day).slice(-2) + " " +
        ('0' + refund_date_time.hour).slice(-2) + ":" +
        ('0' + refund_date_time.minute).slice(-2) + ":00";
    }
  }
  refundAppointment() {
    if (!this.refundPaymentForm.valid) {
      this.validationService.validateAllFormFields(this.refundPaymentForm);
      return false;
    }
    const dataToSend: RefundAppointmentData = {
      booking_id: this.bookingId,
      payment_status_caregiver: this.global.paymentStatusCaregiverRefund,
      payment_date_caregiver: ""
    };
    this.setDate();
    if (this.refundPaymentForm.value.refund_date_client && this.refundPaymentForm.value.refund_date_client !== "") {
      dataToSend.payment_date_caregiver = this.refundPaymentForm.value.refund_date_client;
    }
    this.outstandingService.refundAppointment(dataToSend).subscribe((returnData: RefundAppointmentRsposneObject) => {
      const { success, message } = returnData;
      if (success) {
        this.navigationService.navigateToCompletedMatches();
        this.toastr.success("", message);
        (<HTMLInputElement>document.getElementById("closeButtonRefund")).click();
      }
    }, err => {
      (<HTMLInputElement>document.getElementById("closeButtonRefund")).click();
    });
  }
  setDateClientPayment() {
    const { payment_date_client, payment_date_time } = this.payCaregiverForm.value;
    if (payment_date_client !== '' && payment_date_client !== null) {
      this.payCaregiverForm.value.payment_date_client =
        payment_date_client.year + "-" +
        ('0' + payment_date_client.month).slice(-2) + "-" +
        ('0' + payment_date_client.day).slice(-2) + " " +
        ('0' + payment_date_time.hour).slice(-2) + ":" +
        ('0' + payment_date_time.minute).slice(-2) + ":00";
    }
  }
  clientPayment() {
    if (!this.payCaregiverForm.valid) {
      this.validationService.validateAllFormFields(this.payCaregiverForm);
      return false;
    }
    this.setDateClientPayment();
    const dataToSend: DateClientPayment = {
      booking_id: this.bookingId,
      payment_status_caregiver: this.global.paymentStatusCaregiverPaid,
      registration_no: this.bookingDetails.acceptedCaregvier.caregiver.registration_no,
      payment_date_caregiver: ""
    };
    if (this.payCaregiverForm.value.payment_date_client && this.payCaregiverForm.value.payment_date_client !== "") {
      dataToSend.payment_date_caregiver = this.payCaregiverForm.value.payment_date_client;
    }
    this.outstandingService.clientPayment(dataToSend).subscribe((returnData: ClientPaymentResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.navigationService.navigateToCompletedMatches();
        this.toastr.success("", message);
        (<HTMLInputElement>document.getElementById("closeButton")).click();
      }
    }, err => {
      (<HTMLInputElement>document.getElementById("closeButton")).click();
    });
  }
  setBookingChangeDate() {
    const dataToSend: COmpletedMatchesDataToSend = {};
    const { date, start_meridian, start_time, start_minutes } = this.changeBookingDateForm.value;
    if (date && date !== "") {
      dataToSend.date = date.year + "-" + ('0' + date.month).slice(-2) + "-" + ('0' + date.day).slice(-2);
    }
    if (start_meridian === "AM") {
      if (start_time === 12 || start_time === '12') {
        dataToSend.start_time = `00:${start_minutes}`;
      } else {
        dataToSend.start_time = ('0' + start_time).slice(-2) + ":" + start_minutes;
      }
    } else if (start_meridian === "PM") {
      if (start_time === 12 || start_time === '12') {
        dataToSend.start_time = `12:${start_minutes}`;
      } else {
        const startTime = Number(start_time) + 12;
        dataToSend.start_time = ('0' + startTime).slice(-2) + ":" + start_minutes;
      }
    }
    dataToSend.booking_id = this.bookingId;
    return dataToSend;
  }
  changeBookingTime() {
    if (!this.changeBookingDateForm.valid) {
      this.validationService.validateAllFormFields(this.changeBookingDateForm);
      return false;
    }
    const dataToSend = this.setBookingChangeDate();
    this.outstandingService.changeBookingTime(dataToSend).subscribe((returnData: ChangeBookingTimeResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        this.getBookingDetails();
        (<HTMLInputElement>document.getElementById("closeButtonNew")).click();
      }
    }, err => {
      this.toastr.danger("", err.error.error.message);
      (<HTMLInputElement>document.getElementById("closeButtonNew")).click();
    });
  }
  openPopup(dialog: TemplateRef<any>) {
    this.changeBookingDateForm.reset();
    this.dialogService.open(
      dialog,
      {});
  }
}
