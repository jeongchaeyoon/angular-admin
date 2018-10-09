import { Injectable } from '@angular/core';
import { Http, Jsonp, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Document } from '../app/document/document';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class DocumentService {

  constructor( private http: HttpAdapterService) { }

  getDocumentsJson(): Observable<any> {

    let url = `document-admin/list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params}).pipe(map(req => req.json() as any));
  }

  getDocumentSkinListJson(): Observable<any> {

    let url = `document-admin/skin-list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getTemplateResource(tmpl: string, mode: string): Observable<any> {

    let url = `document-admin/template-resource`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('template', tmpl);
    params.set('template_mode', mode);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getDocumentJson(id: number): Observable<any> {

    let str_id: string = id + '';
    let url = `document-admin/list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', str_id);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getDocumentModifyJson(id: string): Observable<any> {

    let url = `document-admin/modify-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  createDocument(json: any): Observable<any> {

    let url = `document-admin/add`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }

  modifyDocument(json: any): Observable<any> {

    let url = `document-admin/modify`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map((res:Response) => res.json() as any));
  }

  deleteDocument(json: any): Observable<any> {

    let url = `document-admin/delete`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }
}