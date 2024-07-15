import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme } from '@fluentui/tokens';
import { setTheme } from '@fluentui/web-components';

const themes = {
  'web-light': webLightTheme,
  'web-dark': webDarkTheme,
  'teams-light': teamsLightTheme,
  'teams-dark': teamsDarkTheme,
};

export type ThemeName = keyof typeof themes;

export function switchTheme(themeName: ThemeName) {
  setTheme(themes[themeName]);
}
