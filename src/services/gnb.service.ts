import { Injectable } from '@angular/core';
import { Http, Headers, Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { HttpAdapterService } from '../libs/utils/http-adapter.service';


@Injectable()
export class GnbService {

  state: boolean = false;

  constructor(private http: HttpAdapterService) {}

  getGnbMenus(): Observable<any> {

    let url = `assets/data/gnb_admin.php`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, { params: params})
      .pipe(map(res => res.json() as any));
  }
}
