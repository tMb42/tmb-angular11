import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JEngrs } from '../models/jengrs.model';

const serverUrl = `${environment.baseURL}/jEngineers`;


@Injectable({
  providedIn: 'root'
})
export class JengrsService {

  jEngrs: JEngrs[] = [];
  jeSubject = new Subject<JEngrs[]>(); 

  constructor(private http: HttpClient) {
    this.http.get(`${serverUrl}/jEngrs`).subscribe((response: any) => {
      this.jEngrs = response.juniorEngineer.data;
      this.jeSubject.next([...this.jEngrs]);
    });

  }

  getJeUpdateListener() {
    return this.jeSubject.asObservable();    
  }

  getJeLatestGradations(data: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/jEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage }});
  }

  getJeGradationListByWef(model: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/jEngrs?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<JEngrs[]>(`${serverUrl}/search/${event}`);
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

  getJeDetailsById(id: string) {
    return this.http.get<JEngrs>(`${serverUrl}/jEngrs/${id}`);
  }

  jeUpdateDataById(data: any) {
    return this.http.put(`${serverUrl}/jEngrs/${data.id}`, data)
    .pipe(catchError(this.handleError), tap((res: any) => {
      const index = this.jEngrs.findIndex(x => x.id === data.id);
        this.jEngrs[index] = res.je;
        this.jeSubject.next([...this.jEngrs]);
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