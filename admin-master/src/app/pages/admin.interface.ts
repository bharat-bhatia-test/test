export interface SettingsData {
  id: number;
  title: string;
  value: string;
}
export interface GetSystemSettings extends SettingsData {
  success: boolean;
  message: string;
  status: number;
  data: [SettingsData];
}

export interface LocationObject {
  id: number;
  name: string;
  parent_id: number;
}
export interface CaregiverDetailObject {
  caregiver_booking_id: number;
  caregiver_charges_price: number;
  caregiver_id: number;
  caregiver_service_fee: number;
  client_service_fee: number;
  id: number;
  status: string;
  total_amount: number;
  caregiver: {
    caregiver_type: string;
    chinese_name: string;
    english_name: string;
    hkid_card_no: string;
    id: number;
    nick_name: string;
    registration_no: number;
  };
}
export interface ClientDataObject {
  user_id: number;
  first_name: string;
  home_telephone_number: string;
  id: number;
  last_name: string;
  relation_with_service_user: string;
  service_user_building_name: string;
  service_user_district: string;
  service_user_dob: string;
  service_user_firstname: string;
  service_user_flat_no: string;
  service_user_floor_no: string;
  service_user_lastname: string;
  service_user_salute: string;
  service_user_street_name_number: string;
}
export interface ServiceObject {
  english_title: string;
  id: number;
}
export interface BookingDetailsCaregiverObject {
  caregiver: {
    caregiver_type: string;
    chinese_name: string;
    english_name: string;
    hkid_card_no: string;
    id: number;
    nick_name: string;
    registration_no: number;
  };
  caregiver_booking_id: number;
  caregiver_charges: number;
  caregiver_charges_hour: number;
  caregiver_charges_price: number;
  caregiver_id: number;
  caregiver_service_fee: number;
  client_service_fee: number;
  id: number;
  is_cancelled: number;
  status: string;
  total_amount: number;
}

export interface AppointmentObject
  extends CaregiverDetailObject,
    ClientDataObject,
    ServiceObject,
    BookingDetailsCaregiverObject {
  booking_id: string;
  caregiverDetail: [CaregiverDetailObject];
  selectedCaregiver: BookingDetailsCaregiverObject;
  client: ClientDataObject;
  client_id: number;
  date: string;
  duration: number;
  end_time: string;
  id: number;
  locationName: string;
  payment_status: string;
  showConfirm: boolean;
  start_time: string;
  status: string;
  statusToShow: string;
  transport_subsidy: number;
  services: [ServiceObject];
}

export interface BookingDetailsObject
  extends CaregiverDetailObject,
    ClientDataObject,
    ServiceObject {
  booking_id: string;
  acceptedCaregvier: CaregiverDetailObject;
  caregiverDetail: [CaregiverDetailObject];
  cancelled_by: string;
  client: ClientDataObject;
  client_id: number;
  created_at: string;
  date: string;
  duration: number;
  end_time: string;
  id: number;
  payment_date_caregiver: string;
  payment_date_client: string;
  payment_status_caregiver: string;
  receipt_number: string;
  locationName: string;
  payment_status: string;
  showConfirm: boolean;
  start_time: string;
  status: string;
  statusToShow: string;
  transport_subsidy: number;
  updated_at: string;
  services: [ServiceObject];
}

