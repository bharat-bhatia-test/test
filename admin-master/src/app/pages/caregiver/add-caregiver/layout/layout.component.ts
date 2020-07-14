import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  tabs: object = [];
  caregiverRegistrationNumber: string = "";
  constructor(private router: Router) {}

  ngOnInit() {
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.caregiverRegistrationNumber = parts[5];
    }
    this.tabs = [
      {
        title: "Personal Info",
        route: `/pages/caregiver/onboard/personal-info/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Work Experience and Education",
        route: `/pages/caregiver/onboard/work-experience/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "SkillSets",
        route: `/pages/caregiver/onboard/skillset/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Availability",
        route: `/pages/caregiver/onboard/availability/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Charges",
        route: `/pages/caregiver/onboard/charges/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Appointments",
        route: `/pages/caregiver/onboard/appointments/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Referral",
        route: `/pages/caregiver/onboard/referral/${this.caregiverRegistrationNumber}`,
      },
      {
        title: "Reviews",
        route: `/pages/caregiver/onboard/reviews/${this.caregiverRegistrationNumber}`,
      },
    ];
  }
}
