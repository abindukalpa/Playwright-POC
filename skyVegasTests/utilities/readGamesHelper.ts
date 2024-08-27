import * as fs from 'fs';

export const readGames = () =>
    JSON.parse(fs.readFileSync('games.json', 'utf-8'));
