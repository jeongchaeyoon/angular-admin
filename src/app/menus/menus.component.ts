import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Menu } from './menu';
import { MenuService } from '../../services/menu.service';

class CustomMovel {
 constructor(
   public link_name: string = '',
   public link_value: string = ''){};
}

@Component({
  selector: 'menus-panel',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  animations: [
    trigger('menuState', [
      state('default', style({
        top: '0'
      })),
      state('up', style({
        top: '0'
      })),
      state('down', style({
        top: '0'
      })),
      transition('void => *', [
        style({ top: '0' })
      ])
    ])
  ]
})
export class MenusComponent implements AfterViewInit {

  resourceUrl: string = window['sux_resource_url'];

  @ViewChildren('listItems') itemElems: QueryList<ElementRef>;

  isPageLoaded: boolean = false;
  isMenuLoaded: boolean = false;

  customModel: CustomMovel = new CustomMovel();
  gnbMenu:Menu;
  gnbMenus: any[] = [];
  gnbOriginMenus: any[] = [];
  pageMenus: any[] = [];

  jsonBuffers: any = {
    data: null
  };

  // page list
  isCheckedAll: boolean = false;
  isActivePage: boolean = true;
  isActiveCustomPage: boolean = false;
  activePage: string = 'page_list';

  // drag
  menuLimit: number = 5;
  textIndent: number = 30;
  dragTimer: any = null;
  dragX: number = 0;
  dragY: number = 0;

  menusHeight: number[] = [];
  menuGabHeight: number = 25;
  pageCaseHeight: number = 0;
  menuCaseHeight: number = 0;
  isMouseDown: boolean = false;

  startIndex: number = -1;
  dragIndex: number = -1;
  startOffsetY: number = 0;
  dragDepth: number = -1;
  dragStartY: number = 0;
  dragStartX: number = 0;
  dragStartTop: number = 0;
  dragStartPosy: number = 0;
  dragMenuLength: number = 0;
  dragMenuHeight: number = 0;
  dragOldDepth: number = 0;
  oldPosx: number = -1;
  oldPosy: number = -1;

  // validation
  linkTextMsg: string = '';
  linkURLMsg: string = '';
  menuMsg: string = '';

  isEditing: boolean = false;
  isFocusInItem: string = '';

  constructor(
      private elementRef: ElementRef,
      private router: Router,
      private menuService: MenuService) {

    let reg = new RegExp('/+$');

    if (!reg.test(this.resourceUrl)) {
      this.resourceUrl += '/';
    }
  }

  ngAfterViewInit(): void {

    this.loadPages();
    this.loadMenus();

    this.checkLoadedData();
  }

  defaultMenuHeight(): void {

    this.itemElems.changes.subscribe(()=> {
      this.itemElems.toArray().forEach(el => {
        this.menusHeight.push(el.nativeElement.offsetHeight);
      });
    });
  }

  getOffsetTop(nativeEl: any): any {

    if (!nativeEl) return;

    let topValue = 0;
    let parent = nativeEl;

    do {
       topValue += parent.offsetTop;
       parent = parent.parentElement;
    } while (parent.nodeName !== 'BODY' && parent.nodeName === 'DIV');

    return topValue;
  }

  resetMenuHeight(): void {

    setTimeout(()=>{
      this.itemElems.toArray().forEach((el,i) => {
        this.gnbMenus[i].height = el.nativeElement.offsetHeight;
      });

      this.displayMenu();
    }, 0);
  }

  createMenuClass(): Menu {
    return new Menu();
  }

  getLimitLength(arr: any[], limit: number = 1): number {

    let result: number =0;

    if (!arr) {
      return result;
    }

    result = arr.length;
    if (arr.length > limit) {
      result = limit;
    }

    return result;
  }

