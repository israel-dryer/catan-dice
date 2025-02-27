import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, viewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment, IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import {ViewWillEnter} from '@ionic/angular';
import {Game, Roll} from "../../shared/types";
import {Router} from "@angular/router";
import {liveQuery} from "dexie";
import {GameService} from "../../game/game.service";
import {GameRollsComponent} from "../../game/components/game-rolls/game-rolls.component";
import {GameHistogramComponent} from "../../game/components/game-histogram/game-histogram.component";
import Swiper from "swiper";

@Component({
  selector: 'app-play-detail',
  templateUrl: './play-detail.page.html',
  styleUrls: ['./play-detail.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonSegment, IonSegmentButton, IonLabel, GameRollsComponent, GameHistogramComponent, GameRollsComponent, GameHistogramComponent]
})
export class PlayDetailPage implements ViewWillEnter, OnInit, AfterViewInit {

  readonly swiperContainer = viewChild.required<ElementRef>('swiperContainer');
  activeGame?: Game;
  rolls: Roll[] = [];
  selectedSegment = 0;

  readonly router = inject(Router);
  readonly gameService = inject(GameService);

  constructor() {

  }

  async ngOnInit() {
    this.activeGame = await this.gameService.getActiveGame();
    this.rolls = await this.gameService.getRollsByGameId(this.activeGame?.id!);

    liveQuery(() => this.gameService.getGame(this.activeGame?.id!))
      .subscribe(async game => {
        this.activeGame = game;
        if (game) {
          const _rolls = await this.gameService.getRollsByGameId(game?.id!);
          // convert the id to a roll count then sort in reverse order.
          _rolls.forEach((r, index) => r.id = index + 1);
          _rolls.reverse();
          this.rolls = _rolls
        }
      });
  }

  ngAfterViewInit() {
    this.swiperContainer().nativeElement.addEventListener('swiperslidechange', (e: any) => {
      this.selectedSegment = e.detail[0].activeIndex;
    });
  }

  async ionViewWillEnter() {
    this.activeGame = await this.gameService.getActiveGame();
  }


  handleSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    (this.swiperContainer().nativeElement.swiper as Swiper).slideTo(event.detail.value);
  }

}
