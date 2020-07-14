import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ClientService } from '../../../../@theme/services/client.service';
import { LocationListObject, PersonalInfoData } from '../../../admin.interface';

@Component({
  selector: 'personal-info-care-receiver',
  templateUrl: './personal-info-care-receiver.component.html',
  styleUrls: ['./personal-info-care-receiver.component.scss']
})
export class PersonalInfoCareReceiverComponent implements OnInit {
  slug: string;
  locationsList: Array<LocationListObject> = [];
  maxDate: object = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  salute: object = ['Mr', 'Ms'];
  data: PersonalInfoData;
  constructor(
    private toastr: NbToastrService,
    private clientService: ClientService
  ) {
    this.slug = localStorage.getItem('slug');
  }
  async ngOnInit() {
    await this.getLocations();
    if (this.slug) {
      this.getUserInfo();
    }
  }
  setData(dataFromAPI) {
    const {
      service_user_salute,
      service_user_firstname,
      service_user_lastname,
      service_user_dob,
      servive_user_home_telephone,
      service_user_mobile,
      service_user_flat_no,
      service_user_floor_no,
      service_user_building_name,
      service_user_street_name_number,
      service_user_district
    } = dataFromAPI;
    this.data = dataFromAPI;
    this.data.salute = service_user_salute;
    this.data.first_name = service_user_firstname;
    this.data.last_name = service_user_lastname;
    this.data.dob = service_user_dob;
    this.data.home_telephone = servive_user_home_telephone;
    this.data.mobile = service_user_mobile;
    this.data.flat = service_user_flat_no;
    this.data.floor = service_user_floor_no;
    this.data.building = service_user_building_name;
    this.data.street = service_user_street_name_number;
    this.data.district = service_user_district;
    this.getDistrictName();
  }
  getUserInfo() {
    this.clientService.getServiceUserInfo(this.slug).subscribe(
      (response: any) => {
        const { success, data, message } = response;
        if (success) {
          this.setData(data);
        } else if (!success) {
          this.toastr.danger("", message);
        }
      }
    );
  }
  async getLocations() {
    const response: any = await this.clientService.getLocationsList().toPromise();
    const { success, data } = response;
    if (success) {
      this.locationsList = data;
    }
  }
  getDistrictName() {
    for (let i = 0; i <= this.locationsList.length - 1; i++) {
      for (let j = 0; j <= this.locationsList[i].subLocations.length - 1; j++) {
        if (this.locationsList[i].subLocations[j].id === Number(this.data.district)) {
          this.data.district = this.locationsList[i].subLocations[j].name;
        }
      }
    }
  }
}
