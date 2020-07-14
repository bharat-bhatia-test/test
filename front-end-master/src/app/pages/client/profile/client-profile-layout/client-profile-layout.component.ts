import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-profile-layout',
  templateUrl: './client-profile-layout.component.html'
})
export class ClientProfileLayoutComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void { }
  redirect(event) {
    if (event.target.value === 'User') {
      this.router.navigate([`/client/profile/account-user-info`]);
    } else if (event.target.value === 'Receiver') {
      this.router.navigate([`/client/profile/service-user-info`]);
    } else if (event.target.value === 'Background') {
      this.router.navigate([`/client/profile/service-user-background`]);
    } else if (event.target.value === 'Medical') {
      this.router.navigate([`/client/profile/service-user-medical-history`]);
    } else if (event.target.value === 'Referral') {
      this.router.navigate([`/client/profile/referral-bonus`]);
    }
  }
}
