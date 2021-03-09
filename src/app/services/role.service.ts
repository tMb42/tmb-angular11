import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Roles } from '../models/role.model';

const serverUrl = `${environment.baseURL}/roles`;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  constructor(private http: HttpClient) { }

  getAllRole(data: any) {
    return this.http.get<Roles[]>(`${serverUrl}?page=${data.page}`, { params: { per_page: data.itemsPerPage, skip: data.skip }});
  }

  getSearchData(event: any) {
    return this.http.get<Roles[]>(`${serverUrl}/${event}`);
  }

  getById(id: string) {
    return this.http.get<Roles>(`${serverUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(serverUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${serverUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${serverUrl}/${id}`);
  }

}
