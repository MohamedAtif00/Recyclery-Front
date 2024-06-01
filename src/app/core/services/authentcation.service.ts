import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { IAuthInfo } from "../model/user.model";
import { RegisterRequest } from "../model/request/register.model";
import { environment } from "../../../environment";
import { LoginRequest } from "../model/request/login.model";



@Injectable({
    providedIn:'root'
})
export class AuthService {

  //register
  private postRegister:string =`${environment.localhost}Account/ClientRegister`
  private postLogin:string =`${environment.localhost}Account/ClientLogin  `


  private stateItem: BehaviorSubject<IAuthInfo | null> = new BehaviorSubject<IAuthInfo | null>(this.getAuthInfoFromStorage());
  stateItem$: Observable<IAuthInfo | null> = this.stateItem.asObservable();

  constructor(private _http: HttpClient) {}

  login(request:LoginRequest): Observable<IAuthInfo> {
    return this._http.post<IAuthInfo>(this.postLogin,request ).pipe(
      map((response: IAuthInfo) => {
        this.setAuthInfoToStorage(response);
        this.stateItem.next(response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  register(request:RegisterRequest)
  {
    return this._http.post<IAuthInfo>(this.postRegister,request).pipe(
      map(
        (response)=>{
          console.log('From Authentication Service',response);
          this.setAuthInfoToStorage(response);
          this.stateItem.next(response);
          return response;
        }
      )
    )
  }

  logout(): void {
    this.clearAuthInfoFromStorage();
    this.stateItem.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.stateItem.value;
  }

  getAuthToken(): string | null {
    return this.stateItem.value ? this.stateItem.value.token : null;
  }

  private setAuthInfoToStorage(authInfo: IAuthInfo): void {
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
  }

  private getAuthInfoFromStorage(): IAuthInfo | null {
    const authInfo = localStorage.getItem('authInfo');
    return authInfo ? JSON.parse(authInfo) : null;
  }

  private clearAuthInfoFromStorage(): void {
    localStorage.removeItem('authInfo');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}