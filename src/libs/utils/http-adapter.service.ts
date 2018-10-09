import { Injectable } from '@angular/core';
import { Http, Jsonp, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpAdapterService {

	domainUrl: string = window['sux_resource_url'];
	isFullDomain: boolean = false;

	constructor(
		private http: Http,
		private jsonp: Jsonp) {

		let reg = new RegExp(/^(http\:\/\/|https\:\/\/)?((\w+[.]\w+)+([.]\w+)?)|(localhost)+/);
		if (reg.test(this.domainUrl) === true) {
			this.isFullDomain = true;
		}

		reg = new RegExp('/+$');
		if (!reg.test(this.domainUrl)) {
			this.domainUrl += '/';
		}
	}

	getRequestOptions() {
		let headers: Headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', '*/*');
		headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		headers.append('Access-Control-Allow-Origin','*');

		return new RequestOptions({headers: headers});
	}

	get(url: string, option: any=this.getRequestOptions()): Observable<any> {

		url = this.domainUrl + url;

		if (this.isFullDomain === true) {
			if (option.params.get('callback')) {
				option.params.set('callback','JSONP_CALLBACK');
			}
			return this.jsonp.get(url, option);
		} else {
			return this.http.get(url, option);
		}
	}

	post(url: string, body: any=null, option: any=this.getRequestOptions()): Observable<any> {

		url = this.domainUrl + url;

		if (this.isFullDomain === true) {
			if (option.params.get('callback')) {
				option.params.set('callback','JSONP_CALLBACK');
			}

			if (body) {
				for(let key in body) {
					option.params.set(key, body[key]);
				}
			}
			return this.jsonp.get(url, option);
		} else {
			return this.http.post(url, body, option);
		}
	}

	delete(url: string, option: any=this.getRequestOptions()): Observable<any> {
		return this.http.delete(url, option);
	}
}