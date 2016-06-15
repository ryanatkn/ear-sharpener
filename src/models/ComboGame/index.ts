import {GameName} from '../../types';

export function getNextGame(gameName: GameName): GameName {
  switch (gameName) {
    case 'piano-game': return 'note-distance-game';
    case 'note-distance-game': return 'note-name-game';
    case 'note-name-game': return 'piano-game';
    default: throw new Error(`Invalid game name ${gameName} passed to \`getNextGame\``);
  }
}

export const pauseTimeBetweenGames = __TEST__ ? 0 : 1000;
