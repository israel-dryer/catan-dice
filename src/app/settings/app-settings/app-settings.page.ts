import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Settings} from "../../shared/types";
import {SettingsService} from "../settings.service";
import {liveQuery} from "dexie";
import {Router} from "@angular/router";
import {db} from "../../shared/database";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {Share} from "@capacitor/share";

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonToggle, IonIcon, IonButtons, IonBackButton, IonNote, IonListHeader]
})
export class AppSettingsPage implements OnInit {

  settings?: Settings;

  readonly router = inject(Router);
  readonly settingsService = inject(SettingsService);
  readonly alertController = inject(AlertController);


  ngOnInit() {
    liveQuery(() => this.settingsService.getSettings())
      .subscribe(settings => this.settings = settings);
  }

  handleSettingsChange(setting: string, event: any) {
    const value = event.detail.checked ? 1 : 0;
    if (this.settings) {
      const changes = Object.assign({}, this.settings) as Record<string, any>;
      changes[setting] = value;
      this.settingsService.updateSettings(changes);
    }
  }

  async shareAppData() {
    // show loading screen

    // fetch app data
    const gameData: Record<string, any> = {};
    gameData['games'] = await db.games.toArray();
    gameData['players'] = await db.players.toArray();
    gameData['rolls'] = await db.rolls.toArray();
    gameData['settings'] = await db.settings.toArray();
    const outData = JSON.stringify(gameData, null, 2);

    // save to local file
    const filename = `settlers_dice_${new Date().toDateString().replaceAll(' ', '_')}.json`;
    const writeResult = await Filesystem.writeFile({
      path: filename,
      data: outData,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    });

    // open the share feature

    const canShare = await Share.canShare();
    if (canShare) {
      await Share.share({files: [writeResult.uri]});
    }

    // remove file from cache
    await Filesystem.deleteFile({path: filename, directory: Directory.Cache});
  }

  async confirmDeleteAppData() {
    const handler = async () => {
      await db.games.clear();
      await db.players.clear();
      await db.rolls.clear();
      localStorage.clear();
      await this.router.navigate(['/']);
    }

    const alert = await this.alertController.create({
      header: 'Delete App Data',
      message: 'Are you sure? This action cannot be undone?',
      buttons: [{text: 'Cancel', role: 'cancel'}, {text: 'Confirm', role: 'submit', handler}]
    });
    await alert.present();
  }

  importAppData() {
    console.log('importing app data');
  }


}
