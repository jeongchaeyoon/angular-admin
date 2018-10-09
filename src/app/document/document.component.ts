import { Component, OnInit } from '@angular/core';

import { Document } from './document';
import { DocumentService } from '../../services/document.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'document-panel',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  isDocumentLoaded: boolean = false;
  msg: string = '';
  documents: Document[] = [];
  domainUrl: string = window['sux_resource_url'];

  constructor(
    private documentService: DocumentService,
    private stringUtilService: StringUtilService,
    private authService: AuthenticationService) {}

  createDocument(): Document {
    return new Document();
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {

    this.documentService.getDocumentsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for( let i=0; i<list.length; i++) {
          let doc = this.createDocument();

          for (let key in doc) {
            doc[key] = list[i][key];
          }
          this.documents.push(doc);
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
      this.isDocumentLoaded = true;
    });
  }

  addNewItem( name: string ): void {

    if (!this.validateValue(name)) {
        return;
      }

      let m = this.createDocument();
      m.category = name;
      m.document_name = name;

      this.documentService.createDocument(m).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data.list[0];
          let doc = this.createDocument();

          for( let key in doc) {
            doc[key] = data[key];
          }
          this.documents.unshift(doc);
        } else {
          console.log(json.msg);
          this.msg = json.msg;
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.msg = '페이지 이름을 입력하세요.';
      return false;
    }

    value = value.trim();

    //let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-]{2,13}$/g;
    let reg = /^[a-zA-Z][a-zA-Z0-9_-]{3,30}$/g;
    let result = reg.test(value);

    if (!result) {
      this.msg = '페이지 이름은 최소3 자리 영문, 순자, 언더바(_)만 사용 가능합니다.';
      return false;
    }

    return true;
  }

  resetValidation(): void {
    this.msg = '';
  }
}