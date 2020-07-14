import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ColumnMode, SelectionType } from '../../../../../node_modules/@swimlane/ngx-datatable/esm5/public-api';
import { OutstandingMatchesAppointmentsService } from '../../../@theme/services/outstanding-matches-appointments.service';
import { NbToastrService } from '@nebular/theme';
import { ValidationService } from '../../../@theme/services/validation.service';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';
import { ConstantService } from '../../../@theme/services/constant.service';
import { GlobalService } from '../../../@theme/services/global.service';
import { AppointmentObject, LocationObject, CompletedMatchesCSVData, LocationWithSub, BookingDetailsCaregiverObject, DataToSendListComponent, CSVSendingDataCompletedMatches, GetCompletedMatchAppointmentListObject } from '../../admin.interface';

@Component({
  selector: 'list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  completedMatchSearchForm: FormGroup;
  dataToSend: DataToSendListComponent = {};
  size: number = 0;
  pageNumber: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  SelectionType: SelectionType;
  ColumnMode: ColumnMode;
  caregiver_status: Array<string> = ['Awaiting Response', 'Accepted', 'All Rejected'];
  appointmentsList: Array<AppointmentObject> = [];
  locationsList: Array<LocationObject> = [];
  constructor(
    private outstandingService: OutstandingMatchesAppointmentsService,
    private toastr: NbToastrService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private datePipe: DatePipe,
    private constantService: ConstantService,
    private global: GlobalService
  ) {
    this.pageNumber = 0;
    this.size = 10;
  }
  async ngOnInit() {
    this.setSearchForm();
    await this.getLocations();
    this.setPage({ offset: 0 });
  }
  async getLocations() {
    const response = await this.outstandingService.getLocationsList().toPromise();
    const { success, data } = response;
    if (success) {
      if (data.length > 0) {
        data.map((location: LocationWithSub) => {
          if (location.subLocations.length > 0) {
            location.subLocations.map((finalLocation: LocationObject) => {
              this.locationsList.push(finalLocation);
            });
          }
        });
      }
    }
  }
  setSearchForm() {
    this.completedMatchSearchForm = this.formBuilder.group({
      date_range: new FormControl('', []),
      start_time: new FormControl('', []),
      end_time: new FormControl('', []),
      caregiver_type: new FormControl('', []),
      mobile_number: ['', [
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
      ]],
      email: ['', [this.validationService.emailValidator]],
      payment_status_caregiver: new FormControl('', []),
    });
  }
  completedMatchSearch() {
    if (!this.completedMatchSearchForm.valid) {
      this.validationService.validateAllFormFields(this.completedMatchSearchForm);
      return false;
    }
    const { email, mobile_number, start_time, end_time, payment_status_caregiver } = this.completedMatchSearchForm.value;
    if (email) {
      this.dataToSend.email = email;
    }
    if (mobile_number) {
      this.dataToSend.mobile_number = mobile_number;
    }
    if (payment_status_caregiver) {
      this.dataToSend.payment_status_caregiver = payment_status_caregiver;
    }
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    if (endTime.getTime() < startTime.getTime()) {
      this.toastr.danger("", this.constantService.TO_DATE_GREATER);
      return false;
    }
    if (start_time) {
      const startTimeNew = new Date(start_time);
      startTimeNew.setDate(startTimeNew.getDate() + 1);
      this.dataToSend.start_time = startTimeNew.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/).slice(0, 10)[1];
    }
    if (end_time) {
      const endTimeNew = new Date(end_time);
      endTimeNew.setDate(endTimeNew.getDate() + 1);
      this.dataToSend.end_time = endTimeNew.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/).slice(0, 10)[1];
    }
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  clearFilter() {
    this.completedMatchSearchForm.reset();
    this.completedMatchSearchForm.patchValue({
      payment_status_caregiver: ""
    });
    this.dataToSend = {};
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  setAppointMentData() {
    if (this.appointmentsList.length > 0) {
      this.appointmentsList.map((appointment: AppointmentObject) => {
        appointment.statusToShow = "Awaiting Response";
        // appointment.selectedCaregiver = {};
        const appointmentRejected: Array<number> = [];
        if (appointment.caregiverDetail.length > 0) {
          appointment.caregiverDetail.map((caregiver: BookingDetailsCaregiverObject) => {
            if (caregiver.status === this.global.bookingStatusRejected) {
              appointmentRejected.push(caregiver.id);
            }
            if (caregiver.status === this.global.bookingStatusAccepted) {
              appointment.selectedCaregiver = caregiver;
              appointment.statusToShow = "Accepted";
            }
          });
          if (appointmentRejected.length === appointment.caregiverDetail.length) { // All rejected
            appointment.statusToShow = "All Rejected";
          }
        }
        appointment.locationName = "";
        if (appointment.client.service_user_district) {
          appointment.locationName = this.locationsList.filter(x => x.id = Number(appointment.client.service_user_district))[0].name;
        }
      });
    }
  }
  setPage(pageInfo) {
    let page: number = 0;
    if (pageInfo["offset"] !== undefined) {
      page = pageInfo["offset"] + 1;
    } else if (pageInfo["page"] !== undefined) {
      page = pageInfo["page"];
    }
    this.dataToSend.pageNumber = page;
    this.dataToSend.recordPerPage = this.size;
    this.outstandingService.getCompletedMatchAppointmentList(this.dataToSend).subscribe((returnData: GetCompletedMatchAppointmentListObject) => {
      const { success, data, message } = returnData;
      if (success) {
        const { recordPerPage, totalRecords, pages, currentPage } = data;
        this.size = recordPerPage;
        this.totalElements = totalRecords;
        this.totalPages = pages;
        this.pageNumber = currentPage - 1;
        this.appointmentsList = data.data;
        this.setAppointMentData();
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  downLoadCSV() {
    const options = {
      filename: `Completed Matches ${new Date()}`, fieldSeparator: ',', quoteStrings: '"', decimalSeparator: '.', showLabels: true, showTitle: false, useTextFile: false, useBom: true, useKeysAsHeaders: false, headers: [
        "Sr.No.",
        'Receipt Number',
        'Date',
        "Account User Name",
        "Account User Mobile",
        "CareReceiver Name",
        "Charges Per Hour($)",
        "Duration(Hours)",
        "Client Service Fees($)",
        "Caregiver Service Fees($)",
        "Transport Subsidy($)",
        "Total($)"]
    };
    let dataToSend: CSVSendingDataCompletedMatches;
    dataToSend = this.dataToSend;
    dataToSend.requiredCSV = true;
    delete dataToSend.pageNumber;
    delete dataToSend.recordPerPage;
    const csvData: Array<CompletedMatchesCSVData> = [];
    this.outstandingService.getCompletedMatchAppointmentList(dataToSend).subscribe((returnData) => {
      const { success, data } = returnData;
      if (success) {
        if (data.length > 0) {
          data.map((dataInner, index) => {
            dataInner.selectedCaregiver = {};
            if (dataInner.caregiverDetail.length > 0) {
              dataInner.caregiverDetail.map((caregiver) => {
                if (caregiver.status === this.global.bookingStatusAccepted) {
                  dataInner.selectedCaregiver = caregiver;
                }
              });
            }
            dataInner.locationName = "";
            if (dataInner.client.service_user_district) {
              dataInner.locationName = this.locationsList.filter(x => x.id = Number(dataInner.client.service_user_district))[0].name;
            }
            const tempArray: CompletedMatchesCSVData = {
              serialNumber: index + 1,
              receiptNumber: dataInner.receipt_number,
              dateOfAppointment: this.datePipe.transform(dataInner.date, 'yyyy-MM-dd'),
              accountUserName: dataInner.client.first_name + " " + dataInner.client.last_name,
              accountUserMobile: dataInner.client.user.mobile_number,
              careReceiverName: dataInner.client.service_user_firstname + " " + dataInner.client.service_user_lastname,
              cahrgesPerHour: dataInner.selectedCaregiver.caregiver_charges_price,
              duration: dataInner.duration,
              serviceFee: dataInner.selectedCaregiver.client_service_fee,
              caregiverServiceFee: dataInner.selectedCaregiver.caregiver_service_fee,
              transportSubsidy: "",
              total: ""
            };
            tempArray.transportSubsidy = dataInner.transport_subsidy !== null ? dataInner.transport_subsidy : 0;
            tempArray.total = dataInner.selectedCaregiver.total_amount + tempArray.transportSubsidy;
            csvData.push(tempArray);
          });
        }
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(csvData);
      }
    });
  }
}
