import { Component } from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonRouterLink,
  IonIcon
} from '@ionic/angular/standalone';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonContent, IonButton, IonRouterLink, RouterLink, IonIcon],
})
export class HomePage {
  constructor() {}
}
