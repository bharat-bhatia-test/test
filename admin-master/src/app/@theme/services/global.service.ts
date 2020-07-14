import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  deviceId: string = "";
  currentOnBoardStep: string;
  caregiverOnBoardCompleted: boolean;
  personalCareType = '1'; // care array type = [1 ==> Personal Care, 2 => Special Care] This is convention used in the DB
  specialCareType = '2'; // care array type = [1 ==> Personal Care, 2 => Special Care] This is convention used in the DB
  currentStep: string;
  paymentStatusUnpaid = "1"; // 1=unpaid,2=paid,3=cancelled,4=refund from the Database
  paymentStatusPaid = "2"; // 1=unpaid,2=paid,3=cancelled,4=refund from the Database
  paymentStatusCaregiverUnPaid = "1"; // 1=unpaid,2=paid,3=cancelled,4=refund from the Database
  paymentStatusCaregiverPaid = "2"; // 1=unpaid,2=paid,3=cancelled,4=refund from the Database
  paymentStatusCaregiverRefund = "4"; // 1=unpaid,2=paid,3=cancelled,4=refund from the Database
  careGiverStatusConfirmed = "2"; // 1=awaiting_for_response,2=confirmed,3=rejected,4=cancelled from the Database
  bookingStatusRejected = "3"; // 1=awaiting_for_response,2=confirmed,3=rejected,4=cancelled from the Database
  bookingStatusAccepted = "2"; // 1=awaiting_for_response,2=confirmed,3=rejected,4=cancelled from the Database
  constructor() {
    if (
      localStorage.getItem('currentOnBoardingStep') &&
      localStorage.getItem('currentOnBoardingStep') !== '' &&
      localStorage.getItem('currentOnBoardingStep') !== null
    ) {
      this.currentOnBoardStep = localStorage.getItem('currentOnBoardingStep');
    } else {
      this.currentOnBoardStep = String(8);
    }
    this.currentStep = localStorage.getItem('current_step');
  }

  errorHandling(err, form) {
    err.error.data.map((errorData: any) => {
      form.controls[errorData.field].setErrors({
        serverError: errorData.message,
      });
    });
    return form;
  }
}
