import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class AuthenticationService {

  token: string = '';

  constructor(
    private http: HttpAdapterService,
    private router: Router) {

    this.token = this.getToken();
  }

  getToken(): string {

    let user = JSON.parse(localStorage.getItem('currentUser'));
    return (user && user.token) ? user.token : '';
  }

  login(id: string, password: string): Observable<any> {

    let body = {
      user_id: id,
      user_pwd: password
    };

    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('token', 'suxadmin');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post('login-admin', body, {params: params})
      .pipe(map((res: Response) => {
        let user = res.json();

        if (user && user.token) {
          this.token = user.token;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
  }

  logout(): Observable<any> {

    localStorage.removeItem('currentUser');
    this.token = '';

    let body = {}
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post('logout-admin', body, {params: params})
      .pipe(map((res: Response) => {
        let user = res.json() || [];

        return user;
      }));
  }

  register(m: any): Observable<any> {

    let body = m;
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post('register-admin', body, {params: params})
      .pipe(map((res: Response) => {
        let user = res.json();

        return user;
      }));
  }

  serverSesstion(url: string): boolean {

    if (!url) {
      console.log('This URL is not valid');
      return false;
    }

    let matches = url.split('/');
    let reg = /(login-admin)+$/;
    url = matches[matches.length-1];

    if (reg.test(url)) {
      this.router.navigate(['login']);
    }

    return true;
  }
}