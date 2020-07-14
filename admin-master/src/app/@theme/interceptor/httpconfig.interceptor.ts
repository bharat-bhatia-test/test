import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CommonService } from "../services/common.service";
import { NbToastrService } from "@nebular/theme";
import { GlobalService } from "../services/global.service";
import * as CryptoJS from "crypto-js";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private common: CommonService,
    private toaster: NbToastrService,
    private global: GlobalService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem("token");
    if (token) {
      if (
        request.url.search("/login") === -1 &&
        request.url.search("/socialLogin") === -1
      ) {
        request = request.clone({
          headers: request.headers.set("Authorization", `Bearer ${token}`),
        });
      }
    }
    const deviceId = this.global.deviceId;
    if (deviceId) {
      request = request.clone({
        headers: request.headers.set("device-id", `${deviceId}`),
      });
    }
    // Added Encryption for the Auth Module Starts Here
    if (request.url.includes("auth")) {
      const encryptedBody = CryptoJS.AES.encrypt(
        JSON.stringify(request.body),
        `${deviceId}`
      ).toString();
      request = request.clone({
        body: { payload: encryptedBody },
      });
    }
    // Added Encryption for the Auth Module Ends Here
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.url.includes("auth")) {
            const bytes = CryptoJS.AES.decrypt(
              event.body.payload,
              `${deviceId}`
            );
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            event = event.clone({
              body: decryptedData,
            });
          }
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        let errData;
        if (err instanceof HttpErrorResponse) {
          console.log("err >>>>>>>>>>.", err);
          switch (err.status) {
            case 400:
              errData = err.error.error ? err.error.error : err.error.error;
              break;
            case 401:
              errData = err.error.message || err.error.error;
              this.handleAuthenticationError(errData);
              break;
            case 403:
              errData = err.error.error || ("Not allowed to access!" as any);
              this.toaster.danger("", errData);
              break;
            case 404:
              errData =
                err.error.result || err.error.error || err.error.message;
              this.toaster.danger("", errData);
              break;
            case 409:
              errData = err.error.error || err.error.message;
              this.toaster.danger("", errData);
              break;
            case 429:
              this.toaster.danger("", "Too Many Requests");
              break;
            // case 500:
            //   errData = err.error.result || err.error.error || err.error.message || err.message;
            //   this.toaster.danger("", errData);
            //   break;
            default:
              break;
          }
          if (err.url.includes("auth")) {
            const bytes = CryptoJS.AES.decrypt(
              err.error.payload,
              `${deviceId}`
            );
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return throwError({
              statusCode: err.status,
              error: decryptedData,
            });
          } else {
            return throwError({
              statusCode: err.status,
              error: errData ? errData : err,
            });
          }
        }
      })
    );
  }

  handleAuthenticationError(error: any) {
    this.toaster.danger("", error);
    this.common.logout();
  }
}
