import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { BoardGroup } from './board-group';
import { BoardService } from '../../services/board.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'board-group-delete-panel',
  templateUrl: './board-group-delete.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardGroupDeleteComponent implements OnInit {

  group: BoardGroup;

  constructor(
    private boardService: BoardService,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {}

  createBoardGroup(): BoardGroup {
    return new BoardGroup();
  }

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  defaultSetting(): void {
    this.group = this.createBoardGroup();
  }

  setLayout(): void {
    this.route.params
      .pipe(switchMap((params:Params) => this.boardService.getBoardGroupJson(+params['id'])))
      .subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data.list[0];
          let group = this.createBoardGroup();

          for (let key in group) {
            group[key] = data[key];
          }
          this.group = group;
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
      id: this.group.id,
      category: this.group.category
    };
    this.boardService.deleteBoardGroup(params)
      .subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          this.goBack();
        } else {
          console.log(json.msg);
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}