import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaregiverService } from '../../../@theme/services/caregiver.service';
import { ColumnMode, SelectionType } from '../../../../../node_modules/@swimlane/ngx-datatable/esm5/public-api';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective } from '@angular/forms';
import { ValidationService } from '../../../@theme/services/validation.service';
import { NbIconLibraries } from '@nebular/theme';
import Swal from 'sweetalert2';
import { ExportToCsv } from 'export-to-csv';
import { CaregiverList, CsvDataToPrintObject, DataToSendListComponent, ConstObjectData, DataToSendForCSVCaregiver, GetAllCaregiversResposneObject, DeleteCaregiverResponseObject, ChangeStatusResponseObject } from '../../admin.interface';
@Component({
  selector: 'list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  @ViewChild("closeButton", { static: false })
  closeButton: ElementRef;
  caregiverSearchForm: FormGroup;
  changeStatusForm: FormGroup;
  size: number = 0;
  title: string = 'Caregiver List';
  pageNumber: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  caregiver_type: Array<String> = ["RN", "EN", "HW", "PCW", "Outpatient Escort Person"];
  status: Array<String> = ["Pending", "Approved", "Unapproved"];
  caregiverList: Array<CaregiverList> = [];
  selected: Array<CaregiverList> = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  dataToSend: DataToSendListComponent = {};

  caregiverType: object = [
    { id: 1, name: 'Registered Nurse' },
    { id: 2, name: 'Enrolled Nurse' },
    { id: 3, name: 'Health Worker' },
    { id: 4, name: 'Personal Care Worker' },
    { id: 5, name: 'Out-Patient Escort' }
  ];
  showOneMonthLeft: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private iconsLibrary: NbIconLibraries,
    private dialogService: NbDialogService,

  ) {
    this.iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    this.title = this.route.snapshot.data.title ? this.route.snapshot.data.title : this.title;
    this.pageNumber = 0;
    this.size = 10;
  }

  ngOnInit() {
    this.setSearchForm();
    this.setPage({ offset: 0 });
    this.setChangeStatusForm();
  }
  fireSwal() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteCaregiver();
      }
    });
  }
  caregiverSearch() {
    if (!this.caregiverSearchForm.valid) {
      this.validationService.validateAllFormFields(this.caregiverSearchForm);
      return false;
    }
    this.dataToSend = {};
    const { expired_within_month, is_refferal_fee_due, status, caregiver_type, mobile_number, email, due_amount } = this.caregiverSearchForm.value;
    this.dataToSend.expiredWithinMonth = false;
    if (expired_within_month) {
      this.dataToSend.expiredWithinMonth = expired_within_month;
    }
    if (is_refferal_fee_due) {
      this.dataToSend.isRefferalFeeDue = is_refferal_fee_due;
    } else {
      this.dataToSend.isRefferalFeeDue = false;
    }
    if (status) {
      this.dataToSend.status = status;
    }
    if (caregiver_type) {
      this.dataToSend.caregiver_type = caregiver_type;
    }
    if (mobile_number) {
      this.dataToSend.mobile_number = mobile_number;
    }
    if (email) {
      this.dataToSend.email = email;
    }
    if (due_amount) {
      this.dataToSend.due_amount = due_amount;
    }
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  clearFilter(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.caregiverSearchForm.reset();
    this.showOneMonthLeft = false;
    this.caregiverSearchForm.patchValue({
      status: "",
      caregiver_type: "",
    });
    this.dataToSend = {};
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  showHideOneMonth(event) {
    if (event.target.value === "1" || event.target.value === "2") {
      this.showOneMonthLeft = true;
    } else {
      this.showOneMonthLeft = false;
    }
  }
  setSearchForm() {
    this.caregiverSearchForm = this.formBuilder.group({
      status: new FormControl('', []),
      caregiver_type: new FormControl('', []),
      mobile_number: ['', [
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
      ]],
      email: ['', [this.validationService.emailValidator]],
      expired_within_month: ['', []],
      is_refferal_fee_due: ['', []],
    });
  }
  openPopup(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      {});
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
    this.caregiverService.getAllCaregivers(this.dataToSend).subscribe((returnData: GetAllCaregiversResposneObject) => {
      const { success, data, message } = returnData;
      if (success) {
        const { recordPerPage, totalRecords, pages, currentPage } = data;
        this.size = recordPerPage;
        this.totalElements = totalRecords;
        this.totalPages = pages;
        this.pageNumber = currentPage - 1;
        this.caregiverList = data.data;
      } else if (!success) {
        this.toastr.danger("", message);
      }
    });
  }
  getRowClass(row): string {
    return "row-color";
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  deleteCaregiver() {
    const user: Array<number> = [];
    for (let i = 0; i <= this.selected.length - 1; i++) {
      user.push(this.selected[i].user_id);
    }
    const dataToSend = {
      user: user
    };
    this.caregiverService.deleteCaregiver(dataToSend).subscribe((returnData: DeleteCaregiverResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
      } else if (!success) {
        this.toastr.danger("", message);
      }
      this.setPage({ offset: 0 });
    });
  }
  onSort(event) {
    this.dataToSend.orderBy = event.sorts[0].prop;
    this.dataToSend.orderDir = event.sorts[0].dir;
    this.setPage({ offset: 0 });
  }
  setChangeStatusForm() {
    this.changeStatusForm = this.formBuilder.group({
      changeStatus: new FormControl('', [])
    });
  }
  changeStatus() {
    const caregiver = [];
    for (let i = 0; i <= this.selected.length - 1; i++) {
      const obj: ConstObjectData = {
        id: this.selected[i].id,
        status: this.changeStatusForm.value.changeStatus
      };
      caregiver.push(obj);
    }
    const dataToSend = {
      caregiver: caregiver
    };
    this.caregiverService.changeStatus(dataToSend).subscribe((returnData: ChangeStatusResponseObject) => {
      const { success, message } = returnData;
      if (success) {
        this.toastr.success("", message);
        this.setPage({ offset: 0 });
        (<HTMLInputElement>document.getElementById("closeButton")).click();
      } else if (!success) {
        (<HTMLInputElement>document.getElementById("closeButton")).click();
        this.toastr.danger("", message);
      }
    }, err => {
      if (err.statusCode === 500) {
        this.toastr.danger("", "Onboarding Steps not completed for Caregiver");
      }
      (<HTMLInputElement>document.getElementById("closeButton")).click();
    });
  }
  downLoadCSV() {
    const options = {
      filename: `Caregiver List ${new Date()}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ["Sr.No.", "Registered No.", 'Caregiver name', 'Caregiver email', "Caregiver mobile number"]
    };
    let dataToSend: DataToSendForCSVCaregiver = {};
    dataToSend = this.dataToSend;
    dataToSend.requiredCSV = true;
    delete dataToSend.pageNumber;
    delete dataToSend.recordPerPage;
    const csvDataToPrint: Array<CsvDataToPrintObject> = [];
    this.caregiverService.getAllCaregivers(dataToSend).subscribe((returnData) => {
      const { success, data } = returnData;
      if (success) {
        if (data.length > 0) {
          data.map((dataInside, index) => {
            const tempArray = {
              serialNumber: index + 1,
              registration_no: dataInside.registration_no,
              english_name: dataInside.english_name !== null ? dataInside.english_name : "",
              email: dataInside.user.email !== null ? dataInside.user.email : "",
              mobile_number: dataInside.user.mobile_number !== null ? dataInside.user.mobile_number : ""
            };
            csvDataToPrint.push(tempArray);
          });
        }
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(csvDataToPrint);
      }
    });
  }
}
