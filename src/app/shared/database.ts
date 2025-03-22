import Dexie, {Table} from "dexie";
import {Game, Player, Roll, Settings} from "./types";
import {Preferences} from "@capacitor/preferences";

export class AppDb extends Dexie {

  games!: Table<Game, number>;
  players!: Table<Player, number>;
  settings!: Table<Settings, number>;
  rolls!: Table<Roll, number>;
  isPersistent = false;

  constructor() {
    super('SettlersDiceDb');
    this.persist().then(isPersistent => {
      this.isPersistent = isPersistent;
      console.log('Storage is persistent: ', this.isPersistent);
    });

    this.version(5).stores({
      games: '++id,createdOn',
      players: '++id,[isUser+isActive],isUser,isActive',
      rolls: '++id,gameId,playerId',
      settings: '++id'
    });
    this.on('populate', () => {
      // add default settings
      this.settings.add({
        fairDice: 0,
        rollHaptics: 1,
        rollAnnouncer: 1,
        soundEffects: 1
      });
    });
  }

  async persist() {
    return navigator.storage && navigator.storage.persist && navigator.storage.persist();
  }

  async backupData() {
    await Preferences.clear();
    await this.backupGames();
    await this.backupPlayers();
    await this.backupRolls();
    await this.backupSettings();
    await this.backupUserPlayer();
  }

  async backupPlayers() {
    const players = await this.players.toArray();
    await Preferences.set({key: 'players', value: JSON.stringify(players)});
  }

  async backupGames() {
    const games = await this.games.toArray();
    await Preferences.set({key: 'games', value: JSON.stringify(games)});
  }

  async backupSettings() {
    const settings = await this.settings.toArray();
    await Preferences.set({key: 'settings', value: JSON.stringify(settings)});
  }

  async backupRolls() {
    const rolls = await this.rolls.toArray();
    await Preferences.set({key: 'rolls', value: JSON.stringify(rolls)});
  }

  async backupUserPlayer() {
    const userPlayer = localStorage.getItem('SettlersDice.userPlayer');
    if (userPlayer) {
      await Preferences.set({key: 'userPlayer', value: userPlayer});
    }
  }

  async restoreFromBackup() {
    // fetch game data
    const games = await Preferences.get({key: 'games'});
    const players = await Preferences.get({key: 'players'});
    const settings = await Preferences.get({key: 'settings'});
    const rolls = await Preferences.get({key: 'rolls'});
    const userPlayer = await Preferences.get({key: 'userPlayer'});

    if (games.value) {
      for (const item of JSON.parse(games.value)) {
        await this.games.put(item, item.id);
      }
    }
    if (players.value) {
      for (const item of JSON.parse(players.value)) {
        await this.players.put(item, item.id);
      }
    }
    if (rolls.value) {
      for (const item of JSON.parse(rolls.value)) {
        await this.rolls.put(item, item.id);
      }
    }
    if (userPlayer.value) {
      localStorage.setItem('SettlersDice.userPlayer', userPlayer.value);
    }
  }
}

export const db = new AppDb();
