import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css'],
})
export class ClientLayoutComponent implements OnInit {
  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit(): void {

  }
  redirect(event) {
    if (event.target.value === 'User') {
      this.router.navigate([`/client/onboard/user-info`]);
    } else if (event.target.value === 'Receiver') {
      this.router.navigate([`/client/onboard/service-info`]);
    } else if (event.target.value === 'Background') {
      this.router.navigate([`/client/onboard/background`]);
    } else if (event.target.value === 'Medical') {
      this.router.navigate([`/client/onboard/medical-history`]);
    } else if (event.target.value === 'Terms') {
      this.router.navigate([`/client/onboard/terms-conditions`]);
    }
  }
}
