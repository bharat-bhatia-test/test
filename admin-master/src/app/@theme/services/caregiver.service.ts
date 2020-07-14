import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CaregiverService {
  apiUrl = environment.api_url;

  constructor(public http: HttpClient) {}

  getAllCaregivers(params) {
    return this.http.get<any>(`${this.apiUrl}/api/caregivers`, { params });
  }

  deleteCaregiver(data) {
    return this.http.put(`${this.apiUrl}/api/delete-user`, data);
  }
  registerByAdmin(data) {
    return this.http.post(`${this.apiUrl}/api/auth/register-by-admin`, data);
  }
  getUserPersonalInfo(registrationNo) {
    return this.http.get<any>(
      `${this.apiUrl}/api/caregiver/personal-info/?registration_no=${registrationNo}`,
      {}
    );
  }
  addUpdateCaregiverInfo(data) {
    return this.http.post(`${this.apiUrl}/api/caregiver/personal-info`, data);
  }
  getWorkInfo(registrationNo) {
    return this.http.get<any>(
      `${this.apiUrl}/api/caregiver/experience-education/?registration_no=${registrationNo}`,
      {}
    );
  }
  addUpdateCaregiverWorkInfo(data) {
    return this.http.post(
      `${this.apiUrl}/api/caregiver/experience-education`,
      data
    );
  }
  getSkills(currentCaregiverType) {
    return this.http.get<any>(
      `${this.apiUrl}/api/skill-set?caregiver_type=${currentCaregiverType}`,
      {}
    );
  }
  getSkillSet(registrationNo) {
    return this.http.get<any>(
      `${this.apiUrl}/api/caregiver/skill-set?registration_no=${registrationNo}`,
      {}
    );
  }
  addUpdateSkillSet(data) {
    return this.http.post(`${this.apiUrl}/api/caregiver/skill-set`, data);
  }
  getLocationList() {
    return this.http.get<any>(`${this.apiUrl}/api/location`, {});
  }
  getAvailability(registrationNo) {
    return this.http.get<any>(
      `${this.apiUrl}/api/caregiver/availability/?registration_no=${registrationNo}`,
      {}
    );
  }
  addUpdateAvailability(data) {
    return this.http.post(`${this.apiUrl}/api/caregiver/availability`, data);
  }
  getCharges(registrationNo) {
    return this.http.get<any>(
      `${this.apiUrl}/api/caregiver/charges?registration_no=${registrationNo}`,
      {}
    );
  }
  addUpdateCharges(data) {
    return this.http.post(`${this.apiUrl}/api/caregiver/charges`, data);
  }
  changeStatus(data) {
    return this.http.put(`${this.apiUrl}/api/change-status`, data);
  }
  getReferralData(params) {
    return this.http.get(
      `${this.apiUrl}/api/caregiver/referral-bonus?for=caregiver`,
      { params }
    );
  }
  referralAmountPaidDetails(data) {
    return this.http.post(`${this.apiUrl}/api/pay-referral-amount`, data);
  }
  appointmentsFormSubmit(params) {
    return this.http.get(`${this.apiUrl}/api/booking/for-caregiver`, {
      params,
    });
  }
  cancelBooking(data) {
    return this.http.put(`${this.apiUrl}/api/booking/cancel-by-admin`, data);
  }
  changePassword(data) {
    return this.http.put(`${this.apiUrl}/api/profile/change-password`, data);
  }
  getCaregiverReviews(params) {
    return this.http.get<any>(`${this.apiUrl}/api/caregiver/profile/reviews`, {
      params,
    });
  }
  removeFeedback(reviewID) {
    return this.http.delete<any>(
      `${this.apiUrl}/api/remove-feedback?id=${reviewID}`
    );
  }
}
