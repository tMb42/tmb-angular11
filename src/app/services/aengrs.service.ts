import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AEngrs } from '../models/aengrs.model';

const serverUrl = `${environment.baseURL}/aEngineers`;

// export interface PostResponseData{
//   success: number;
//   assistantEngineers: AEngrs;
// }

@Injectable({
  providedIn: 'root'
})
export class AengrsService {

  serverUrl = environment.baseURL;

  aEngrs: AEngrs[] = [];
  aeSubject = new Subject<AEngrs[]>(); 

  constructor(private http: HttpClient) 
    {
      this.http.get(`${serverUrl}/aEngrs`).subscribe((response: any) => {
        this.aEngrs = response.assistantEngineers.data;
        this.aeSubject.next([...this.aEngrs]);
      });
    }

  getAeUpdateListener() {
    return this.aeSubject.asObservable();    
  }

  getAeLatestGradations(data: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/aEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage, gradation_list_wef: data.wef }});
  }

  getAeGradationListByWef(model: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/aeGradation?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<AEngrs[]>(`${serverUrl}/search/${event}`);
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
  getAeDetailsById(id: string) {
    return this.http.get<AEngrs>(`${serverUrl}/aEngrs/${id}`);
  }

  aeUpdateDataById(data: any) {
    return this.http.put(`${serverUrl}/aEngrs/${data.id}`, data)
    .pipe(catchError(this.handleError), tap((res: any) => {
      const index = this.aEngrs.findIndex(x => x.id === data.id);
        this.aEngrs[index] = res.ae;
        this.aeSubject.next([...this.aEngrs]);
         console.log('fff',index);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

}