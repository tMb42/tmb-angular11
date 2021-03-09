import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  // private loading: boolean = false;
  
  public status: Subject<boolean> = new Subject();

  constructor() { }

  public get loading(): boolean {
    return this.loading;
  }

  public set loading(v: boolean) {
    this.loading = v;
    this.status.next(v);
  }

  public start(): void {
    this.loading = true;
  }

  public stop(): void {
    this.loading = false;
  }

}
