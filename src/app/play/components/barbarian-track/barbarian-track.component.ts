import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {IonButton, IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-barbarian-track',
  templateUrl: './barbarian-track.component.html',
  styleUrls: ['./barbarian-track.component.scss'],
  imports: [
    NgClass,
    IonIcon,
    IonButton
  ]
})
export class BarbarianTrackComponent {

  @Input() barbarianCount = 0;
  @Input() barbarianAttack = false;

}
