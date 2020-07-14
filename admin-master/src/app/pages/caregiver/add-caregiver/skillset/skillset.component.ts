import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ValidationService } from '../../../../@theme/services/validation.service';
import { Router } from '@angular/router';
import { CaregiverService } from '../../../../@theme/services/caregiver.service';
import { NbToastrService } from '@nebular/theme';
import { GlobalService } from '../../../../@theme/services/global.service';
import { ConstantService } from '../../../../@theme/services/constant.service';
import { NavigationService } from '../../../../@theme/services/navigation.service';
import { GetSkillSet, SkillSetData, CreateSkillsArrayPersonal, TempCreateSkillsArray, AddUpdateSkillsetObject } from '../../../admin.interface';
interface GetUserPersonalInfoObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    caregiver_type: string;
  };
}
@Component({
  selector: 'skillset',
  templateUrl: './skillset.component.html',
  styleUrls: ['./skillset.component.scss']
})
export class SkillsetComponent implements OnInit {
  skillSetForm: FormGroup;
  fb = new FormBuilder();
  currentCaregiverType: string = '0';
  personalCareArray: Array<SkillSetData> = [];
  specialCareArray: Array<SkillSetData> = [];
  registeredNumber: string = '';
  currentUrlSection: string = '';
  profileMode: boolean = false;
  caregiverRegistrationNumber: string = "";
  showMessage: boolean = false;
  constructor(
    private validationService: ValidationService,
    private router: Router,
    private caregiverService: CaregiverService,
    private toastr: NbToastrService,
    public global: GlobalService,
    private constant: ConstantService,
    private navigationService: NavigationService
  ) {
    const parts: object = this.router.url.split("/");
    if (parts[5] && !isNaN(parts[5])) {
      this.caregiverRegistrationNumber = parts[5];
    }
  }
  ngOnInit() {
    this.getUserPersonalInfo();
    this.setSkillSetForm();
  }
  getUserPersonalInfo() {
    this.caregiverService.getUserPersonalInfo(this.caregiverRegistrationNumber).subscribe(
      (returnData: GetUserPersonalInfoObject) => {
        const { success, data } = returnData;
        if (success) {
          const { caregiver_type } = data;
          this.currentCaregiverType = caregiver_type;
          this.getSkills();
          if (caregiver_type === '1' || caregiver_type === '2' || caregiver_type === '3') { // 1==> RN 2==> EN 3 ==> HW
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        }
      }
    );
  }
  setSkillSetForm() {
    this.skillSetForm = new FormGroup({
      self_introduction: new FormControl('', [
        this.validationService.trimValidator,
        this.validationService.wordCountValidator,
      ]),
      skills: new FormControl('', []),
      special_care: new FormArray([]),
      personal_care: new FormArray([]),
    });

    setTimeout(() => {
      this.getSkillSet();
    }, 1000);
  }
  async getSkills() {
    const returnData = await this.caregiverService
      .getSkills(this.currentCaregiverType)
      .toPromise();
    const { success, data } = returnData;
    if (success) {
      if (data.length > 0) {
        data.map((care: SkillSetData) => {
          if (care.type === this.global.personalCareType) {
            this.personalCareArray.push(care);
          } else if (care.type === this.global.specialCareType) {
            this.specialCareArray.push(care);
          }
        });
      } else {
        this.personalCareArray = [];
        this.specialCareArray = [];
      }
    }
    if (this.personalCareArray.length > 0) {
      this.skillSetForm.setControl(
        'personal_care',
        this.createPersonalCare(this.personalCareArray),
      );
    }
    if (this.specialCareArray.length > 0) {
      this.skillSetForm.setControl(
        'special_care',
        this.createSpecialCare(this.specialCareArray),
      );
    }
  }
  createPersonalCare(personalCareInput) {
    if (personalCareInput.length > 0) {
      return this.fb.array(
        personalCareInput.map(i => {
          return this.fb.group({
            name: i.english_title,
            selected: false,
            value: i.id,
          });
        }),
      );
    }
  }
  createSpecialCare(specialCareInput) {
    if (specialCareInput.length > 0) {
      return this.fb.array(
        specialCareInput.map(i => {
          return this.fb.group({
            name: i.english_title,
            selected: false,
            value: i.id,
          });
        }),
      );
    }
  }
  getSkillSet() {
    this.caregiverService.getSkillSet(this.caregiverRegistrationNumber).subscribe(
      (returnData: GetSkillSet) => {
        const { success, data } = returnData;
        if (success) {
          const { skills } = data[0];
          const personalCareFromResponse: Array<SkillSetData> = [];
          const specialCareFromResponse: Array<SkillSetData> = [];
          if (data[0]) {
            this.skillSetForm.patchValue(data[0]);
            skills.map((skillsInner: SkillSetData) => {
              const { type } = skillsInner;
              if (type === this.global.personalCareType) {
                personalCareFromResponse.push(skillsInner);
              } else if (type === this.global.specialCareType) {
                specialCareFromResponse.push(skillsInner);
              }
            });
          }
          this.skillSetForm.patchValue({
            personal_care: this.prefillPersonalCareSelection(
              this.skillSetForm.get('personal_care').value,
              personalCareFromResponse,
            ),
            special_care: this.prefillSpecialCareSelection(
              this.skillSetForm.get('special_care').value,
              specialCareFromResponse,
            ),
          });
        }
      }
    );
  }
  prefillSpecialCareSelection(specialCare, selectedSkills) {
    return specialCare.map(i => {
      const data = selectedSkills.filter(
        x => Number(x.id) === Number(i.value),
      )[0];
      if (data) {
        i.selected = true;
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  prefillPersonalCareSelection(personalCare, selectedSkills) {
    return personalCare.map(i => {
      const data = selectedSkills.filter(
        x => Number(x.id) === Number(i.value),
      )[0];
      if (data) {
        i.selected = true;
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  createSkillsArray() {
    this.skillSetForm.value.personal_care.map((personal: CreateSkillsArrayPersonal, index) => {
      if (personal.selected === true) {
        const tempArray: TempCreateSkillsArray = {};
        tempArray.language = personal.value;
        this.skillSetForm.value.skills.push(personal.value);
      }
    });
    this.skillSetForm.value.special_care.map((special: CreateSkillsArrayPersonal, index) => {
      if (special.selected === true) {
        const tempArray: TempCreateSkillsArray = {};
        tempArray.language = special.value;
        this.skillSetForm.value.skills.push(special.value);
      }
    });
  }
  public addSkillSet() {
    if (!this.skillSetForm.valid) {
      this.validationService.validateAllFormFields(this.skillSetForm);
      return false;
    }
    this.skillSetForm.value.skills = [];
    this.createSkillsArray();
    if (this.skillSetForm.value.skills.length === 0) {
      this.toastr.danger("", this.constant.SELECT_SKILL_ONE);
      return false;
    }
    this.skillSetForm.value.registration_no = this.caregiverRegistrationNumber;
    delete this.skillSetForm.value.personal_care;
    delete this.skillSetForm.value.special_care;
    this.caregiverService.addUpdateSkillSet(this.skillSetForm.value).subscribe(
      (returnData: AddUpdateSkillsetObject) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success("", message);
          this.navigationService.navigateToAvailability(this.caregiverRegistrationNumber);
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.skillSetForm);
          this.validationService.validateAllFormFields(this.skillSetForm);
        }
      },
    );
  }
}
