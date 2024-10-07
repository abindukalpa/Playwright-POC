import * as fs from 'fs';
import { config } from '../../config/config';

export const readGames = () => {
    const providers = config.getProviders();
    const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));
    let gamesList: string[] = [];

    for (const provider of providers) {
        gamesList = gamesList.concat(games[provider]);
    }

    return gamesList;
};
