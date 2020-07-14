import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  id: string;
  tabs: object;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    localStorage.setItem("clientID", this.id);
    this.tabs = [
      {
        title: 'Account User Personal Information',
        route: `/pages/client/client-view-details/${this.id}/account-user-personal-info`
      },
      {
        title: 'Care Receiver Personal Information',
        route: `/pages/client/client-view-details/${this.id}/care-receiver-personal-info`
      },
      {
        title: 'Care Receiver Background',
        route: `/pages/client/client-view-details/${this.id}/care-receiver-background`
      },
      {
        title: 'Care Receiver Medical History',
        route: `/pages/client/client-view-details/${this.id}/care-receiver-medical-history`
      },
      {
        title: 'Appointment Details',
        route: `/pages/client/client-view-details/${this.id}/appointments`
      },
      {
        title: 'Referral Bonus',
        route: `/pages/client/client-view-details/${this.id}/referral-bonus`
      }
    ];
  }

}
