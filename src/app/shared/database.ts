import Dexie, {Table} from "dexie";
import {Game, Player, Roll, Settings} from "./types";

export class AppDb extends Dexie {

  games!: Table<Game, number>;
  players!: Table<Player, number>;
  settings!: Table<Settings, number>;
  rolls!: Table<Roll, number>;
  isPersistent = false;

  constructor() {
    super('CatanDiceDb');
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
        soundEffects: 1
      });
    });
  }

  async persist() {
    return navigator.storage && navigator.storage.persist && navigator.storage.persist();
  }
}

export const db = new AppDb();
