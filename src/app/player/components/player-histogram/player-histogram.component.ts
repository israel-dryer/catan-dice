import {Component, computed, input} from '@angular/core';
import {Player} from "../../../shared/types";
import {NgStyle} from "@angular/common";
import {IonText} from "@ionic/angular/standalone";

@Component({
  selector: 'app-player-histogram',
  templateUrl: './player-histogram.component.html',
  styleUrls: ['./player-histogram.component.scss'],
  imports: [
    NgStyle,
    IonText
  ]
})
export class PlayerHistogramComponent {

  player = input.required<Player>();
  backgroundChart = false;
  histogram = computed(() => this.player().histogram);
  rolls = computed(() => Object.values(this.player().histogram));
  maxValue = computed(() => Math.max(...this.rolls()));

}
