import {Component, OnInit} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonRouterLink,
  IonIcon,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  AlertController,
  IonCard,
  IonCardTitle,
  IonCardHeader, IonCardContent
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {GameListPage} from "../game/game-list/game-list.page";
import {GameSummaryCardComponent} from "../game/components/game-summary-card/game-summary-card.component";
import {liveQuery} from "dexie";
import {GameService} from "../game/game.service";
import {PlayerService} from "../player/player.service";
import {addIcons} from "ionicons";
import {checkbox, squareOutline} from "ionicons/icons";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonContent, IonButton, IonRouterLink, RouterLink, IonIcon, IonLabel, IonToolbar, IonTitle, IonBackButton, IonButtons, GameListPage, GameSummaryCardComponent, IonCard, IonCardTitle, IonCardHeader, IonCardContent, NgIf],
})
export class HomePage implements OnInit {

  playerCount = 0;
  gameCount = 0;

  constructor(
    gameService: GameService,
    private router: Router,
    private playerService: PlayerService,
    private alertController: AlertController) {

    addIcons({checkbox, squareOutline});

    // subscribe to changes in game and player counts; this will trigger the welcome message on the home page
    liveQuery(() => gameService.getGameCount())
      .subscribe(gameCount => this.gameCount = gameCount);
    liveQuery(() => playerService.getPlayerCount())
      .subscribe(playerCount => this.playerCount = playerCount);
  }

  async ngOnInit() {
    const _playerCount = await this.playerService.getPlayerCount();

    const createMorePlayersAlert = await this.alertController.create({
      header: 'Create players',
      message: 'Two or more players are required to start tracking a new game',
      buttons: [{text: 'Ok', role: 'submit'}]
    });
    createMorePlayersAlert.onDidDismiss()
      .then(async () => await this.router.navigate(['tabs', 'player-list']));


    const createUserAlert = await this.alertController.create({
      header: 'Enter your player name',
      message: 'PRO Tip - see your personal stats on the "Stats" tab',
      backdropDismiss: false,
      inputs: [{label: 'Name', type: 'text', attributes: {maxLength: 12}, name: 'name'}],
      buttons: [{text: 'Submit', role: 'submit'}]
    });
    createUserAlert.onDidDismiss()
      .then(async event => {
        const name = event.data.values.name;
        const id = await this.playerService.createPlayer(name);
        await this.playerService.bookmarkPlayer(id);
        await createMorePlayersAlert.present();
      });

    if (_playerCount === 0) {
      await createUserAlert.present();
    }
  }
}
