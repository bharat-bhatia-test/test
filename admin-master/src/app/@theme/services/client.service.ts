import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  apiUrl = environment.api_url;
  constructor(
    public http: HttpClient,
    public router: Router,
  ) { }

  getClients(params) {
    return this.http.get<any>(`${this.apiUrl}/api/clients`, { params });
  }
  getAccountUserInfo(userId) {
    return this.http.get(
      `${this.apiUrl}/api/client/account-user-info/?user_id=${userId}`
    );
  }
  getLocationsList() {
    return this.http.get(`${this.apiUrl}/api/location`);
  }
  getServiceUserInfo(slug) {
    return this.http.get(
      `${this.apiUrl}/api/client/service-user-info/?slug=${slug}`
    );
  }
  getServiceUserBackground(slug) {
    return this.http.get(
      `${this.apiUrl}/api/client/service-user-background/?slug=${slug}`
    );
  }
  getServiceUserMedicalHistory(slug) {
    return this.http.get(
      `${this.apiUrl}/api/client/service-user-medical-history/?slug=${slug}`
    );
  }
  deleteClient(user) {
    return this.http.put(`${this.apiUrl}/api/delete-user`, user);
  }
  appointmentsFormSubmit(params) {
    return this.http.get(`${this.apiUrl}/api/booking/for-client`, { params });
  }
  referralBonus(data) {
    return this.http.get(
      `${this.apiUrl}/api/client/referral-bonus?for=client&slug=${data.slug}`
    );
  }
  referralAmountPaidDetails(data) {
    return this.http.post(
      `${this.apiUrl}/api/pay-referral-amount`, data);
  }
  cancelBooking(data) {
    return this.http.put(
      `${this.apiUrl}/api/booking/cancel-by-admin`, data);
  }
}
