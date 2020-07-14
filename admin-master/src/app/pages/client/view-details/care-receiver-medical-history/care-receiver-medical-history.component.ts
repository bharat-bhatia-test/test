import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../@theme/services/client.service';
import { NbToastrService } from '@nebular/theme';
import { IllnessList, GetServiceUserMedicalHistoryResponse } from '../../../admin.interface';
@Component({
  selector: 'care-receiver-medical-history',
  templateUrl: './care-receiver-medical-history.component.html',
  styleUrls: ['./care-receiver-medical-history.component.scss']
})
export class CareReceiverMedicalHistoryComponent implements OnInit {
  slug: string;
  illnessList: Array<IllnessList> = [];
  otherHistory: string;
  specificList: Array<string> = [];
  constructor(
    private clientService: ClientService,
    private toastr: NbToastrService
  ) {
    this.slug = localStorage.getItem('slug');
  }
  ngOnInit() {
    this.getUserMedicalHistory();
  }
  getUserMedicalHistory() {
    this.clientService.getServiceUserMedicalHistory(this.slug).subscribe(
      (response: GetServiceUserMedicalHistoryResponse) => {
        const { success, data, message } = response;
        if (success) {
          const { illness, service_user_other_medical_history } = data;
          this.illnessList = illness;
          this.getSpecific(illness);
          this.otherHistory = service_user_other_medical_history;
        } else if (!success) {
          this.toastr.danger("", message);
        }
      });
  }
  getSpecific(data) {
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].pivot.specific_title !== null) {
        this.specificList.push(data[i].pivot.specific_title);
      }
    }
  }
}
