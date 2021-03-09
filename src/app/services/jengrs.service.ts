import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JEngrs } from '../models/jengrs.model';

const serverUrl = `${environment.baseURL}/jEngineers`;


@Injectable({
  providedIn: 'root'
})
export class JengrsService {

  constructor(private http: HttpClient) { }

  getJeLatestGradations(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/jEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage }});
  }

  getJeGradationListByWef(model: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/jEngrs?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/jEngrs/${event}`);
  }

  //-----------------------------------------------------------------------------------------------

  getJePromotionalDetails(pagination: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/promoDetails?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip }});
  }
  getCurrentJePromotionalList(data: number) {
    return this.http.get<JEngrs[]>(`${serverUrl}/promoPostion/${data}`);
  }
  getJeSearchablePromoTableData(event: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/promoSearch/${event}`);
  }

  //-------------------------------------------------------------------------------------------------

  getJePassedList(pagination: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/departPassed?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, allotBatch: pagination.pscBatch, passingBatch: pagination.pscPassedBatch }});
  }

  getJePscBatchByYear(data: any) {
   return this.http.get<JEngrs[]>(`${serverUrl}/pscAllot?page=${data.page}`, { params: { per_page: data.itemsPerPage, allotBatch: data.pscBatch }});
  } 

  getJePscPassingBatchBySession(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/pscPassed?page=${data.page}`, { params: { per_page: data.itemsPerPage, passingBatch: data.pscPassedBatch }});
  } 

  getJeSearchData(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/departPassedSearch/${data}`);
  }

  //--------------------------------------------------------------------------------------------------

  getJePromotionalCasteDetails(pagination: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/castePromo?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip }});
  }

  getJeCastePromoScopeByPostNo(data: number) {
    return this.http.get<JEngrs[]>(`${serverUrl}/promoCastePosition/${data}`);
  }

  //--------------------------------------------------------------------------------------------------

  getJeRetirementDetailslList(pagination: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/retirement?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, year: pagination.retireYear, month: pagination.retireMonth }});
  }
  getJeRetirementByYear(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/retirement/year?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear }});
  }
  getJeRetirementListByMonth(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/retirement/month?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear, month: data.retireMonth }});
  }

  getSearchJeRetireData(event: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/retirement/${event}`);
  }

//-----------------------------------------------------------------------------------------------------------


}