export interface ConfirmAppointmentData {
  registration_no: number;
  booking_id: string;
  caregiver_booking_details_id: number;
  payment_date_client: string;
}
export interface CancelAppointmentData {
  booking_id: string;
}
export interface RefundAppointmentData {
  booking_id: string;
  payment_status_caregiver: string;
  payment_date_caregiver: string;
}
export interface DateClientPayment {
  booking_id: string;
  payment_status_caregiver: string;
  payment_date_caregiver: string;
  registration_no: number;
}
export interface CompletedMatchesCSVData {
  serialNumber: number;
  receiptNumber: string;
  dateOfAppointment: string;
  accountUserName: string;
  accountUserMobile: string;
  careReceiverName: string;
  cahrgesPerHour: string;
  duration: string;
  serviceFee: string;
  caregiverServiceFee: string;
  transportSubsidy: string;
  total: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  user_type: string;
}
export interface UserObjectCaregiverList {
  due_amount: number;
  email: string;
  id: number;
  is_deleted: number;
  mobile_number: string;
}
export interface CaregiverList extends UserObjectCaregiverList {
  caregiver_type: string;
  chinese_name: string;
  created_at: string;
  english_name: string;
  id: number;
  licence_expiry_date: string;
  nick_name: string;
  registration_no: number;
  status: string;
  user_id: number;
  user: UserObjectCaregiverList;
}

export interface CsvDataToPrintObject {
  serialNumber: number;
  registration_no: number;
  english_name: string;
  email: string;
  mobile_number: string;
}

export interface ReferralData {
  caregivers_reffered: number;
  due: number;
  earned: number;
  paid: number;
}

export interface ReferralSednignData {
  registration_no: number;
}
export interface SubLocationsList {
  id: number;
  name: string;
  parent_id: number;
}
export interface GetLocationList {
  message: string;
  status: number;
  success: boolean;
  data: [LocationList];
}
export interface LocationList extends SubLocationsList {
  id: number;
  name: string;
  subLocations?: [SubLocationsList];
}

export interface AvailabilityObject {
  id: number;
  caregiver_id: number;
  from_day: string;
  from_time: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  to_day: string;
  to_time: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  from_meridian: string;
  to_meridian: string;
}
export interface GetAvailability {
  message: string;
  status: number;
  success: boolean;
  data: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
}
export interface ChargesData {
  account_name: string;
  account_no: string;
  bank_code: string;
  bank_name: string;
  branch_code: string;
  charges: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  fps_mobile_number: string;
  id: number;
  payment_method_cheque: number;
  payment_method_online: number;
}
export interface GetCharges extends ChargesData {
  message: string;
  status: number;
  success: boolean;
  data: ChargesData;
}
export interface ChargesObject {
  id: number;
  hour: number;
  caregiver_id: number;
  price: number;
  value: string;
}

export interface InputArray {
  id: string;
  hour: number;
  price: number;
}
export interface AccountUserData {
  id: number;
  salute: string;
  email: string;
  preferred_communication_language: string;
  mobile_number: string;
  is_deleted: boolean;
  dob: any; // Since Date is considered over here we are converting it from string to object and vice versa taht's why it has been declared as type 'ANY'
}
export interface AccountUser extends AccountUserData {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
  home_telephone_number: string;
  relation_with_service_user: string;
  user_id: string;
  caregiver_type: string;
  english_name: string;
  user: AccountUserData;
  languages: any; // Since Date is considered over here we are converting it from string to object and vice versa taht's why it has been declared as type 'ANY'
  registration_no: number;
  current_step: string;
}
export interface GetAccountUserInfo {
  message: string;
  status: number;
  success: boolean;
  data: AccountUser;
}
export interface SkillSetData {
  id: number;
  type: string;
  english_title: string;
  en_explanation: string;
  ch_explanation: string;
  caregiver_type: string;
}

export interface SkillsData extends SkillSetData {
  id: number;
  self_introduction: string;
  skills: SkillSetData;
}

export interface GetSkillSet extends SkillsData {
  message: string;
  status: number;
  success: boolean;
  data: SkillsData;
}
export interface CaregiverDetail {
  caregiver_booking_id: number;
  client_service_fee: number;
  id: number;
}
export interface CaregiverBooking extends CaregiverDetail {
  cancelled_by: number;
  client_id: number;
  duration: number;
  id: number;
  payment_status: string;
  status: string;
  caregiverDetail: [CaregiverDetail];
}
export interface ClientList extends CaregiverBooking {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  user_id: number;
  caregiverBooking: [CaregiverBooking];
  user: {
    due_amount: number;
    email: string;
    id: number;
    is_deleted: number;
    mobile_number: string;
    status: string;
    total_service_fee: number;
  };
}

