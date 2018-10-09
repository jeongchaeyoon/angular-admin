import { Component, OnInit } from '@angular/core';

import { BoardGroup } from './board-group';
import { BoardService } from '../../services/board.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'board-group-panel',
  templateUrl: './board-group.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardGroupComponent implements OnInit {

  isBoardLoaded: boolean = false;
  msg: string = '';
  groups: BoardGroup[] = [];
  isEmptyInputValue: boolean = true;
  domainUrl: string = window['sux_resource_url'];

  constructor(
    private boardService: BoardService,
    private stringUtilService: StringUtilService,
    private authService: AuthenticationService) {}

  createBoardGroup(): BoardGroup {

    return new BoardGroup();
  }

  ngOnInit(): void {

    this.boardService.getBoardGroupsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for( let i=0; i<list.length; i++) {
          let group = this.createBoardGroup();

          for (let key in group) {
            group[key] = list[i][key];
          }
          this.groups.push(group);
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
      this.isBoardLoaded = true;
    });
  }

  addNewItem( name: string ): void {

    if (!this.validateValue(name)) {
        return;
      }

      let group = this.createBoardGroup();
      group.category = name;
      group.board_name = name;

      this.boardService.createBoardGroup(group).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data[0];
          let group = this.createBoardGroup();

          for (let key in group) {
            group[key] = data[key];
          }
          this.groups.unshift(group);
        } else {
          console.log( json.msg );
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.isEmptyInputValue = false;
      this.msg = '게시판 그룹 이름을 입력해주세요.';
      return false;
    }

    value = value.trim();

    let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,13}$/g;
    let result = reg.test(value);

    if (!result) {
      this.isEmptyInputValue = false;
      this.msg = '게시판 그룹 영문 이름이 올바르지 않습니다.';
      return false;
    }

    this.isEmptyInputValue = true;
    return true;
  }

  resetValidation(): void {
    this.isEmptyInputValue = true;
  }
}