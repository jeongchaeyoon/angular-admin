import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { BoardGroup } from './board-group';
import { BoardSkin } from './board-skin';
import { BoardService } from '../../services/board.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'board-group-modify-panel',
  templateUrl: './board-group-modify.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardGroupModifyComponent implements OnInit {

  groups: BoardGroup[] = [];
  group: BoardGroup = null;
  skins: BoardSkin[] = [];

  private levels = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  createBoardGroup(): BoardGroup {
    return new BoardGroup();
  }

  createBoardSkin(): BoardSkin {
    return new BoardSkin();
  }

  defaultSetting(): void {

    for (let i=0; i<=10; i++) {
      this.levels.push(i);
    }

    this.group = this.createBoardGroup();
  }

  setLayout(): void {
    this.boardService.getBoardGroupsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for( let i=0; i<list.length; i++) {
          let group = this.createBoardGroup();

          for( let key in group) {
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
    });

    this.boardService.getBoardSkinsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for (let i=0; i<list.length; i++) {
          let skin = this.createBoardSkin();
          skin['skin_path'] = list[i]['file_name'];
          this.skins.push(skin);
        }
      } else {
        console.log(json.msg);
      }
    });

    this.route.params.pipe(switchMap((params: Params) => this.boardService.getBoardGroupJson(+params['id'])))
    .subscribe( json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];
        let group = this.createBoardGroup();

        for( let key in group) {
          group[key] = data[key];
        }

        // 서버쪽에서 기본 값이 정의 되어 있지 않을 경우 처리
        group.skin_path = group.skin_path !== '' ? group.skin_path : 'default';
        group.board_type = group.board_type !== '' ? group.board_type : 'text';
        this.group = group;
      } else {
        console.log(json.msg);
      }
    });
  }

  onSubmit(): void {

    this.boardService.modifyBoardGroup(this.group).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];

        for( let key in this.group) {
          this.group[key] = data[key];
        }

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