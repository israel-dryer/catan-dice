import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard, IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader, IonInput, IonLabel, IonNavLink, IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonNavLink, IonNote, RouterLink]
})
export class SignupPage  {

  readonly alertController = inject(AlertController);
  readonly router = inject(Router);
  email = '';
  password = '';

  async showInvalidCredentialsAlert() {
    const _alert = await this.alertController.create({
      header: 'Invalid Credentials',
      message: 'An error occurred while creating your account',
      buttons: ['Ok']
    });
    await _alert.present();
  }

  async signup() {
    // TODO login using password
    const success = true;
    if (!success) {
      await this.showInvalidCredentialsAlert();
    } else {
      await this.router.navigate(['']);
    }
  }

}
