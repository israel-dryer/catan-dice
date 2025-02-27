import {Component, computed, input} from '@angular/core';
import {IonInput, IonItem, IonLabel, IonList} from "@ionic/angular/standalone";
import {Player} from "../../../shared/types";

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonInput,
    IonLabel,
  ]
})
export class PlayerSummaryComponent {

  player = input.required<Player>();
  lastPlayed = computed(() => this.formatLastPlayed(this.player()));
  hoursPlayed = computed(() => this.formatHoursPlayed(this.player()));
  totalRolls = computed(() => this.formatTotalRolls(this.player()));
  gamesPlayed = computed(() => this.formatGamesPlayed(this.player()));
  gamesWon = computed(() => this.formatGamesWon(this.player()));
  winRate = computed(() => this.formatWinRate(this.player()));
  longestWinStreak = computed(() => this.formatLongestWinStreak(this.player()));
  fastestWin = computed(() => this.formatFastestWin(this.player()));
  robberRate = computed(() => this.formatRobberRate(this.player()));

  formatLastPlayed(player: Player) {
    return player.lastPlayed === 0 ? 'Never' : new Date(player.lastPlayed).toLocaleString()
  }

  formatHoursPlayed(player: Player) {
    return ((player.secondsPlayed / 60) / 60).toFixed(1) + ' hours';
  }

  formatTotalRolls(player: Player) {
    return player.totalRolls.toFixed(0);
  }

  formatGamesPlayed(player: Player) {
    return player.gamesPlayed.toFixed(0);
  }

  formatGamesWon(player: Player) {
    return player.gamesWon.toFixed(0);
  }

  formatWinRate(player: Player) {
    return (player.gamesPlayed === 0 ? '0%' : (player.gamesWon / player.gamesPlayed).toLocaleString(undefined, {
      style: 'percent',
      maximumFractionDigits: 1
    }));
  }

  formatLongestWinStreak(player: Player) {
    return player.longestWinsStreak.toFixed(0);
  }

  formatFastestWin(player: Player) {
    return (player.fastestWinSeconds / 60).toFixed(1) + ' minutes';
  }

  formatRobberRate(player: Player) {
    return (player.totalRolls === 0 ? '0%' : (player.robberRolls / player.totalRolls).toLocaleString(undefined, {
      style: 'percent',
      maximumFractionDigits: 1
    }));
  }
}
