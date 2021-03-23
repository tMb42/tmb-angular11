export class AuthUser {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string; 
  gender: string;
  roles?: string; 
  dob: Date; 
  mobile: number;
  photo: string;
  is_departmental: number; 
  is_pwd_engineer: any;   
  department_name: string; 
  department_short_name: string;  
  designation_id: number;  
  department_id: number;  
  designation_name: string;
  designation_alias: string;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  profile_updated_at: Date;
  remarks?: string;
}