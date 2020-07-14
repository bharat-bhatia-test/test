import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../@theme/services/client.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ValidationService } from '../../../../@theme/services/validation.service';
import { NbDateService } from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { ReferralData, DataToSendReferral, GetReferralDataObject, ReferralAmountPaidDetailsObject } from '../../../admin.interface';
@Component({
  selector: 'referral-bonus',
  templateUrl: './referral-bonus.component.html',
  styleUrls: ['./referral-bonus.component.scss']
})
export class ReferralBonusComponent implements OnInit {
  referralForm: FormGroup;
  referralData: ReferralData;
  max: Date;
  dataToSend: DataToSendReferral = {};

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private dateService: NbDateService<Date>,
    private toaster: NbToastrService,
    private navigationService: NavigationService
  ) {
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    this.dataToSend.user_id = Number(localStorage.getItem('clientID'));
  }
  ngOnInit() {
    this.setReferralForm();
    this.getReferralData();
  }
  getReferralData() {
    const sendingData = {
      slug: localStorage.getItem('slug')
    };
    this.clientService.referralBonus(sendingData).subscribe((returnData: GetReferralDataObject) => {
      const { success, data, message } = returnData;
      if (success) {
        this.referralData = data;
      } else if (!success) {
        this.toaster.danger("", message);
      }
    });
  }
  setReferralForm() {
    this.referralForm = this.formBuilder.group({
      amount: ["", this.validationService.onlyNumber],
      date: [""]
    });
  }
  setDate() {
    if (this.referralForm.value.date) {
      const dateOfBirth = new Date(this.referralForm.value.date);
      const formatedDated =
        dateOfBirth.getFullYear() +
        '-' +
        ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateOfBirth.getDate()).slice(-2);
      this.referralForm.value.date = formatedDated;
    } else {
      this.referralForm.value.date = "";
    }
    this.dataToSend.amount = this.referralForm.value.amount;
    this.dataToSend.date = this.referralForm.value.date;
    this.referralForm.value.user_id = Number(localStorage.getItem('clientID'));
  }
  onSubmit() {
    if (!this.referralForm.valid) {
      this.validationService.validateAllFormFields(this.referralForm);
      return false;
    }
    this.setDate();
    this.clientService.referralAmountPaidDetails(this.dataToSend).subscribe((returnData: ReferralAmountPaidDetailsObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toaster.success("", message);
      } else if (!success) {
        this.toaster.danger("", message);
      }
      this.navigationService.navigateToClientList();
    });
  }
}
