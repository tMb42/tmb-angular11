import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment';
import { TenderDetails } from '../models/tenderDetails.model';

const serverUrl = `${environment.baseURL}/recordSection`;

@Injectable({
  providedIn: 'root'
})

export class TendersService {

  tenderDetails: TenderDetails[] = [];
  tenderDetailsSubject = new Subject<TenderDetails[]>();

  constructor(private http: HttpClient) { }

  getAllTenderDetails(data: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/tenderDetails?page=${data.page}`, { params: { per_page: data.itemsPerPage, skip: data.skip}});
  }

  getTenderDetailsById(id: string) {
    return this.http.get<TenderDetails>(`${serverUrl}/tenderDetails/${id}`);
  }

  updateTenderDetails(tenderData: any) {
    return this.http.put(`${serverUrl}/tenderDetails/${tenderData.id}`, tenderData)
    .pipe(catchError(this.handleError), tap((res: any) => {
      const index = this.tenderDetails.findIndex(x => x.id === tenderData.id);
        this.tenderDetails[index] = res.td;
        this.tenderDetailsSubject.next({...this.tenderDetails});
      })
    );
  }


  getSearchTenderDetailsData(event: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/search/${event}`);
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
    return throwError(error);
  }


}
