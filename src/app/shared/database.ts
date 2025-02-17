import Dexie, {Table} from "dexie";
import {Game, Player, Roll, Settings} from "./types";

export class AppDb extends Dexie {

  games!: Table<Game, number>;
  players!: Table<Player, number>;
  settings!: Table<Settings, number>;
  rolls!: Table<Roll, number>;

  constructor() {
    super('SettlersDiceDb');
    this.version(5).stores({
      games: '++id,createdOn',
      players: '++id,[isUser+isActive],isUser,isActive',
      rolls: '++id,gameId,playerId',
      settings: '++id'
    });
    this.on('populate', () => {
      // add default settings
      this.settings.add({
        fairDice: 1,
        rollHaptics: 1,
        rollAnnouncer: 1,
        soundEffects: 1
      });
    });
  }
}

export const db = new AppDb();
