import * as fs from 'fs';
import { config } from '../../config/config';
import { Game } from '../../types';

export const readGames = () => {
    const providers = config.getProviders();
    const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));
    const gamesList: Game[] = [];

    if (!providers || !providers.length) {
        for (const provider in games) {
            for (const game of games[provider]) {
                gamesList.push({ name: game, provider });
            }
        }
        return gamesList;
    }

    for (const provider of providers) {
        for (const game of games[provider]) {
            gamesList.push({ name: game, provider });
        }
    }

    return gamesList;
};
