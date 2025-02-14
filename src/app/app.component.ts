import {Component, OnInit} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {EdgeToEdge} from "@capawesome/capacitor-android-edge-to-edge-support";
import {addIcons} from "ionicons";
import {dice} from "ionicons/icons";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {


  async ngOnInit() {
    await this.initialize();
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    //
    // if (prefersDark.matches) {
    //   EdgeToEdge.setBackgroundColor({color: '#1f1f1f'}).then();
    // } else {
    //   EdgeToEdge.setBackgroundColor({color: '#fff'}).then();
    // }
    //
    // prefersDark.addEventListener('change', (mediaQuery) => {
    //   if (mediaQuery.matches) {
    //     EdgeToEdge.setBackgroundColor({color: '#1f1f1f'}).then();
    //   } else {
    //     EdgeToEdge.setBackgroundColor({color: '#fff'}).then();
    //   }
    // });
  }

  async initialize() {
    addIcons({
      'chart': 'assets/svg/sd-chart.svg',
      'burning-house': 'assets/svg/sd-fire.svg',
      'play': 'assets/svg/sd-play.svg',
      'close': 'assets/svg/sd-close.svg',
      'database': 'assets/svg/sd-database-restore.svg',
      'dice': 'assets/svg/sd-dice-cubes.svg',
      'diamond': 'assets/svg/sd-diamond.svg',
      'logout': 'assets/svg/sd-logout-rounded.svg',
      'edit': 'assets/svg/sd-edit.svg',
      'warning': 'assets/svg/sd-error.svg',
      'visible': 'assets/svg/sd-eye.svg',
      'invisible': 'assets/svg/sd-invisible.svg',
      'facebook-logo': 'assets/svg/sd-facebook.svg',
      'filter': 'assets/svg/sd-filter.svg',
      'google-logo': 'assets/svg/sd-google.svg',
      'house': 'assets/svg/sd-village.svg',
      'add': 'assets/svg/sd-plus.svg',
      'minus': 'assets/svg/sd-minus.svg',
      'medal': 'assets/svg/sd-medal.svg',
      'merge': 'assets/svg/sd-merge.svg',
      'robber': 'assets/svg/sd-pawn.svg',
      'save': 'assets/svg/sd-save.svg',
      'settings': 'assets/svg/sd-settings.svg',
      'tune': 'assets/svg/sd-tune.svg',
      'flask': 'assets/svg/sd-test-tube.svg',
      'history': 'assets/svg/sd-history.svg',
      'trash': 'assets/svg/sd-remove.svg',
      'trophy': 'assets/svg/sd-trophy.svg',
      'undo': 'assets/svg/sd-undo.svg',
      'upload': 'assets/svg/sd-upload.svg',
      'viking-helmet': 'assets/svg/sd-viking-helmet.svg',
      'viking-ship': 'assets/svg/sd-viking-ship.svg',
      'add-user': 'assets/svg/sd-add-user-male.svg',
      'refresh': 'assets/svg/sd-reboot.svg',
      'restore': 'assets/svg/sd-database-restore.svg',
      'friend-list': 'assets/svg/sd-friend-list.svg',
      'checkmark': 'assets/svg/sd-checkmark.svg',
      'back': 'assets/svg/sd-back.svg',
      'notification': 'assets/svg/sd-notification.svg',
      'chat': 'assets/svg/sd-chat.svg',
      'menu': 'assets/svg/sd-menu.svg',
      'group': 'assets/svg/sd-group.svg',
      'shop': 'assets/svg/sd-shop.svg',
      'dice-cubes': 'assets/svg/sd-dice-cubes.svg',
      'crowd': 'assets/svg/sd-crowd.svg',
      'avatar': 'assets/svg/sd-avatar.svg',
      'home': 'assets/svg/sd-home.svg',
      'more': 'assets/svg/sd-more.svg',
      'pause': 'assets/svg/sd-pause.svg',
      'share': 'assets/svg/sd-share.svg',
      'link': 'assets/svg/sd-link.svg',
      'unlink': 'assets/svg/sd-unlink.svg',
      'default-avatar': 'assets/svg/sd-default-avatar.svg',
      'dot': 'assets/svg/sd-dot.svg',
      'news': 'assets/svg/sd-news.svg',
      'megaphone': 'assets/svg/sd-megaphone.svg',
      'tip': 'assets/svg/sd-tip.svg',
    });
  }

}
