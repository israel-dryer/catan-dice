import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonAlert, IonBackButton,
  IonButton, IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader, IonIcon,
  IonItem, IonLabel,
  IonList, IonNote,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import {PlayService} from "../play.service";
import {PlayerService} from "../../player/player.service";
import {Player, RosterPlayer} from "../../shared/types";
import {liveQuery} from "dexie";
import {SettingsService} from "../../settings/settings.service";
import {state} from "@angular/animations";
import {GameService} from "../../game/game.service";
import {Router} from "@angular/router";
import {addIcons} from "ionicons";
import {informationCircle} from "ionicons/icons";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonCheckbox, IonItem, IonToggle, IonButton, IonLabel, IonAlert, IonButtons, IonBackButton, IonNote, IonIcon]
})
export class SetupPage implements OnInit {

  readonly gameService = inject(GameService);
  readonly playService = inject(PlayService);
  readonly playerService = inject(PlayerService);
  readonly settingsService = inject(SettingsService);
  readonly router = inject(Router);
  players: Player[] = [];

  selectedRosterIds: number[] = [];
  useFairDice = false;
  isSeafarers = false;
  isCitiesKnights = false;
  startRandomPlayer = true;

  constructor() {
    addIcons({informationCircle})
  }

  async ngOnInit() {
    const settings = await this.settingsService.getSettings();
    this.useFairDice = settings!.fairDice === 1;

    liveQuery(() => this.playerService.getActivePlayers())
      .subscribe(players => this.players = players.sort((a, b) => a.lastPlayed > b.lastPlayed ? -1 : 1));
  }

  handleSelectedPlayer(id: number) {
    if (this.selectedRosterIds.includes(id)) {
      // remove player
      this.selectedRosterIds = this.selectedRosterIds.filter(x => x !== id);
    } else {
      if (this.selectedRosterIds.length === 6) {
        // too many players
        return;
      } else {
        // add player
        this.selectedRosterIds.push(id);
      }
    }
  }

  handleFairDiceChanged() {
    this.useFairDice = !this.useFairDice;
  }

  handleCitiesKnightsChanged() {
    this.isCitiesKnights = !this.isCitiesKnights;
  }

  handleSeafarersChanged() {
    this.isSeafarers = !this.isSeafarers;
  }

  handleStartRandomPlayer() {
    this.startRandomPlayer = !this.startRandomPlayer;
  }

  async startGame() {
    localStorage.removeItem('SettlersDice.activeGame');
    const roster: RosterPlayer[] = [];
    this.players.forEach(player => {
      if (this.selectedRosterIds.includes(player.id!)) {
        roster.push({id: player.id!, name: player.name});
      }
    });

    // setup turn index;
    let turnIndex = 0;
    if (this.startRandomPlayer) {
      turnIndex = Math.floor(Math.random() * this.selectedRosterIds.length);
    }

    const game = await this.gameService.createGame(
      this.useFairDice ? 1 : 0,
      roster,
      turnIndex,
      this.isSeafarers ? 1 : 0,
      this.isCitiesKnights ? 1 : 0);

    this.gameService.setActiveGame(game);
    await this.playService.startGame(game);
    await this.router.navigate(['playground'], {replaceUrl: true});
  }


  protected readonly state = state;
}