  loadPages(): void {

    this.menuService.getMenusJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {

        let list = json.data.list;
        let m;
        let menus = [];

        for (let i=0; i<list.length; i++) {
          m = this.createMenuClass();

          for (let key in m) {

            if (list[i][key]) {
              m[key] = list[i][key];
            }
          }

          menus.push(m);
        }

        this.pageMenus = menus;

        if (this.pageMenus.length === 0) {
          return;
        }
      } else {

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
        let reg = /login-admin$/i;

        if (reg.test(json.url) === true) {
          this.router.navigate(['/login-admin']);
        }
      }
      this.isPageLoaded = true;
    });
  }

  loadMenus():void {

    this.menuService.getGnbJson().subscribe(json => {

      if (json.data && json.data.list && json.data.list.length > 0) {
        this.setupGnbMenus(json.data.list);
        this.resetMenuHeight();
      }
      this.isMenuLoaded = true;
    });
  }

  setupGnbMenus(list: Menu[]): void {

    this.gnbMenus = this.cloneMultyArray(list);
    this.gnbOriginMenus = this.cloneMultyArray(list);
  }

  checkLoadedData(): void {

    if (this.isPageLoaded !== true && this.isMenuLoaded !== true) {
      let timer = setTimeout(this.checkLoadedData, 30);
      return;
    }

    this.checkDisabledMenu();
  }

  checkDisabledMenu(): void {

    let disabledTimer = setTimeout(()=>{

      if (this.gnbMenus.length > 0 && this.pageMenus.length > 0) {

        for (let i=0; i<this.gnbMenus.length; i++) {
          let isDisabled = true;

          for (let k=0; k<this.pageMenus.length; k++) {

            if ((this.gnbMenus[i].category === this.pageMenus[k].category) &&
                  this.gnbMenus[i].module_name !== 'customize' ) {
              isDisabled = false;
              break;
            }
          }

          this.gnbMenus[i].disabled = isDisabled;
        }

        clearTimeout( disabledTimer );
      } else {
        this.checkDisabledMenu();
      }
    }, 30);
  }

  cloneMultyArray(  list: any[], cloneArr: any[] = [] ): any[] {

    for (let i=0; i<list.length; i++) {
      let m = this.createMenuClass();

      for (let key in m) {

        if (list[i][key]) {
          m[key] = list[i][key];
        }
      }

      cloneArr.push(m);

      if (list[i].sub && list[i].sub.length > 0) {
        this.cloneMultyArray(list[i].sub,  cloneArr);
      }
    }

    return cloneArr;
  }

  cloneSingleArray( list: any[], cloneArr: any[] = []): any[] {

   for (let i=0; i<list.length; i++) {
      let m = this.createMenuClass();

      for (let key in m) {
        m[key] = list[i][key];
      }

      m.sub = null;
      cloneArr.push(m);
    }

    return cloneArr;
  }

  addPageToMenu(): void {

    this.menuMsg = '';

    for (let i=0; i<this.pageMenus.length; i++) {
      if (this.pageMenus[i].isChecked === true) {
        this.addMenu(this.pageMenus[i]);
      }
    }
  }

  createCustomPage( link_name: string, link_value: string ): void {

    if (!this.validateMenuName(link_name)) {
      return;
    }

    if (!this.validateLinkValue(link_value)) {
      return;
    }

    this.customModel.link_name = '';
    this.customModel.link_value = '';

    let params = {
      menu_name: link_name
    };

    let date = new Date();
    let m = this.createMenuClass();
    m.id = date.getTime();
    m.depth = 1;
    m.menu_name = link_name;
    m.module_name = 'customize';
    m.posy = -1;
    m.url = link_value;

    this.addMenu(m);
  }

  /*deletePage(m: Menu): void {

    let params = {
      'id': m.id
    };

    this.menuService.deleteMenu(params).subscribe(json=>{
      let index = this.getIndex(this.pageMenus, params.id);

      if (index > -1) {
        this.pageMenus.splice(index, 1);
        this.menuCaseHeight = this.getLimitLength(this.pageMenus, this.menuLimit) * this.menuHeight;

        if (this.pageMenus.length === 0) {
          return;
        }

        this.timer = setTimeout(() => {
          this.resizeSwiperPagelist();
        }, 0);
      }
    });
  }*/

  addMenu( menu: Menu): void {

    this.isEditing = true;

    for (let i = this.gnbMenus.length - 1; i >= 0; i--) {

      if (this.gnbMenus[i].menu_name === menu.menu_name) {
        this.menuMsg += "[ " + menu.menu_name + " ] 메뉴는 이미 추가되었습니다.\n";
        return;
      }
    }

    let m = this.createMenuClass();

    for (let key in m) {
      m[key] = menu[key];
    }

    this.gnbMenus.push(m);

    this.resetMenuHeight();
    this.displayMenu();
  }

  modifyMenu( menu: Menu ): void {
    this.router.navigate(['/menu-modify', menu.id]);
  }

  removeMenu( menu: Menu ): void {

    let menuName: string = '';

    for (let i = this.gnbMenus.length - 1; i >= 0; i--) {
      menuName =  this.gnbMenus[i].menu_name;

      if (menuName === menu.menu_name) {
        let menuPiece = this.gnbMenus.splice(i, 1);
        menuPiece[0] = null;
      }
    }    // end of for

    this.displayMenu();
  }

  getValidationElement(target:any): any {

    let parentEl = target;
    let reg = /list_draggable_item/gi;
    let checkCount= 0;
    let MAX_COUNT = 3;

    if (parentEl && parentEl.nodeName.toUpperCase() === 'DIV' &&
          parentEl.className && reg.test(parentEl.className)) {

      return parentEl;
    }

    do {
      parentEl = parentEl.parentElement;

      if (parentEl && parentEl.nodeName.toUpperCase() === 'DIV' &&
          parentEl.className && reg.test(parentEl.className)) {

        return parentEl;
      }

      checkCount++;
    } while(checkCount < MAX_COUNT);

    return null;
  }

  getTargetElement(target: any, loop: number = 1, search: any = ''): any {

    let parent = target;
    let reg = null;

    if (search !== '') {
      reg = new RegExp( search, 'gi');
    }

    if (loop > 1) {

      for (let i=1; i<loop; i++) {
        parent = parent.parentElement;

        if (reg && parent && parent.nodeName &&
            reg.test(parent.nodeName.toUpperCase()) === true) {

           return parent.nodeName;
        }
      }    // end of for
    }    // end of if

    return parent.nodeName;
  }

  getClientX(e): number {

    if (e.clientX ) {
      return e.clientX;
    } else if (e.targetTouches) {
      return e.targetTouches[0].clientX;
    }
  }

  getClientY(e): number {

    if (e.clientY ) {
      return e.clientY;
    } else if (e.targetTouches) {
      return e.targetTouches[0].clientY;
    }
  }

  startTimer(): void {

    this.dragTimer = setInterval(() => {
      this.moveMenu(this.dragY,  this.dragX);
    }, 30);
  }

  stopTimer(): void {

    clearInterval(this.dragTimer);
  }

  selectedEl: any = null;

  onDragListener(e): void {

    switch (e.type) {

      case "mousedown":
      case "touchstart":

        let isButton = this.getTargetElement(e.target, 2, 'button');

        if (isButton === 'BUTTON') {
          return;
        }

        this.selectedEl = this.getValidationElement(e.target);

        if (this.selectedEl === null) {
          return;
        }

        let key = this.selectedEl.getAttribute('data-key');

        key = parseInt(key);
        this.downMenu(e, key);
        break;

      case "mousemove":
      case "touchmove":

        if (this.selectedEl && this.isEditing === true) {
          e.preventDefault();
        }

        this.dragX = this.getClientX(e);
        this.dragY = this.getClientY(e);
        this.moveMenu(this.dragY, this.dragX);
        break;

      case "mouseup":
      case "touchend":

        if (this.isFocusInItem !== '' && this.isFocusInItem === 'BUTTON') {
          this.resetValidation();
        }

        this.isFocusInItem = this.getTargetElement(e.target, 1);
        this.upMenu(e);
        break;

      default:
        break;
    }
  }

  downMenu(e: any, index: number): void {

    if (this.isEditing === false) return;

    let clientX = e.clientX || e.targetTouches[0].clientX;
    if (!this.validateNumber(clientX)) {
      clientX = 0;
    }

    let clientY = e.clientY || e.targetTouches[0].clientY;
    if (!this.validateNumber(clientY)) {
      clientY = 0;
    }

    // 미정
    this.startOffsetY = e.offsetY;

    this.startIndex = index;
    this.dragIndex = index;
    this.dragStartY = clientY;
    this.dragStartX = clientX;
    this.dragStartTop = 0;
    //this.dragMenuHeight = 0;
    this.isMouseDown = true;
    this.gnbMenus[this.dragIndex].isDragging = true;
    this.dragOldDepth = this.dragDepth = this.gnbMenus[index].depth;
    this.dragStartPosy = this.gnbMenus[index].posy;
    this.dragMenuHeight =this.gnbMenus[index].height;

    let depthIndex = this.gnbMenus[index].depth;

    this.gnbMenus[index].margin_left = 0;
    this.gnbMenus[index].padding_left = 5;

    for (let i=0; i<this.gnbMenus.length; i++) {

      if (this.dragIndex < i && this.gnbMenus[i].depth > this.gnbMenus[this.dragIndex].depth) {
        let depthGab = this.gnbMenus[i].depth-depthIndex;

        this.dragMenuLength++;
        this.dragMenuHeight +=this.gnbMenus[i].height;

        this.gnbMenus[i].isDragging = true;
        this.gnbMenus[i].margin_left = -1*this.textIndent*depthGab;
        this.gnbMenus[i].padding_left = this.textIndent*depthGab+5;
      }

      if (this.dragIndex < i && this.gnbMenus[i].depth <= this.gnbMenus[this.dragIndex].depth) {
        break;
      }
    }
    this.resetState(this.gnbMenus);
  }

  moveMenu(clientY: number, clientX: number ): void {

    if (this.isMouseDown !== true || this.isEditing !== true) return;

    if (this.validateNumber(clientY) !== true || this.validateNumber(clientX) !== true) return;

    if (this.oldPosy === clientY && this.oldPosx === clientX) return;

    let direct = clientY - this.oldPosy;
    let distY = clientY - this.dragStartY;
    let dragGab = 0;

    dragGab = this.getDragGab(direct);

    // for align
    for (let i=0; i<this.gnbMenus.length; i++) {
      if (this.gnbMenus[i].isDragging === true) {
        this.gnbMenus[i].posy = this.dragStartPosy + distY + dragGab + i*1;
      }
    }

    //console.log('startP', this.dragStartPosy, 'prevItem', this.gnbMenus[3].posy, 'distY', distY,  'gab', dragGab);
    this.displayMenu(direct);
    this.changeDraggingIndex(distY, clientX, clientY);
    this.changeDepth(clientX);

    // real top position
    for (let i=0; i<this.gnbMenus.length; i++) {
      if (this.gnbMenus[i].isDragging === true) {
        this.gnbMenus[i].top = this.dragStartTop + distY;
        //console.log(this.dragStartTop + distY, this.dragStartTop, distY);
      }
    }

    this.oldPosx = clientX;
    this.oldPosy = clientY;
    this.dragOldDepth = this.dragDepth;
  }

  upMenu(e): void {

    if (this.gnbMenus) {
      for (let i=0; i<this.gnbMenus.length; i++) {
        this.gnbMenus[i].isDragging = false;
      }
    }

    this.dragMenuLength = 0;
    this.dragIndex = -1;
    this.isMouseDown = false;
    this.oldPosy = -1;

    this.repositionY(this.gnbMenus);
  }

  getDragGab(direct:number): number {

    let dragGab = 0;

    if (direct > 0) {
      //console.log('down');
      dragGab = this.dragMenuHeight - this.menuGabHeight ;
    } else if (direct < 0) {
      //console.log('up');
      dragGab = -1*this.menuGabHeight;
    }

    return dragGab;
  }

  changeDepth(clientX: number): void {

    let direction = clientX - this.dragStartX;

    for (let i=0; i<this.gnbMenus.length; i++) {

      if (this.gnbMenus[i].isDragging === true && this.gnbMenus[this.dragIndex-1]) {

        let currentDepth = this.gnbMenus[this.dragIndex].depth;
        let prevDepth = this.gnbMenus[this.dragIndex-1].depth;
        let distx = Math.abs(clientX - this.dragStartX);

        if (direction > 0 && distx > this.textIndent && prevDepth >= currentDepth) {
          let len = this.dragIndex + this.dragMenuLength;

          for (let k=this.dragIndex; k<=len; k++) {

           if (this.gnbMenus[k].isDragging === true) {
             //console.log( this.gnbMenus[k].menu_name );
             this.gnbMenus[k].depth += 1;
           }
          }

          if (this.dragIndex === i) {
           //console.log('++1');
           this.dragDepth += 1;
           this.dragStartX += this.textIndent;
          }

          break;

        } else if (direction < 0 && distx > this.textIndent && currentDepth > 1 &&
                      this.dragDepth > 1) {

          let len = this.dragIndex + this.dragMenuLength;

          for (let k=this.dragIndex; k<=len; k++) {
            this.gnbMenus[k].depth -= 1;
          }

          if (this.dragIndex === i) {
           //console.log('--1');
           this.dragDepth -= 1;
           this.dragStartX -= this.textIndent;
          }

          break;
        }
      }    // end of if
    }    // end of for
  }

  changeDraggingIndex(posy:number, clientX:number, clientY:number): void {

    let direction = 0;
    let depthGab = 0;
    let frontIndex = 0;
    let behindIndex = 0;
    let itemTop = 0;

    if (this.dragOldDepth !== this.dragDepth) {
      return;
    }

    for (let i=0; i<this.gnbMenus.length; i++) {

      if (this.gnbMenus[i].isDragging === true && this.dragIndex !== i &&
          this.gnbMenus[i].depth === this.dragDepth) {

        direction = i - this.dragIndex;
        this.dragIndex = i;

        if (direction < 0) {

          /**
           * 마우스 드래그 위치 문제
           * 이슈 : 드래그 속도가 클 경우 index번호를 건너뛰는 문제 발생
           * 해결 : 드래그 시 선택 아이템 전 index번호 만큼 높이를 반복해서 더해줌
           */

          if (this.startIndex < i) {
            //console.log( 'drag process : top ==> bottom ==> top' );
            behindIndex = i-1;

            for (let k=this.startIndex; k<=behindIndex; k++) {
              itemTop += -1*this.gnbMenus[ k ].height;
            }

          } else {
            //console.log( 'drag process : bottom ==> top ==> bottom' );
            behindIndex = i+1+this.dragMenuLength;

            for (let k=behindIndex; k<=this.startIndex+this.dragMenuLength; k++) {

              if (this.gnbMenus[ k ] && this.gnbMenus[ k ].height) {
                itemTop += this.gnbMenus[ k ].height;
              }
            }
          }

          this.dragStartTop = itemTop;

          // X Depth
          for (let k=0; k<this.gnbMenus.length; k++) {

            if (this.dragIndex < k && this.gnbMenus[k].isDragging !== true) {

              if (this.gnbMenus[this.dragIndex-1]) {
                depthGab =  this.gnbMenus[this.dragIndex].depth - this.gnbMenus[this.dragIndex-1].depth;
              }

              // reset global depth
              if (depthGab > 1) {
                this.dragDepth -= 1;
                this.dragStartX -= this.textIndent;
              }

              if (this.dragIndex === 0 && this.gnbMenus[this.dragIndex].depth > 1) {
                //console.log('up');

                this.dragDepth = 1;
                this.dragStartX = clientX - this.textIndent;
              }

              this.gnbMenus[k].state = 'up';
              //console.log('up');
              break;
            }
          }    // end of for

          if (this.dragIndex !== 0 && depthGab > 1) {

            for (let k=0; k<this.gnbMenus.length; k++) {

              if (this.gnbMenus[k].isDragging === true ) {
                this.gnbMenus[k].depth -= 1;
              }
            }
          }

          // reset depth
          if (this.dragIndex === 0 && this.gnbMenus[this.dragIndex].depth > 1) {

            for (let k=0; k<this.gnbMenus.length; k++) {

              if (this.gnbMenus[k].isDragging === true ) {
                this.gnbMenus[k].depth -= 1;
              }
            }
          }

        } else if (direction > 0) {

          /**
           * 마우스 드래그 위치 문제
           * 이슈 : 드래그 속도가 클 경우 index번호를 건너뛰는 문제 발생
           * 해결 : 드래그 시 선택 아이템 전 index번호 만큼 높이를 반복해서 더해줌
           */

          frontIndex = i-1;
          itemTop = 0;

          //console.log( 'drag process : top ==> bottom ==> top' );
          if (this.startIndex < i) {

            for (let k=this.startIndex; k<i; k++) {
              itemTop += -1*this.gnbMenus[ k ].height;
            }

          //console.log( 'drag process : bottom ==> top ==> bottom' );
          } else {

            for (let k=i+1+this.dragMenuLength; k<=this.startIndex+this.dragMenuLength; k++) {
              itemTop += this.gnbMenus[ k ].height;
            }
          }

          this.dragStartTop = itemTop;

          for (let k=this.gnbMenus.length-1; k>=0; k--) {

            if (this.dragIndex > k && this.gnbMenus[k].isDragging !== true) {
              this.gnbMenus[k].state = 'down';
              //console.log('down');
              break;
            }
          }    // end of for


          let nextIndex = this.dragIndex - 1;
          let prevDepth = 0;

          if (this.gnbMenus[nextIndex]) {
            depthGab =  this.gnbMenus[this.dragIndex].depth - this.gnbMenus[nextIndex].depth;
          }

          prevDepth = depthGab - 1;

          // reset global depth
          if (depthGab > 1) {
            //console.log('down');
            this.dragDepth -= prevDepth;
            this.dragStartX -= this.textIndent*prevDepth;
          }

          // reset depth
          for (let k=this.gnbMenus.length-1; k>=0; k--) {

            if (this.gnbMenus[k].isDragging == true && depthGab > 1) {
              //console.log('depthCount--');
              this.gnbMenus[k].depth -= prevDepth;
            }
          }
        }    // end of if
      }    // end of if
    }    // end of for
  }

  displayMenu(direction:number=0): void {

    let disty = 0;
    let prevIndex = this.dragIndex-1;
    let nextIndex = this.dragIndex+this.dragMenuLength+1;
    let dragLastIndex = this.dragIndex+this.dragMenuLength;

    if (direction < 0 && this.gnbMenus[ prevIndex ]) {
      disty = this.gnbMenus[this.dragIndex].posy - this.gnbMenus[ prevIndex ].posy;

      if (disty <= 0) {

        for (let i=0; i<this.gnbMenus.length; i++) {

          if (this.gnbMenus[i].isDragging === true) {
            this.gnbMenus[ prevIndex ].posy += this.gnbMenus[i].height;
          }
        }
      }
      //console.log('up');
    } else if (direction > 0 && this.gnbMenus[ nextIndex ]) {

      disty = this.gnbMenus[nextIndex].posy - this.gnbMenus[dragLastIndex].posy;

      if (disty <= 0) {

        for (let i=0; i<this.gnbMenus.length; i++) {

          if (this.gnbMenus[i].isDragging === true) {
            this.gnbMenus[ nextIndex ].posy -= this.gnbMenus[i].height;
          }
        }
      }
      //console.log('down');
    }

    this.sortArr(this.gnbMenus);
    this.repositionY(this.gnbMenus);
  }

  editJson(): void {

    this.isEditing = !this.isEditing;
    this.resetMenuHeight();
  }

  cancelJson(): void {

    this.isEditing = false;
    this.gnbMenus = this.cloneSingleArray(this.gnbOriginMenus);
  }

  saveJson(): void {

    this.outputJson();
    this.gnbMenus = this.cloneMultyArray(this.jsonBuffers.data);
    this.gnbOriginMenus = this.cloneMultyArray(this.jsonBuffers.data);

    let params = {
      data: JSON.stringify(this.jsonBuffers)
    };

    this.menuService.saveJson(params).subscribe(json => {
      alert(json.msg);

      this.isEditing = !this.isEditing;
    });
  }

  outputJson(): void {

    let copyMenus: any[] = this.cloneSingleArray(this.gnbMenus);
    let resultMenus: any[] = [];
    let menuHistory: any[] = [];
    let prevItem: any = null;
    let prevDepth: number =1;

    this.jsonBuffers.data = null;

    // 실제 출력될 json 파일 구성하기
    for (let i=0; i<copyMenus.length; i++) {
      let item = copyMenus[i];

      if (prevDepth < item.depth) {
        prevItem.sub = [];
        prevItem.sub.push(item);
        menuHistory.push(prevItem.sub);
      } else if (prevDepth > item.depth) {
        let gabDepth = prevDepth - item.depth;

        for (let i=0; i<gabDepth; i++) {
          menuHistory.pop();
        }
        menuHistory[menuHistory.length-1].push(item);
      } else if (prevDepth === item.depth) {

        if (menuHistory.length === 0) {
          resultMenus.push(item);
          menuHistory.push(resultMenus);
        } else {
          menuHistory[menuHistory.length-1].push(item);
        }
      }

      prevItem = item;
      prevDepth = item.depth;
    }

    this.jsonBuffers.data = resultMenus;
  }

  // common
  sortArr(arr: any[]): any[] {

    return arr.sort(function(a, b) {
      return a.posy-b.posy;
    });
  }

  getIndex(list: any[], id: number): number {

    for (let i=0; i<list.length; i++) {
      if (list[i].id === id ) {
        return i;
      }
    }
    return -1;
  }

  resetState(arr:any[]) {

    for(let i=0; i<arr.length; i++) {
      arr[i].state = 'default';
    }
  }

  repositionY(arr:any[]): void {

    let posy = 0;

    for(let i=0; i<arr.length; i++) {
      arr[i].posy = posy;

      if (arr[i].isDragging === false) {
        arr[i].top = 0;
      }

      posy += arr[i].height;
    }
  }

  changeCheck(): void {

    let bool = true;

    for (let i=0; i<this.pageMenus.length; i++) {

      if (this.pageMenus[i].isChecked === false) {
        bool = false;
        break;
      }
    }

    this.isCheckedAll = bool;
  }

  // page list
  changeCheckAll(): void {

    for (let i=0; i<this.pageMenus.length; i++) {
      this.pageMenus[i].isChecked = this.isCheckedAll;
    }
  }

  togglePagePanel(): void {

    this.activePage = 'page_list';
    this.isActivePage = !this.isActivePage;

    if (this.isActiveCustomPage === true) {
      this.isActiveCustomPage = !this.isActiveCustomPage;
    }
  }

  toggleCustomPagePanel(): void {

    this.activePage ='custom_link';
    this.isActiveCustomPage = !this.isActiveCustomPage;

    if (this.isActivePage === true) {
      this.isActivePage = !this.isActivePage;
    }
  }

  toggleItemInfoPanel( menu ): void {

    if (this.isEditing === false) {
      this.isEditing = !this.isEditing;
      this.resetMenuHeight();
    }

    menu.isPanelInfo = !menu.isPanelInfo;
  }

  // common
  validateMenuName(value: any): boolean {

    if (value === '') {
      this.linkTextMsg = '링크 텍스트가 필요합니다.';
      return false;
    }

    value = value.trim();

    let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-\s]{2,13}$/g;
    let result = reg.test(value);

    if (!result) {
      this.linkTextMsg = '링크 텍스트가 올바르지 않습니다.';
      return false;
    }

    return true;
  }

  validateLinkValue(value: any): boolean {

    if (value === '') {
      this.linkURLMsg = '링크 주소가 필요합니다.';
      return false;
    }

    return true
  }

  resetValidation(): void {

    this.linkTextMsg = '';
    this.linkURLMsg = '';
    this.menuMsg = '';
    this.isFocusInItem = '';
  }

  validateNumber(value: any): boolean {

    return !isNaN(value);
  }
}