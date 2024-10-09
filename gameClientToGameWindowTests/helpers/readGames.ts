import * as fs from 'fs';
import { config } from '../../config/config';
import { Game } from '../../types';

export const readGames = () => {
    const providers = config.getProviders();
    const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));
    const gamesList: Game[] = [];

    for (const provider of providers) {
        for (const game of games[provider]) {
            gamesList.push({ name: game, provider });
        }
    }

    return gamesList;
};