export interface DeleteClientData {
  user: Array<number>;
}

export interface SelfcareAbilitiesObject {
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
}

export interface IllnessList {
  english_title: string;
  id: number;
  is_specific: number;
  pivot: { specific_title: string };
}

export interface LocationListObject {
  id: number;
  name: string;
  subLocations: [
    {
      id: number;
      name: string;
      parent_id: number;
    }
  ];
}
export interface Userobject {
  name: string;
}

export interface AppointmentDataObject {
  appointment: string;
  upcomingStatus: string;
}

export interface Jobject {
  id: string;
  selected: boolean;
}

export interface SubGroupObject {
  selected: boolean;
  id: number;
}
export interface MainLocationObject extends SubGroupObject {
  subGroup: [SubGroupObject];
}

export interface FinalObjectCharges {
  price: string;
  id: number;
}

export interface ChargesFromAPIObject {
  caregiver_id: number;
  hour: number;
  id: number;
  price: number;
}
export interface LanguageCheckedObject {
  name: string;
  selected: boolean;
  value: number;
}
export interface DataToSendReferral {
  amount?: number;
  date?: string;
  user_id?: number;
}
export interface CreateSkillsArrayPersonal {
  name: string;
  selected: boolean;
  value: number;
}

export interface CareReciverBackgroundData {
  weight: string;
  height: string;
  diet: string;
  physicalAbility: string;
  eyeSight: string;
  hearing: string;
  lifting: string;
  leftLeg: string;
  rightLeg: string;
  leftHand: string;
  rightHand: string;
  assistingDevices: string;
}
export interface PersonalInfoAcountData {
  salute: string;
  mobile_number: number;
  email: string;
  first_name: string;
  last_name: string;
  relation_with_service_user: string;
  home_telephone_number: string;
  preferred_communication_language: string;
}
export interface PersonalInfoData {
  salute: string;
  first_name: string;
  last_name: string;
  dob: string;
  home_telephone: string;
  mobile: string;
  flat: string;
  floor: string;
  building: string;
  street: string;
  district: string;
}

export interface LocationWithSub extends LocationObject {
  id: number;
  name: string;
  subLocations: [LocationObject];
}
export interface DataToSendListComponent {
  pageNumber?: number;
  recordPerPage?: number;
  email?: string;
  mobile_number?: string;
  start_time?: string;
  end_time?: string;
  caregiver_status?: string;
  isAcceptedByCaregiver?: string;
  expiredWithinMonth?: boolean;
  isRefferalFeeDue?: boolean;
  status?: string;
  caregiver_type?: string;
  due_amount?: string;
  orderBy?: string;
  orderDir?: string;
  payment_status_caregiver?: string;
  registration_no?: number;
}

export interface TempArrayAvailabilityComponent {
  from_day?: string;
  to_day?: string;
  from_time?: string;
  to_time?: string;
  id?: number;
}
export interface TempArrayChargesComponent {
  hour?: string;
  price?: string;
  id?: number;
}

export interface TempArrayLanguageChecked {
  language?: number;
  other_lang?: string;
  client_id?: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
}

export interface TempCreateSkillsArray {
  language?: number;
}

export interface DataToSendTempArray {
  registration_no?: number;
  caregiver_type?: string;
  licence_expiry_date?: string;
  show_employer_option?: string;
  employer?: any; // Type conversion takes place that's why it has been defined as any
  deleted_employer?: Array<Number>;
  deleted_education?: Array<Number>;
  education?: any; // Type conversion takes place that's why it has been defined as any
}

export interface ConstantEducationObject {
  institute_name?: string;
  degree?: string;
  start_year?: string;
  end_year?: string;
  id?: number;
}
export interface ConstantCurrentEmployerObject {
  is_current_employer?: string;
  name?: string;
  work_type?: string;
  from_month?: string;
  from_year?: string;
  id?: number;
}

