import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SEngrs } from '../models/sengrs.model';

const serverUrl = `${environment.baseURL}/sEngineers`;

@Injectable({
  providedIn: 'root'
})

export class SengrsService {

  constructor(private http: HttpClient) { }

  getSeLatestGradations(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/sEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage, gradation_list_wef: data.wef }});
  }

  getSeGradationListByWef(model: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/sEngrs?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/search/${event}`);
  }
 
  //--------------------------------------------------------------------------------------------------

  getSePromotionalCasteDetails(pagination: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/castePromo?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip, designation_id: pagination.designationId }});
  }

  getSeCastePromotionalDetailsByDesignation(pagination: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/casteDesignationWisePromo?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip, designation_id: pagination.designationId }});
  }

  getSeCastePromoScopeByPostNo(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/promoCastePosition/${data.designationId}/${data.scopeNo}`);
  }

  //-----------------------------------------------------------------------------------------------

  getDesignations() {
    return this.http.get<any>(`${serverUrl}/designations`).pipe(
      catchError(this.handleError)
    );
  }
  getSePromotionalDetails(pagination: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/promoDetails?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, skip: pagination.skip, designation_id: pagination.designationId }});
  }
  getCurrentSePromotionalList(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/promoPostion/${data.designationId}/${data.scopeNo}`);
  }
  getSeSearchablePromoTableData(event: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/promoSearch/${event}`);
  }

  //--------------------------------------------------------------------------------------------------------
  getSeRetirementDetailslList(pagination: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/retirement?page=${pagination.page}`, { params: { per_page: pagination.itemsPerPage, designation_id: pagination.designationId, year: pagination.retireYear, month: pagination.retireMonth }});
  }

  retirementListByDesignation(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/retirement/designation?page=${data.page}`, { params: { per_page: data.itemsPerPage, designation_id: data.designationId }});
  }
  getSeRetirementByYear(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/retirement/year?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear, designation_id: data.designationId }});
  }
  getSeRetirementListByMonth(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/retirement/month?page=${data.page}`, { params: { per_page: data.itemsPerPage, year: data.retireYear, month: data.retireMonth, designation_id: data.designationId }});
  }
  getSearchSeRetireData(event: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/retirement/${event}`);
  }
//-----------------------------------------------------------------------------------------------------------

private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }


}
