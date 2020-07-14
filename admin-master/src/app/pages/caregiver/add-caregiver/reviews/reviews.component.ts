import { Component, OnInit } from "@angular/core";
import {
  DataToSendListComponent,
  GetReviewsResponse,
  ReviewListData,
  DeleteReviewResponseObject,
} from "../../../admin.interface";
import { Router } from "@angular/router";
import { CaregiverService } from "../../../../@theme/services/caregiver.service";
import { NbToastrService } from "@nebular/theme";
import Swal from "sweetalert2";
@Component({
  selector: "reviews",
  templateUrl: "./reviews.component.html",
})
export class ReviewsComponent implements OnInit {
  dataToSend: DataToSendListComponent = {};
  size: number = 10;
  registrationNo: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageNumber: number = 0;
  reviewList: Array<ReviewListData> = [];
  constructor(
    private router: Router,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService
  ) {
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.registrationNo = parts[5];
    }
  }

  ngOnInit() {
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
    this.dataToSend.recordPerPage = this.size;
    this.dataToSend.registration_no = this.registrationNo;
    this.caregiverService
      .getCaregiverReviews(this.dataToSend)
      .subscribe((returnData: GetReviewsResponse) => {
        const { success, data, message } = returnData;
        if (success) {
          const { recordPerPage, totalRecords, pages, currentPage } = data;
          this.size = recordPerPage;
          this.totalElements = totalRecords;
          this.totalPages = pages;
          this.pageNumber = currentPage - 1;
          this.reviewList = data.data;
        } else if (!success) {
          this.toastr.danger("", message);
        }
      });
  }
  deleteThisReview(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.removeFeedback(data.id);
      }
    });
  }
  removeFeedback(reviewID) {
    this.caregiverService
      .removeFeedback(reviewID)
      .subscribe((returnData: DeleteReviewResponseObject) => {
        const { message, success } = returnData;
        if (success) {
          this.toastr.success("", message);
          this.setPage({ offset: 0 });
        } else {
          this.toastr.danger("", message);
        }
      });
  }
}
