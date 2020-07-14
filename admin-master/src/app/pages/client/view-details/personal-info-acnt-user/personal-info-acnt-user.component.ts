import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ClientService } from '../../../../@theme/services/client.service';
import { PersonalInfoAcountData } from '../../../admin.interface';

@Component({
  selector: 'personal-info-acnt-user',
  templateUrl: './personal-info-acnt-user.component.html',
  styleUrls: ['./personal-info-acnt-user.component.scss']
})
export class PersonalInfoAcntUserComponent implements OnInit {
  userId: number = 0;
  data: PersonalInfoAcountData;
  salute: Array<string> = ['Mr', 'Ms'];
  serviceUser: Array<string> = ['I am the service user', 'Father', 'Mother', 'Relative', 'Friend'];
  communicationLang: Array<string> = ['Chinese', 'English'];
  constructor(
    private toastr: NbToastrService,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId === 0) {
      this.userId = Number(localStorage.getItem('clientID'));
    }
    this.getUserInfo();
  }
  setData(dataFromAPI) {
    const {
      user:
      {
        salute,
        mobile_number,
        email,
        preferred_communication_language
      },
      first_name,
      last_name,
      relation_with_service_user,
      home_telephone_number,
      slug } = dataFromAPI;
    this.data = dataFromAPI;
    this.data.salute = salute;
    this.data.mobile_number = mobile_number;
    this.data.email = email;
    this.data.first_name = first_name;
    this.data.last_name = last_name;
    this.data.relation_with_service_user = relation_with_service_user;
    this.data.home_telephone_number = home_telephone_number;
    this.data.preferred_communication_language = preferred_communication_language;
    localStorage.setItem('slug', slug);
  }
  getUserInfo() {
    this.clientService.getAccountUserInfo(this.userId).subscribe(
      (response: any) => {
        const { success, data, message } = response;
        if (success) {
          if (data) {
            this.setData(data);
          } else if (!success) {
            this.toastr.danger("", message);
          }
        }
      }
    );
  }
}
