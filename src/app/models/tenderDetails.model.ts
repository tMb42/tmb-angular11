export class TenderDetails {
  id?: number;
  tUnit: string;
  agency: any;
  work_name: any;
  woNo: any;
  work_order_no: string;
  work_order_date: Date;
  commencement_date: Date;
  complitionTime: number;
  comTimeUnit: string;
  complition_time: string;
  actualComplitionDate: Date;
  expectedComplition: string;
  tdNo: number;
  tender_no: any;
  amount_put_tender: number;
  contactual: any;
  tendered_amount: number;
  tenderAuthorityAlias: string;
  tenderAuthority: string;
  authority_office: string;
  authority_designation_id: Number;
  section_id: number;
  secName: string;
  subDivName: string;
  subDivId: number;
  divName: string;
  divnId: number;
  cirName: string;
  cirId: number;
  deptAliasName: string;
  deptName: string;
  department_id: number;
  dlps_id: number;
  dlp: string;
  dlpDays: string;
  financial_year: string;
  remarks: any;
  display: number;
  inforce: number;
  created_at: Date;
  updated_at: Date;
  success?: number;
}

export class TenderedSecurity {
  id?: number;
  agency: any;
  work_name: any;
  commencement_date: Date;
  complition_time: string;
  tender_details_id: number;
  dlp_security_releases_id: number;
  tender_no: any;
  amount_put_tender: number;
  contactual: any;
  tendered_amount: number;
  designation_id: number;
  security_release_date: Date;
  abstract_mb: any;
  dlps_id: number;
  dlpDays: string;
  financial_year: string;
  remarks: any;
  display: number;
  inforce: number;
  created_at: Date;
  updated_at: Date;
  success?: number;
}


export class Dlp {
  id: number;
  defect_liability_period: string;
  dlp_in_days: string;
  display?: number;
  inforce?: number;
  remarks?: any;
  created_at?: Date;
  updated_at?: Date;
}
export class SecurityRules {
  id?: number;
  defect_liability_period: string;
  security_released_period_after: string;
  dlp_in_days: string;
  security_release_percent: number;
  display?: number;
  inforce?: number;
  remarks?: any;
  created_at?: Date;
  updated_at?: Date;
}
