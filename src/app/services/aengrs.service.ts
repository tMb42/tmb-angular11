import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AengrsService {

  serverUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAeLatestGradations() {
    return this.http.get(`${this.serverUrl}/aEngineers/resource`);
    
  }
  
}