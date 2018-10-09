import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { StringUtilService } from '../../libs/utils/string-util.service';

import { HomeService } from '../../services/home.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Member } from '../member/member';
import { Board } from '../board/board';

declare const d3: any;

export class Connecter {

  constructor(
    public yester: number=0,
    public today: number=0,
    public total: number=0,
    public real_yester: number=0,
    public real_today: number=0,
    public real_total: number=0) {}
}

@Component({
  selector: 'home-panel',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit {

  isChartLoaded = false;
  isMemberLoaded = false;
  isBoardLoaded = false;
  chartData: any = [];
  hits: Connecter;
  members: Member[] = [];
  boards: Board[] = [];
  swiper = null;
  timer = null;
  swiperError: any = {
    init: function() {
      this.msg('init');
    },
    slideTo: function() {
      this.msg('slideTo');
    },
    msg: function(str: string) {
      console.log(`There is not a selector's value of Swiper: ${str}`);
    }
  };
  msg: string = '';
  configHitsChart: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboardControl: true,
    scrollbar: '.swiper-scrollbar',
    freeMode: true
  };
  configHitsList: SwiperConfigInterface = {
    direction: 'vertical',
    slidesPerView: 'auto',
    keyboardControl: true,
    scrollbar: '.swiper-scrollbar',
    freeMode: true
  };

  constructor (

    private elementRef: ElementRef,
    private homeService: HomeService,
    private stringUtilService: StringUtilService,
    private authService: AuthenticationService) {}

  createMember(): Member {

    return new Member();
  }

  createBoard(): Board {

    return new Board();
  }

  createConnecter(): Connecter {

    return new Connecter();
  }

  ngOnInit(): void {

    this.hits = this.createConnecter();
    this.homeService.getMainJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        if (json.data && json.data.connecter) {
          let connecter = json.data.connecter;

          for(let key in this.hits) {
            this.hits[key] = connecter[key];
          }
        }
      } else {
        console.log(json.msg);

          // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
    }, err => {
      console.log(err);
    });

    this.homeService.getConnectdayJsonData().subscribe(json => {

      if (json.data && json.data.length > 0) {
        if (json.data.length === 1) {
          let yester = this.stringUtilService.getYesterday(json.data[0].date);
          this.chartData.push({'date': yester, 'real_total_count': 0, 'total_count': 0});
        }

        this.chartData = this.chartData.concat(json.data);
      }

      this.isChartLoaded = true;
    });

    this.homeService.getNewmemberData().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for(let i=0; i<list.length; i++) {
          let m = this.createMember();

          for( let key in m) {
            m[key] = list[i][key];
          }
          this.members.push(m);
        }
      }
      this.isMemberLoaded = true;
    });

    this.homeService.getNewcommentData().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for(let i=0; i<list.length; i++) {
          let b = this.createBoard();

          for( let key in b) {
            b[key] = list[i][key];
          }
          this.boards.push(b);
        }
      }
      this.isBoardLoaded = true;
    });
  }

  ngOnDestroy(): void {

    this.clearTimer();
  }

  initSwiper(): void {

    let swiper = this.getSwiper('.swiper-container');
    swiper.onResize();
  }

  getSwiper(key: string=null): any {

    let selector = this.elementRef.nativeElement.querySelector(key);

    if (!selector) {
      this.swiper = this.swiperError;
    } else {

      if (!this.swiper) {
        this.swiper = selector.swiper;
      }
    }
    return this.swiper;
  }

  slideSwiper(selector: string=null, to:number=0, speed:number=1000): void {

    let swiper = this.getSwiper(selector);
    swiper.onResize();
    swiper.slideTo(to, speed);
  }

  onDrawComplete() {

    let scope = this;
    this.timer = setTimeout(()=>{
      scope.initSwiper();
      scope.slideSwiper('.swiper-container',1, 1000);
      scope.clearTimer();
    }, 500);
  }

  clearTimer(): void {

    if (!this.timer) {
      return;
    }
    clearTimeout(this.timer);
  }
}