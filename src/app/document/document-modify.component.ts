import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Document } from './document';
import { DocumentService } from '../../services/document.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'document-modify-panel',
  templateUrl: './document-modify.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentModifyComponent implements OnInit {

  document: Document;
  skinList: any[] = [];
  tabList: string[] = ['tpl','css','js'];
  activeTab: string = 'tpl';

  private levels = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private authService: AuthenticationService) {}

  createDocument(): Document {
    return new Document();
  }

  ngOnInit(): void {

    this.defaultSetting();
    this.getDocument();
  }

  defaultSetting(): void {
    this.document = this.createDocument();
  }

  getDocument(): void {

    this.route.params.pipe(switchMap((params: Params) => this.documentService.getDocumentModifyJson(params['id']))).subscribe( json => {

      console.log(json);

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];
        let doc = this.createDocument();

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

    this.documentService.getDocumentSkinListJson()
        .subscribe(json => {

          let data = json.data;
          this.skinList = data;
        });
  }

  modifyDocument(): void {

    this.documentService.modifyDocument(this.document).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let doc = this.createDocument();
        let data = json.data.list[0];

        for (let key in doc) {
          doc[key] = data[key];
        }
        this.document = doc;
        this.goBack();
      } else {
        console.log(json.msg);
      }
    });
  }

  changeTemplate(): void {

    this.documentService.getTemplateResource(this.document.template_type, this.document.template_mode).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {

        if (json.data) {
          for(let key in json.data) {
            this.document[key] = json.data[key];
          }
        }
      }
    });
  }

  swapContentTab(e: any, type: string): void {

    e.preventDefault();
    this.activeTab = type;
  }

  goBack(): void {
    this.location.back();
  }
}