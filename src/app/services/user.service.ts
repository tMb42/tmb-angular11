import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Users } from '../models/user.model';

const serverUrl = `${environment.baseURL}/users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  getAll(data: any) {
    return this.http.get<Users[]>(`${serverUrl}?page=${data.page}&per_page=${data.per_page}`);
  }

  getById(id: string) {
    return this.http.get<Users>(`${serverUrl}/${id}`);
  }

  create(id: string, params: any) {
    return this.http.post(`${serverUrl}/${id}`, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${serverUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${serverUrl}/${id}`);
  }

}
