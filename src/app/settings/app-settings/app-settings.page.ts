import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonItem,
  IonLabel,
  IonList, IonListHeader,
  IonNote, IonText,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Settings} from "../../shared/types";
import {SettingsService} from "../settings.service";
import {Router} from "@angular/router";
import {addIcons} from "ionicons";
import {exit, gitCommit, lockClosed, newspaper, server} from "ionicons/icons";
import {APP_VERSION} from "../../../main";

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton, IonNote, IonIcon, IonText, IonListHeader]
})
export class AppSettingsPage implements OnInit {

  settings?: Settings;
  version = inject(APP_VERSION);
  readonly router = inject(Router);
  readonly settingsService = inject(SettingsService);
  readonly alertController = inject(AlertController);

  async ngOnInit() {
    addIcons({gitCommit, exit, newspaper, lockClosed, server})
    this.settings = await this.settingsService.getSettings();
  }

  soundEffectsChanged(event: any) {
    const value = event.detail.checked;
    if (this.settings) {
      this.settings.soundEffects = value;
      this.settingsService.updateSettings({soundEffects: value ? 1 : 0});
    }
  }

  fairDiceChanged(event: any) {
    const value = event.detail.checked;
    if (this.settings) {
      this.settings.fairDice = value;
      this.settingsService.updateSettings({fairDice: value ? 1 : 0});
    }
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure? This action cannot be undone?',
      buttons: [{text: 'Cancel', role: 'cancel'}, {text: 'Confirm', role: 'submit'}]
    });
    alert.onDidDismiss().then(async event => {
      if (event.role === 'cancel') {
        return;
      } else {
        // TODO delete application data on device
        // TODO delete application data in firebase
        // TODO remove account
        console.log('Deleting application data');
        await this.router.navigate(['/login'])
      }
    })
    await alert.present();
  }

  async logout() {
    // TODO logout using auth
    await this.router.navigate(['/login']);
  }

}
