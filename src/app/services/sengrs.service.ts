import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SEngrs } from '../models/sengrs.model';

const serverUrl = `${environment.baseURL}/sEngineers`;

@Injectable({
  providedIn: 'root'
})
export class SengrsService {

  constructor(private http: HttpClient) { }

  getSeLatestGradations(data: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/sEngrs?page=${data.page}`, { params: { per_page: data.itemsPerPage }});
  }

  getSeGradationListByWef(model: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/sEngrs?page=${model.page}`, { params: { per_page: model.itemsPerPage, gradation_list_wef: model.wef }});
  }

  getSearchData(event: any) {
    return this.http.get<SEngrs[]>(`${serverUrl}/search/${event}`);
  }


}

