import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  apiUrl = environment.api_url;
  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  getSystemSettings() {
    return this.http.get(`${this.apiUrl}/api/setting`);
  }
  addUpdateSystemSettings(settings) {
    return this.http.post(`${this.apiUrl}/api/setting`, settings);
  }
}