export interface ConstantPreviousEmployerObject {
  name?: string;
  work_type?: string;
  from_month?: string;
  from_year?: string;
  to_month?: string;
  to_year?: string;
  is_current_employer: string;
  id?: number;
}

export interface ConstObjectData {
  id?: number;
  status?: string;
}

export interface DataToSendForCSVCaregiver {
  caregiver_type?: string;
  email?: string;
  expiredWithinMonth?: boolean;
  isRefferalFeeDue?: boolean;
  mobile_number?: string;
  requiredCSV?: boolean;
  status?: string;
  pageNumber?: number;
  recordPerPage?: number;
}

export interface COmpletedMatchesDataToSend {
  date?: string;
  start_time?: string;
  booking_id?: string;
}

export interface CSVSendingDataCompletedMatches {
  email?: string;
  end_time?: string;
  mobile_number?: string;
  payment_status_caregiver?: string;
  requiredCSV?: boolean;
  start_time?: string;
  pageNumber?: number;
  recordPerPage?: number;
}

export interface SystemSettingCreateObject {
  title?: string;
  value?: number;
  values?: number;
}

export interface DataToSendPersonalINfo {
  caregiver_type?: string;
  chinese_name?: string;
  dob?: string;
  email?: string;
  english_name?: string;
  hkid_card_no?: string;
  language?: [
    {
      name?: string;
      selected?: boolean;
      value?: number;
    }
  ];
  languages?: [
    {
      language?: number;
    }
  ];
  mobile_number?: string;
  nick_name?: string;
  preferred_communication_language?: string;
  registration_no?: string;
  salute?: string;
  refferers_email?: string;
}

export interface LoginResponse {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    accessToken?: {
      refreshToken?: string;
      token?: string;
      type?: string;
    };
    email?: string;
    user_id?: number;
  };
}

export interface AppointmentsFormSubmitResponse {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: string;
    next?: any; // Type conversion takes place that's why it has been defined as any
    pages?: number;
    previous?: any; // Type conversion takes place that's why it has been defined as any
    recordPerPage?: number;
    totalRecords?: number;
    data: [BookingDetailsObject];
  };
}

export interface CancelBookingResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface ResultObjectReturnData {
  message?: string;
  success?: boolean;
}
export interface UpdateAvailabilityObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface AddUpdateChargesObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface AddUpdateCaregiverInfoObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface ReferralAmountPaidDetailsObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface GetReferralDataObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    caregivers_reffered: number;
    due: number;
    earned: number;
    paid: number;
  };
}

export interface AddUpdateSkillsetObject {
  message: string;
  status: number;
  success: boolean;
}

export interface GetWorkInfoReponseObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: [WorkInfoData];
}

export interface WorkInfoData {
  education: Array<object>;
  employer: Array<EmployerObject>;
  id: number;
  licence_expiry_date: any; // Since Date is considered over here we are converting it from string to object and vice versa taht's why it has been declared as type 'ANY'
  show_employer_option?: string;
  previous_employer_details?: any; // In the Initial phase it will be empty then will move object into it that's why it has been declared as 'ANY'
  current_employer_hospital_name?: string;
  current_employer_work_type?: string;
  current_employer_month?: string;
  current_employer_year?: string;
  current_employer_id?: number;
}

export interface EmployerObject {
  caregiver_id: number;
  from_month: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  from_year: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  id: number;
  is_current_employer: string;
  name: string;
  to_month: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  to_year: any; // Multiple time type conversion takes place that's why it has been assigned 'ANY'
  work_type: string;
  company_name?: string;
}

export interface AddUpdateCaregiverWorkInfoObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface GetAllCaregiversResposneObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: number;
    next?: number;
    pages?: number;
    previous?: string;
    recordPerPage?: number;
    totalRecords?: number;
    data: [CaregiverList];
  };
}

