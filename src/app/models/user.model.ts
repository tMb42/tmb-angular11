import { Roles } from "./role.model";

export class Users {
  id!: string;
  firstName!: string; 
  middleName!: string; 
  lastName!: string; 
  name!: string; 
  email!: string;
  // dob!: Date;
  // designation_id: number;
  // department_id: number;
  role!: Roles;
  isDeleting: boolean = false;
  static map: any;

  constructor(
    public personName: string,
    private token: string, 
    public roleId: number
  ){}

  get authKey(){
    if (this.token){
      return this.token;
    }else {
      return null;
    }
  }

  get isAuthenticated(){
    if (this.token){
      return true;
    }else{
      return false;
    }
  }

  

}