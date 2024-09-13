export enum ExpectedMessage {
    BALANCE_UPDATE = 'balanceUpdate',
    CURRENCY_EUR = '"currency":"EUR"',
    CURRENCY_GBP = '"currency":"GBP"',
    DEPOSIT = 'send balance changed',
    END_SPIN = 'gameAnimationComplete',
    ERROR_DISPLAYED = 'errorMessageDisplayed',
    ERROR_DISMISSED = 'errorMessageDismissed',
    GAME_MENU_CLOSE = '[Game Window -> Game Client] send notification: "menuClosed"',
    GAME_MENU_OPEN = '[Game Window -> Game Client] send notification: "menuOpened"',
    GAME_HELP = '[Game Window -> Game Client] send notification: "gameHelp"',
    GAME_LOAD_COMPLETE = 'gameLoadComplete',
    PAY_TABLE = 'toggle paytable',
    PLAY_MODE_UPDATE = 'playModeUpdate',
    REALITY_CHECK = 'REALITY_CHECK_ELAPSED_ERROR',
    SOUND_CHECK_GAME_OFF = '"settingName":"sound","settingValue":"off"',
    SOUND_CHECK_GAME_ON = '"settingName":"sound","settingValue":"on"',
    SOUND_CHECK_TOOL_BAR_OFF = '"sound":" false"',
    SOUND_CHECK_TOOL_BAR_ON = '"sound":" true"',
    STAKE_UPDATE = 'stakeUpdate',
    START_SPIN = 'gameAnimationStart',
    WIN_UPDATE = 'winUpdate',
}
