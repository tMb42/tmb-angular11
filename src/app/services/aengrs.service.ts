import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AEngrs } from '../models/aengrs.model';

const serverUrl = `${environment.baseURL}/aEngineers`;

@Injectable({
  providedIn: 'root'
})
export class AengrsService {

  serverUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAeLatestGradations(data: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/aEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage, gradation_list_wef: data.wef }});
  }

  getAeGradationListByWef(model: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/aeGradation?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/aEngrs/${event}`);
  }

  //------------------------------------------------------------------------------------------------------------------------

  getAeConfirmationDetailsList(pagination: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/confirmation?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, year: pagination.aeConfirmYear }});
  }

  getAeConfirmationListByYear(data: any) {
   return this.http.get<AEngrs[]>(`${serverUrl}/passedYear?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.aeConfirmYear }});
  } 

  getAeSearchData(data: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/confirmationSearch/${data}`);
  }

  //--------------------------------------------------------------------------------------------------

  getAePromotionalCasteDetails(pagination: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/castePromo?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip }});
  }

  getAeCastePromoScopeByPostNo(data: number) {
    return this.http.get<AEngrs[]>(`${serverUrl}/promoCastePosition/${data}`);
  }

  //-----------------------------------------------------------------------------------------------

  getAePromotionalDetails(pagination: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/promoPosition?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip }});
  }
  getCurrentAePromotionalList(data: number) {
    return this.http.get<AEngrs[]>(`${serverUrl}/promoDetails/${data}`);
  }
  getAeSearchablePromoTableData(event: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/promoSearch/${event}`);
  }

  //--------------------------------------------------------------------------------------------------------
  getAeRetirementDetailslList(pagination: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/retirement?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, year: pagination.retireYear, month: pagination.retireMonth }});
  }
  getAeRetirementByYear(data: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/retirement/year?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear }});
  }
  getAeRetirementListByMonth(data: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/retirement/month?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear, month: data.retireMonth }});
  }
  getSearchAeRetireData(event: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/retirement/${event}`);
  }
//-----------------------------------------------------------------------------------------------------------

  
}