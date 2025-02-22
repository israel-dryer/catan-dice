import {Component, Input, model,} from '@angular/core';
import {Roll} from "../../../shared/types";
import {NgIf} from "@angular/common";
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-game-rolls',
  templateUrl: './game-rolls.component.html',
  styleUrls: ['./game-rolls.component.scss'],
  imports: [
    NgIf,
    IonIcon
  ]
})
export class GameRollsComponent {

  @Input() isCitiesKnights = false;
  rolls = model<Roll[]>([]);




}
