import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment';
import { TenderDetails } from '../models/tenderDetails.model';

const serverUrl = `${environment.baseURL}/recordSection`;

@Injectable({
  providedIn: 'root'
})

export class TendersService {

  tenderDetails: TenderDetails[] = [];
  tenderDetailsSubject = new Subject<TenderDetails[]>();

  constructor(private http: HttpClient) {
   this.http.get(`${serverUrl}/tendDetails`).subscribe((response: any) => {
      this.tenderDetails = response.authTenderDetails.data;
      this.tenderDetailsSubject.next([...this.tenderDetails]);
    });

  }

  getTenderDetailsUpdateListener() {
    return this.tenderDetailsSubject.asObservable();
  }

  getAllTenderDetails(data: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/tendDetails?page=${data.page}`, { params: { per_page: data.itemsPerPage, skip: data.skip}});
  }

  getTenderDetailsById(id: number) {
    return this.http.get<TenderDetails>(`${serverUrl}/tendDetails/${id}`);
  }

  updateTenderDetails(tenderData: any) {
    return this.http.put(`${serverUrl}/tendDetails/${tenderData.id}`, tenderData)
    .pipe(catchError(this.handleError), tap((res: any) => {
      const index = this.tenderDetails.findIndex(x => x.id === tenderData.id);
        this.tenderDetails[index] = res.td;
        this.tenderDetailsSubject.next({...this.tenderDetails});
        console.log(index);
      })
    );
  }


  getSearchTenderDetailsData(event: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/search/${event}`);
  }

  getAllSectionAsPerAuthUserForTenderDetails() {
    return this.http.get(`${serverUrl}/workingSections`).pipe(
      catchError(this.handleError)
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
    return throwError(error);
  }


}
