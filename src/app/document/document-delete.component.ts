import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Document } from './document';
import { DocumentService } from '../../services/document.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'document-delete-panel',
  templateUrl: './document-delete.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentDeleteComponent implements OnInit {

  document: Document;

  constructor(
    private documentService: DocumentService,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {}

  createDocument(): Document {
    return new Document();
  }

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  defaultSetting(): void {
    this.document = this.createDocument();
  }

  setLayout(): void {
    this.route.params
      .pipe(switchMap((params:Params) => this.documentService.getDocumentJson(+params['id'])))
      .subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let doc = this.createDocument();
          let data = json.data.list[0];

          for (let key in doc) {
            doc[key] = data[key];
          }
          this.document = doc;
        } else {
          console.log(json.msg);

            // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
            if (json.url) {
              this.authService.serverSesstion(json.url);
            }
        }
      });
  }

  deleteGroup(): void {

    let params = {
      id: this.document.id,
      category: this.document.category
    }
    this.documentService.deleteDocument(params)
      .subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          this.goBack();
        } else {
          console.log(json.msg);
        }
      })
  }

  goBack(): void {
    this.location.back();
  }
}