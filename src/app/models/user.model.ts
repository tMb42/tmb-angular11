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

  get isAdminSuper(){
    return this.roleId == 1;
  }
  get isAdmin(){
    return this.roleId == 2;
  }
  get isUser(){
    return this.roleId == 3;
  }
  get isJuniorEngineer(){
    return this.roleId == 4;
  }
  get isAssistantEngineer(){
    return this.roleId == 5;
  }
  get isExecutiveEngineer(){
    return this.roleId == 6;
  }
  get isSuperindendingEngineer(){
    return this.roleId == 7;
  }
  get isChiefEngineer(){
    return this.roleId == 8;
  }
  get isProgrammer(){
    return this.roleId == 9;
  }
  get isStudent(){
    return this.roleId == 10;
  }
  get isEntrepreneur(){
    return this.roleId == 11;
  }
  get isTechnologist(){
    return this.roleId == 12;
  }
  get isAcademy(){
    return this.roleId == 13;
  }
  get isGuest(){
    return this.roleId == 14;
  }

}