export interface DeleteCaregiverResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface ChangeStatusResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface RegisterByAdminResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    registration_no: number;
  };
}

export interface GetClientsListResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: number;
    next?: number;
    pages?: number;
    previous?: string;
    recordPerPage?: number;
    totalRecords?: number;
    data: [ClientList];
  };
}

export interface DeleteClientResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface OtherDevice {
  client_id?: number;
  created_at?: string;
  id?: number;
  other_device?: string;
  specific_drug?: string;
  updated_at?: string;
}

export interface SelfCareAbilities {
  created_at?: string;
  id?: number;
  name?: string;
  parent_id?: number;
  pivot?: {};
  updated_at?: string;
}
export interface GetServiceUserBackgroundResposneObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    assistingDevices?: string;
    diet?: string;
    eyeSight?: string;
    hearing?: string;
    height?: number;
    id?: number;
    languages: [TempArrayLanguageChecked];
    leftHand?: string;
    leftLeg?: string;
    lifting?: string;
    otherDevices: [OtherDevice];
    physicalAbility: null;
    rightHand?: string;
    rightLeg?: string;
    selfCareAbilities: [SelfCareAbilities];
    service_user_assisting_device?: string;
    service_user_diet?: string;
    service_user_eye_sight?: string;
    service_user_hearing?: string;
    service_user_height?: number;
    service_user_lastname?: string;
    service_user_left_hand_mobility?: string;
    service_user_lifting?: string;
    service_user_lifting_specific?: string;
    service_user_lower_left_leg_limb_mobility?: string;
    service_user_lower_right_leg_limb_mobility?: string;
    service_user_physical_ability?: string;
    service_user_right_hand_mobility?: string;
    service_user_weight?: number;
    slug?: string;
    weight?: number;
  };
}
export interface GetServiceUserMedicalHistoryResponse {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    id?: number;
    service_user_other_medical_history?: string;
    slug?: string;
    illness?: [IllnessList];
  };
}

export interface CancelAppointmentResposneObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface RefundAppointmentRsposneObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface ClientPaymentResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface ChangeBookingTimeResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface AddUpdateSystemSettingsResposneData {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface GetOutstandingMatchAppointmentListObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: number;
    next?: number;
    pages?: number;
    previous?: string;
    recordPerPage?: number;
    totalRecords?: number;
    data: [AppointmentObject];
  };
}
export interface GetCompletedMatchAppointmentListObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: number;
    next?: number;
    pages?: number;
    previous?: string;
    recordPerPage?: number;
    totalRecords?: number;
    data: [AppointmentObject];
  };
}

export interface GetBookingDetailsObject {
  message?: string;
  status?: number;
  success?: boolean;
  data?: BookingDetailsObject;
}
export interface ConfirmBookingByAdminResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface CancelAppointmentResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
export interface RefundAppointmentResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface ChangePasswordSendingData {
  user_type?: string;
  id?: string;
  old_password?: string;
  password?: string;
}

export interface AdminChangePasswordResponse {
  message?: string;
  status?: number;
  success?: boolean;
}

export interface GetReviewsResponse {
  message?: string;
  status?: number;
  success?: boolean;
  data?: {
    currentPage?: any;
    next?: any; // Type conversion takes place that's why it has been defined as any
    pages?: number;
    previous?: any; // Type conversion takes place that's why it has been defined as any
    recordPerPage?: number;
    totalRecords?: number;
    data: any;
  };
}

export interface ReviewListData {
  client_id?: number;
  created_at?: string;
  id?: number;
  negative_feedback?: string;
  positive_feedback?: string;
  rating?: number;
  client?: {
    first_name?: string;
    id?: number;
    last_name?: string;
    user_id?: number;
  };
}

export interface DeleteReviewResponseObject {
  message?: string;
  status?: number;
  success?: boolean;
}
