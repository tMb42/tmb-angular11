import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tenders } from '../models/tenders';


const serverUrl = `${environment.baseURL}`;

@Injectable({
  providedIn: 'root'
})
export class TendersService {

  constructor(private http: HttpClient) { }

  getAllTenderDetails(data: any) {
    return this.http.get<Tenders[]>(`${serverUrl}/tenders?page=${data.page}`, { params: { per_page: data.itemsPerPage }});
  }

  getSearchTenderDetailsData(event: any) {
    return this.http.get<Tenders[]>(`${serverUrl}/search/${event}`);
  }


}
