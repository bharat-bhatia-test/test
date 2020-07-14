import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../@theme/services/client.service';
import { NbToastrService } from '@nebular/theme';
import { SelfcareAbilitiesObject, CareReciverBackgroundData, GetServiceUserBackgroundResposneObject } from '../../../admin.interface';
@Component({
  selector: 'care-receiver-background',
  templateUrl: './care-receiver-background.component.html',
  styleUrls: ['./care-receiver-background.component.scss']
})
export class CareReceiverBackgroundComponent implements OnInit {
  slug: string;
  selfcareAbilities: Array<SelfcareAbilitiesObject> = [];
  data: CareReciverBackgroundData;
  lift: Array<string> = ["No lifting required", "One person lifting required", "Two person lifting required", "Lifting devices needed"];
  assistingDevices: Array<string> = ["Crounches", "Quadripods", "Walker", "Wheel Chair", "Bed Bound"];
  dietData: Array<string> = ["Normal", "Minced", "Pureed"];
  hearing: Array<string> = ["Normal", "Partially Impaired", "Complete Impaired"];
  eyeSight: Array<string> = ["Normal Eyesight", "Partially Visually Impaired", "Complete Visually Impaired"];
  languages: Array<string> = ['Cantonese', 'Mandrin', 'English', 'Dialect'];
  languageToShow: Array<string> = [];
  otherDevices: Array<string> = ["Wear Pacemaker", "Hard to swallow", "Incontinence", "Drug Allergy", "Violence"];
  otherDevicesToShow: Array<string> = [];
  showSpecificDurg: boolean = false;
  specificDrug: string = '';
  constructor(
    private clientService: ClientService,
    private toastr: NbToastrService
  ) {
    this.slug = localStorage.getItem('slug');
  }
  ngOnInit() {
    this.getUserBackground();
  }
  setData(dataFromResponse) {
    const { service_user_weight, service_user_height, service_user_diet, service_user_physical_ability, service_user_eye_sight, service_user_hearing, service_user_lifting, service_user_lower_left_leg_limb_mobility, service_user_lower_right_leg_limb_mobility, service_user_left_hand_mobility, service_user_right_hand_mobility, service_user_assisting_device, otherDevices, selfCareAbilities } = dataFromResponse;
    this.data = dataFromResponse;
    this.data.weight = service_user_weight;
    this.data.height = service_user_height;
    this.data.diet = service_user_diet;
    this.data.physicalAbility = service_user_physical_ability;
    this.data.eyeSight = service_user_eye_sight;
    this.data.hearing = service_user_hearing;
    this.data.lifting = service_user_lifting;
    this.data.leftLeg = service_user_lower_left_leg_limb_mobility;
    this.data.rightLeg = service_user_lower_right_leg_limb_mobility;
    this.data.leftHand = service_user_left_hand_mobility;
    this.data.rightHand = service_user_right_hand_mobility;
    this.data.assistingDevices = service_user_assisting_device;
    this.otherDevices = otherDevices;
    this.selfcareAbilities = selfCareAbilities;
  }
  getUserBackground() {
    this.clientService.getServiceUserBackground(this.slug).subscribe(
      (response: GetServiceUserBackgroundResposneObject) => {
        const { success, data, message } = response;
        if (success) {
          this.getLanguages(data);
          this.getOtherDevices(data.otherDevices);
          this.setData(data);
        } else if (!success) {
          this.toastr.danger("", message);
        }
      }
    );
  }
  getLanguages(data) {
    const tempArray: Array<any> = [];
    let index: number = 0;
    data.languages.map(function (lang) {
      tempArray.push(lang.language);
    });
    for (let i = 0; i <= data.languages.length - 1; i++) {
      if (data.languages[i].other_lang != null) {
        index = i;
      }
    }
    for (let i = 0; i <= tempArray.length - 1; i++) {
      if (tempArray[i] === "4") {
        this.languageToShow.push(data.languages[index].other_lang);
        delete tempArray[i];
      }
      this.languageToShow.push(this.languages[tempArray[i] - 1]);
    }
  }
  getOtherDevices(data) {
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].specific_drug !== null) {
        this.specificDrug = data[i].specific_drug;
        this.showSpecificDurg = true;
      }
    }
    const tempData: Array<any> = [];
    data.map(function (others) {
      tempData.push(others.other_device);
    });
    for (let i = 0; i <= tempData.length - 1; i++) {
      this.otherDevicesToShow.push(this.otherDevices[tempData[i] - 1]);
    }
  }
}
