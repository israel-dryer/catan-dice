import {Component, computed, inject, model} from '@angular/core';
import {Game} from "../../../shared/types";
import {IonIcon, IonRippleEffect, IonText} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {calendarClear, ellipse, dice, ellipseOutline, personCircle, timer} from "ionicons/icons";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../game.service";

@Component({
  selector: 'app-game-detail-card',
  templateUrl: './game-detail-card.component.html',
  styleUrls: ['./game-detail-card.component.scss'],
  imports: [
    IonIcon,
    IonText,
    DatePipe,
    IonRippleEffect
  ]
})
export class GameDetailCardComponent {

  game = model<Game>();

  gameTitle = computed(() => this.formatGameTitle(this.game()));
  gameRolls = computed(() => this.formatGameRolls(this.game()));
  gameDuration = computed(() => this.formatGameDuration(this.game()));

  readonly gameService = inject(GameService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  constructor() {
    addIcons({ellipse, dice, ellipseOutline, calendarClear, timer, personCircle})
  }

  formatGameTitle(game?: Game) {
    if (!game) {
      return 'Catan Classic';
    }
    let title = 'Catan Classic';

    if (game.isCitiesKnights) {
      title = 'Cities & Knights';
    }
    if (game.isSeafarers) {
      if (game.isCitiesKnights) {
        title += ', Seafarers';
      } else {
        title = 'Seafarers';
      }
    }
    return title;
  }

  formatGameRolls(game?: Game) {
    if (!game) {
      return '0 rolls';
    }
    return game.rollCount.toLocaleString() + ' rolls';
  }

  formatGameDuration(game?: Game) {
    if (!game) {
      return '0 mins';
    }
    return (game.duration / 60).toFixed(0) + ' mins';
  }

  async handleItemClicked() {
    const game = this.game();
    if (game) {
      this.gameService.setActiveGame(game);
    }
    await this.router.navigate(['game-detail']);
  }

}
