import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController, IonActionSheet,
  IonButton,
  IonContent, IonFooter,
  IonHeader, IonIcon, IonModal, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {PlayService} from '../play.service';
import {ActionSheetButton, AlertInput} from "@ionic/angular";
import {Router, RouterLink} from "@angular/router";
import {BarbarianTrackComponent} from "../components/barbarian-track/barbarian-track.component";
import {StandardDieComponent} from "../components/standard-die/standard-die.component";
import {ActionDieComponent} from "../components/action-die/action-die.component";
import {AlchemyPickerComponent} from "../components/alchemy-picker/alchemy-picker.component";
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {WakeLockService} from '../../shared/wakelock.service';

const ROLL_DURATION = 750;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonActionSheet, RouterLink, IonIcon, IonText, IonFooter, BarbarianTrackComponent, StandardDieComponent, ActionDieComponent, AlchemyPickerComponent, IonModal, NgOptimizedImage],
  animations: [
    trigger('jiggleRed', [
      state('active', style({})),
      transition('* => active', [
        animate(
          `${ROLL_DURATION}ms`,
          keyframes([
            style({transform: 'translate3d(0, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(-1px, 0, 0) rotate(-5deg)'}),
            style({transform: 'translate3d(2px, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(-4px, 0, 0)'}),
            style({transform: 'translate3d(4px, 0, 0) rotate(5deg)'}),
            style({transform: 'translate3d(1px, 0, 0) rotate(5deg)'}),
            style({transform: 'translate3d(-2px, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(0, 0, 0)'}),
          ]),
        ),
      ]),
    ]),
    trigger('jiggleGold', [
      state('active', style({})),
      transition('* => active', [
        animate(
          `${ROLL_DURATION}ms`,
          keyframes([
            style({transform: 'translate3d(0, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(1px, 0, 0) rotate(5deg)'}),
            style({transform: 'translate3d(-2px, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(4px, 0, 0)'}),
            style({transform: 'translate3d(-4px, 0, 0) rotate(-5deg)'}),
            style({transform: 'translate3d(1px, 0, 0) rotate(5deg)'}),
            style({transform: 'translate3d(-2px, 0, 0) rotate(0deg)'}),
            style({transform: 'translate3d(0, 0, 0)'}),
          ]),
        ),
      ]),
    ]),
  ]
})
export class PlaygroundPage implements OnInit, OnDestroy {

  readonly alertController = inject(AlertController);
  readonly playService = inject(PlayService);
  readonly router = inject(Router);
  readonly wakeLockService = inject(WakeLockService);

  // time duration state
  private readonly timerIntervalCallback?: any;
  private readonly visibilityChangeHandler: () => void;
  elapsedHours = 0;
  elapsedMinutes = 0;
  elapsedSeconds = 0;
  actionSheetButtons: ActionSheetButton[];
  isRobberModalOpen = false;
  isBarbarianModalOpen = false;
  isGameOverModalOpen = false
  isPauseGameModalOpen = false;
  gameOverMessage = '';

  constructor() {
    this.timerIntervalCallback = setInterval(() => this.updateDurationDisplay(), 1000);
    this.actionSheetButtons = [
      {text: 'Undo Roll', data: {action: 'undo'}, icon: 'undo'},
      {text: 'End Game', data: {action: 'end'}, icon: 'medal'},
      {text: 'Cancel', role: 'cancel', data: {action: 'cancel'}, icon: 'close'}
    ];
    this.visibilityChangeHandler = () => this.handleVisibilityChange();
  }

  async ngOnInit() {
    await this.wakeLockService.acquire();
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  ngOnDestroy() {
    clearInterval(this.timerIntervalCallback);
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    this.wakeLockService.release();
  }

  private async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      await this.wakeLockService.acquire();
    }
  }

  async rollDice(alchemyDice?: any) {
    this.playService.isRolling.set(true);
    await this.playService.playSoundRollingDice();
    await this.playService.rollDice(alchemyDice);
    if (this.playService.barbariansAttack()) {
      await this.playService.playSoundBarbarianAttack();
      this.isBarbarianModalOpen = true;
    } else if (this.playService.robberStealing()) {
      await this.playService.playSoundRobberLaugh();
      this.isRobberModalOpen = true;
      this.playService.resetRobberStealing();
    }
    setTimeout(async () => {
      this.playService.isRolling.set(false);
      const total = this.playService.diceTotal();
      if (total) {
        await this.playService.announceRoll(total);
      }
    }, ROLL_DURATION);
  }

  async handleAlchemyDialogDidDismiss({detail}: any) {
    if (detail.role === 'confirm') {
      const dice1 = parseInt(detail.data.dice1);
      const dice2 = parseInt(detail.data.dice2);
      const alchemyDice = {dice1, dice2};
      await this.rollDice(alchemyDice);
    }
  }

  async handleActionSheetDidDismiss(event: any) {
    const {data, role} = event.detail;
    if (role === 'backdrop' || role === 'cancel') {
      return;
    } else if (data.action === 'end') {
      await this.showSelectWinnerAlert();
    } else if (data.action === 'undo') {
      if (this.playService.state()?.lastRoll) {
        await this.playService.undoLastRoll();
      }
    } else if (data.action === 'settings') {
      await this.router.navigate(['/app-settings']);
    }
  }

  async showGameOverDialog(duration: number, winner?: string) {
    if (winner) {
      await this.playService.playSoundGameOver();
      this.gameOverMessage = `${winner} is victorious!`
      this.isGameOverModalOpen = true;
    } else {
      this.gameOverMessage = `Game paused`;
      this.isPauseGameModalOpen = true;
    }
  }

  async showSelectWinnerAlert() {
    const game = this.playService.activeGame();
    if (!game) return;
    const alertInputs: AlertInput[] = game.roster.map(player => ({
      label: player.name,
      type: 'radio',
      value: {id: player.id, name: player.name},
    }));
    const alert = await this.alertController.create({
      header: 'Game Over',
      message: 'Choose a winner to complete the game. Otherwise, the game can be continued from the game details screen.',
      inputs: alertInputs,
      buttons: [{text: 'Cancel', role: 'cancel'}, {text: 'Ok', role: 'submit'}]
    });
    alert.onDidDismiss().then(async ({data, role}) => {
      if (role !== 'submit') return;
      const game = Object.assign({}, this.playService.activeGame());
      await this.playService.endGame(data.values);
      if (game.winnerId) {
        await this.playService.endGame(data.values);
      }
      await this.showGameOverDialog(game.duration, data.values?.name);
    });
    await alert.present();
  }

  updateDurationDisplay() {
    const game = this.playService.activeGame();
    if (!game) {
      return;
    }
    const totalSeconds = (Date.now() - game.createdOn) / 1000;
    this.elapsedHours = Math.floor(totalSeconds / 60 / 60);
    this.elapsedMinutes = Math.floor(totalSeconds / 60) % 60;
    this.elapsedSeconds = totalSeconds % 60;
  }

  async dismissBarbarianModal() {
    this.isBarbarianModalOpen = false;
    await this.playService.resetBarbarians();
  }

  dismissGameOverModal() {
    this.isGameOverModalOpen = false;
    this.isPauseGameModalOpen = false;
    setTimeout(() => this.router.navigate(['/']));
  }

  dismissRobberModal() {
    this.isRobberModalOpen = false;
  }

}
