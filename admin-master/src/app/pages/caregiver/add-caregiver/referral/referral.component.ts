import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { NbDateService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ValidationService } from '../../../../@theme/services/validation.service';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { ReferralData, ReferralSednignData, DataToSendReferral, ReferralAmountPaidDetailsObject, GetReferralDataObject } from '../../../admin.interface';

@Component({
  selector: 'referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  referralForm: FormGroup;
  max: Date;
  id: number = 0;
  referralData: ReferralData;
  dataToSend: DataToSendReferral = {};

  constructor(
    private route: ActivatedRoute,
    private caregiverService: CaregiverService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private dateService: NbDateService<Date>,
    private toastr: NbToastrService,
    private navigationService: NavigationService
  ) {
    this.max = this.dateService.addDay(this.dateService.today(), 0);
  }

  ngOnInit() {
    this.setReferralForm();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getReferralData();
  }
  setReferralForm() {
    this.referralForm = this.formBuilder.group({
      amount: ["", this.validationService.onlyNumber],
      date: [""]
    });
  }
  getReferralData() {
    const sendingData: ReferralSednignData = {
      registration_no: this.id
    };
    this.caregiverService.getReferralData(sendingData).subscribe((returnData: GetReferralDataObject) => {
      const { success, data } = returnData;
      if (success) {
        this.referralData = data;
      }
    });
  }
  onSubmit() {
    let { date } = this.referralForm.value;
    const { amount } = this.referralForm.value;
    if (date) {
      const dateOfBirth = new Date(date);
      const formatedDated =
        dateOfBirth.getFullYear() +
        '-' +
        ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateOfBirth.getDate()).slice(-2);
      date = formatedDated;
    } else {
      date = "";
    }
    this.dataToSend.amount = amount;
    this.dataToSend.date = date;
    this.dataToSend.user_id = Number(localStorage.getItem('user_id'));
    this.caregiverService.referralAmountPaidDetails(this.dataToSend).subscribe((returnData: ReferralAmountPaidDetailsObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        this.navigationService.navigateToCaregiverList();
      }
    });
  }
}
