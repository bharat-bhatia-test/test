import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ClientService } from "../../../@theme/services/client.service";
import { ActivatedRoute } from "@angular/router";
import {
  ColumnMode,
  SelectionType,
} from "../../../../../node_modules/@swimlane/ngx-datatable/esm5/public-api";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ValidationService } from "../../../@theme/services/validation.service";
import Swal from "sweetalert2";
import {
  ClientList,
  DeleteClientData,
  DataToSendListComponent,
  GetClientsListResponseObject,
  DeleteClientResponseObject,
} from "../../admin.interface";
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styles: [],
})
export class ListComponent implements OnInit {
  clientSearchForm: FormGroup;
  dataToSend: DataToSendListComponent = {};
  size: number = 0;
  pageNumber: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  clientList: Array<ClientList> = [];
  selected: Array<ClientList> = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  title: string = "Client List";

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private toastr: NbToastrService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder
  ) {
    this.title = this.route.snapshot.data.title
      ? this.route.snapshot.data.title
      : this.title;
  }
  ngOnInit() {
    this.setSearchForm();
    this.setPage({ offset: 0 });
  }
  fireSwal() {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.deleteClient();
      }
    });
  }
  setSearchForm() {
    this.clientSearchForm = this.formBuilder.group({
      mobile_number: [
        "",
        [
          this.validationService.onlyNumber,
          this.validationService.trimValidator,
        ],
      ],
      email: ["", [this.validationService.emailValidator]],
      is_refferal_fee_due: ["", []],
    });
  }
  clientSearch() {
    const {
      mobile_number,
      email,
      is_refferal_fee_due,
    } = this.clientSearchForm.value;
    if (!this.clientSearchForm.valid) {
      this.validationService.validateAllFormFields(this.clientSearchForm);
      return false;
    }
    if (mobile_number !== "" || mobile_number !== null) {
      this.dataToSend.mobile_number = mobile_number;
    }
    if (is_refferal_fee_due) {
      this.dataToSend.isRefferalFeeDue = is_refferal_fee_due;
    } else {
      this.dataToSend.isRefferalFeeDue = false;
    }
    if (email !== "" || email !== null) {
      this.dataToSend.email = email;
    }
    if (email === null) {
      delete this.dataToSend.email;
    }
    if (mobile_number === null) {
      delete this.dataToSend.mobile_number;
    }
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    let page: number = 0;
    if (pageInfo["offset"] !== undefined) {
      page = pageInfo["offset"] + 1;
    } else if (pageInfo["page"] !== undefined) {
      page = pageInfo["page"];
    }
    this.dataToSend.pageNumber = page;
    this.clientService
      .getClients(this.dataToSend)
      .subscribe((returnData: GetClientsListResponseObject) => {
        const { success, data, message } = returnData;
        if (success) {
          const { recordPerPage, totalRecords, pages, currentPage } = data;
          this.size = recordPerPage;
          this.totalElements = totalRecords;
          this.totalPages = pages;
          this.pageNumber = currentPage - 1;
          this.clientList = data.data;
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
  clearFilter() {
    this.clientSearchForm.reset();
    this.dataToSend = {};
    this.size = 10;
    this.dataToSend.recordPerPage = this.size;
    this.setPage({ offset: 0 });
  }
  deleteClient() {
    const user: Array<number> = [];
    for (let i = 0; i <= this.selected.length - 1; i++) {
      user.push(this.selected[i].user_id);
    }
    const dataToSend: DeleteClientData = {
      user: user,
    };
    this.clientService
      .deleteClient(dataToSend)
      .subscribe((returnData: DeleteClientResponseObject) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success("", message);
        } else if (!success) {
          this.toastr.danger("", message);
        }
        this.setPage({ offset: this.pageNumber });
      });
  }
  onSort(event) {
    this.dataToSend.orderBy = event.sorts[0].prop;
    this.dataToSend.orderDir = event.sorts[0].dir;
    this.setPage({ offset: 0 });
  }
}
