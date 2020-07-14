import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CaregiverService } from '../../@theme/services/caregiver.service';
import { NbToastrService } from '@nebular/theme';
import { ConstantService } from '../../@theme/services/constant.service';
import { NavigationService } from '../../@theme/services/navigation.service';
@Injectable()
export class ProfileViewResolver implements Resolve<any> {
    registrationNo: number = 0;
    constructor(
        private caregiverService: CaregiverService,
        private toastr: NbToastrService,
        private constant: ConstantService,
        private navigationService: NavigationService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        this.registrationNo = Number(route.params.id);
        if (this.registrationNo && this.registrationNo > 0) {
            this.caregiverService.getUserPersonalInfo(this.registrationNo).subscribe(
                (returnData: any) => {
                    const { success, data } = returnData;
                    if (success) {
                        if (data.user) {
                            if (data.user.is_deleted === 1) {
                                this.toastr.danger("", this.constant.DELETED_CAREGIVER);
                                this.navigationService.navigateToCaregiverList();
                            }
                        }
                    }
                }
            );
        }
    }
}
