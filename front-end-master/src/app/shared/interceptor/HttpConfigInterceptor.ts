import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map, catchError } from 'rxjs/operators/index';
import { ConstantService } from '../services/constant.service';
import { GlobalService } from '../services/global.service';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  loader = false;
  deviceId: string = '';
  constructor(
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public constant: ConstantService,
    private globalService: GlobalService,
    private translate: TranslateService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.spinner.show();
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
        },
      });
    }
    this.deviceId = this.globalService.deviceID;
    if (this.deviceId && this.deviceId !== '') {
      req = req.clone({
        setHeaders: {
          'device-id': `${this.deviceId}`
        }
      });
    }
    // Added Encryption for the Auth Module Starts Here
    if (req.url.includes('auth') || req.url.includes('client/feedback')) {
      const encryptedBody = CryptoJS.AES.encrypt(JSON.stringify(req.body), `${this.deviceId}`).toString();
      req = req.clone({
        body: { payload: encryptedBody }
      });
    }
    // Added Encryption for the Auth Module Ends Here
    return next.handle(req).pipe(
      map((event: any) => {
        if (event instanceof HttpResponse) {
          this.spinner.hide();
          if (event.url.includes('auth')) {
            const bytes = CryptoJS.AES.decrypt(event.body.payload, `${this.deviceId}`);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            event = event.clone({
              body: decryptedData
            });
          }
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400:
              break;
            case 401:
              this.toastr.error(this.translate.instant(err.error.message, this.constant.ERROR));
              this.handleAuthenticationError(err);
              break;
            case 403:
              this.toastr.error(this.translate.instant(this.constant.NOT_ALLOWED, this.constant.ERROR));
              break;
            case 404:
              break;
            case 409:
              this.toastr.error(this.translate.instant(err.error.message, this.constant.ERROR));
              break;
            default:
              this.toastr.error(this.translate.instant(this.constant.SOMETHING, this.constant.ERROR));
              break;
          }
        }
        this.spinner.hide();
        if (err.url.includes('auth')) {
          const bytes = CryptoJS.AES.decrypt(err.error.payload, `${this.deviceId}`);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          return throwError(decryptedData);
        } else {
          return throwError(err.error);
        }
        // return throwError(err.error);
      }),
    );
  }
  handleAuthenticationError(error: any) {
    this.globalService.logout();
  }

  hideLoaderFromService() {
    // this.appComponent.hideLoader();
  }
}
