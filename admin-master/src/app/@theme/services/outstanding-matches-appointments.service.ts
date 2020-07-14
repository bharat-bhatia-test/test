import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutstandingMatchesAppointmentsService {
  apiUrl = environment.api_url;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  getOutstandingMatchAppointmentList(params) {
    return this.http.get<any>(`${this.apiUrl}/api/outstanding-appointments`, { params });
  }
  confirmBookingByAdmin(data) {
    return this.http.post(`${this.apiUrl}/api/booking/confirm`, data);
  }
  cancelAppointment(data) {
    return this.http.put(`${this.apiUrl}/api/booking/cancel-by-admin`, data);
  }
  clientPayment(data) {
    return this.http.put(`${this.apiUrl}/api/booking/caregiver-payment`, data);
  }
  getBookingDetails(bookingId) {
    return this.http.get<any>(`${this.apiUrl}/api/booking/details?booking_id=${bookingId}`);
  }
  getCompletedMatchAppointmentList(params) {
    return this.http.get<any>(`${this.apiUrl}/api/completed-appointments`, { params });
  }
  getLocationsList() {
    return this.http.get<any>(`${this.apiUrl}/api/location/`);
  }
  refundAppointment(data) {
    return this.http.put(`${this.apiUrl}/api/booking/caregiver-payment`, data);
  }
  changeBookingTime(data) {
    return this.http.put(`${this.apiUrl}/api/booking/change-booking-time`, data);
  }
}
