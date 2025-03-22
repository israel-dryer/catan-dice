import {Component, inject, input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonAlert,
  IonButton,
  IonContent,
  IonHeader, IonIcon,
  IonInput,
  IonLabel,
  IonList, IonNavLink, IonNote, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, IonInput, IonButton, IonNavLink, IonNote, RouterLink]
})
export class LoginPage {

  readonly alertController = inject(AlertController);
  readonly router = inject(Router);
  email = '';
  password = '';

  async resetPassword(e: any) {
    const email = e.data.values?.email;
    if (email) {
      console.log('resetting password for email', email);
      // TODO reset the password;
      await this.showPasswordResetSuccessAlert();
    } else {
      console.log('No valid email provided');
    }

  }

  async showPasswordResetSuccessAlert() {
    const _alert = await this.alertController.create({
      header: 'Reset Password',
      message: 'Check email for instructions on resetting password',
      buttons: ['Ok']
    });
    await _alert.present();
  }

  async showResetPasswordAlert() {
    const _alert = await this.alertController.create({
      header: 'Reset Password',
      inputs: [{placeholder: 'your@email.com', name: 'email'}],
      buttons: ['Submit']
    });
    _alert.onDidDismiss().then(async (e: any) => {
      await this.resetPassword(e);
    });
    await _alert.present();
  }

  async showInvalidCredentialsAlert() {
    const _alert = await this.alertController.create({
      header: 'Invalid Credentials',
      message: 'Invalid email or password. Please try again.',
      buttons: ['Ok']
    });
    await _alert.present();
  }

  async login() {
    // TODO login using password
    const success = true;
    if (!success) {
      await this.showInvalidCredentialsAlert();
    } else {
      await this.router.navigate(['']);
    }
  }


}
