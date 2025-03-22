import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import {db} from './database';
import {Network} from "@capacitor/network";

// games, players, rolls


@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly authService = inject(AuthService);

  readonly hasValidUser = computed(() => this.authService.user() !== null);
  readonly hasInternet = signal(false);

  constructor() {
    Network.getStatus().then((result) => this.hasInternet.set(result.connected));
    Network.addListener('networkStatusChange', (event) => this.hasInternet.set(event.connected)).then();
  }

  get canExecuteBackup() {
    return this.hasValidUser() && this.hasInternet();
  }

  async getBackupData(uid?: string) {
    const req = await FirebaseFirestore.getDocument({
      reference: `account/${uid ?? this.authService.user()?.uid}/backup/data`,
    });
    return req.snapshot.data;
  }

  async getBackupSummary(uid?: string) {
    const req = await FirebaseFirestore.getDocument({
      reference: `account/${uid ?? this.authService.user()?.uid}/backup/summary`,
    });
    const backup = req.snapshot.data;
    if (backup) {
      backup.id = this.authService.user()?.uid;
    }
    return backup;
  }

  setBackupSummary(data: Record<string, any>) {
    return FirebaseFirestore.setDocument({
      reference: `account/${this.authService.user()?.uid}/backup/summary`,
      data: data,
    });
  }

  setBackupData(data: Record<string, any>) {
    return FirebaseFirestore.setDocument({
      reference: `account/${this.authService.user()?.uid}/backup/data`,
      data: data,
    });
  }

  async createNewBackup() {
    // TODO trigger a backup whenever a game is completed
    // TODO trigger a restore whenever the app is first loaded
    const games = await db.games.toArray();
    const rolls = await db.rolls.toArray();
    const players = await db.players.toArray();
    const lastBackupDate = Date.now()


    // const account = await this.storageService.getAccount();
    // const games = await this.storageService.getGames();
    // const notifications = await this.storageService.getAllNotifications();
    // const players = await this.storageService.getPlayers();
    // const playgroups = await this.storageService.getPlayGroups();
    // const rolls = await this.storageService.getAllRolls();
    // const settings = await this.storageService.getSettings();
    // const rosterMap = await this.storageService.getAllRosterMaps();
    // const summary: Record<string, any> = {
    //   lastBackupDate: Date.now(),
    //   tables: {
    //     account: 1,
    //     games: games.length,
    //     notifications: notifications.length,
    //     players: players.length,
    //     playgroups: playgroups.length,
    //     rolls: rolls.length,
    //     rosterMap: rosterMap.length,
    //     settings: 1,
    //   },
    // };
    // try {
    //   await this.setBackupData({
    //     account: [account],
    //     players,
    //     playgroups,
    //     games,
    //     notifications,
    //     rolls,
    //     settings: [settings],
    //   });
    //   await this.setBackupSummary(summary);
    //   summary.id = this.authService.user()!.uid;
    //   //await this.storageService.setBackupSummary(summary as BackupSummary);
    // } catch (e) {
    //   console.log('Error creating backup', e, 'data', { players, games, rolls, settings: [settings], rosterMap });
    // }
  }

  async restoreFromBackup() {
    if (!this.canExecuteBackup) {
      return;
    }
    const backup = await this.getBackupData();
    if (backup) {
      for (const table of Object.keys(backup)) {
        //await this.storageService.insertFromBackup(table, backup[table]);
      }
      //await this.storageService.updatePlayerStatistics();
    }
  }
}
