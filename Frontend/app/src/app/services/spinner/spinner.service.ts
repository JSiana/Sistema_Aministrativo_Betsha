import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {


  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> =
    this.loadingSubject.asObservable();
  show(): void {
    this.loadingSubject.next(true);
  }
  hide(): void {
    this.loadingSubject.next(false);
  }
}

