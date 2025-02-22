import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController, IonBackButton, IonButton, IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonItem, IonLabel,
  IonList, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {liveQuery} from "dexie";
import {PlayerService} from "../player.service";
import {Player} from "../../shared/types";
import {Router} from "@angular/router";
import {addIcons} from "ionicons";
import {personCircle, personCircleOutline, alertCircleOutline} from 'ionicons/icons'

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonButtons, IonBackButton, IonIcon, IonText, IonLabel]
})
export class PlayerListPage implements OnInit {

  alertController = inject(AlertController);
  playerService = inject(PlayerService);
  router = inject(Router);
  players: Player[] = [];

  constructor() {
    addIcons({personCircle, personCircleOutline, alertCircleOutline})
  }

  ngOnInit() {
    liveQuery(() => this.playerService.getActivePlayers()).subscribe(
      players => this.players = players.sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  async showCreatePlayerDialog() {

    const alert = await this.alertController.create({
      header: 'Create Player',
      cssClass: 'sd-alert-message',
      message: '* required',
      inputs: [{placeholder: 'Name', type: 'text', name: 'playerName', attributes: {maxLength: 10}}],
    });

    const handler = async (data: any) => {
      if (data.playerName) {
        await this.playerService.createPlayer(data.playerName);
        return true;
      }
      return false;
    }
    alert.buttons = [{text: 'Cancel', role: 'cancel'}, {text: 'Submit', handler, role: 'submit'}];
    await alert.present();
  }

  async setupPlayerDetail(player: Player) {
    this.playerService.setActivePlayer(player);
    await this.router.navigate(['player-detail']);
  }

}
