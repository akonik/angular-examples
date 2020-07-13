import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private currentUserLocalStorageKey = "app_current_user";

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.currentUserLocalStorageKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public login(login: string, password: string) {
    this.http.post<any>("api_endpoint", { login, password })
      .pipe(map(user => {
        localStorage.setItem(this.currentUserLocalStorageKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  public logout() {
    localStorage.removeItem(this.currentUserLocalStorageKey);
    this.currentUserSubject.next(null);
  }

  public get isAuthenticated() {
    return this.currentUserValue != null;
  }

}
