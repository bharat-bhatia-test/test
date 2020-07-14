import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  apiUrl = environment.api_url;
  constructor(public http: HttpClient, public router: Router) { }

  logout() {
    localStorage.clear();
    this.router.navigate(["/auth/login"]);
  }

  login(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, data);
  }

  goToHome() {
    const token = localStorage.getItem("token");
    if (token) {
      return this.router.navigate(["/pages/client"]);
    }
    return this.logout();
  }

  getLoggedInUser() {
    const token = localStorage.getItem("token");
    if (token) {
      return this.getDecodedAccessToken(token);
    }
    return;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  errorHandling(err, form) {
    err.data.map((errorData: any) => {
      form.controls[errorData.field].setErrors({
        serverError: errorData.message,
      });
    });
    return form;
  }
}
