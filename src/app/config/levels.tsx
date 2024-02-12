export type LevelMetadata = {
  url: string;
  name: string;
};
type LevelConfig = Record<string, LevelMetadata>;

const levels = {
  start: {
    url: '/',
    name: 'Start',
  },
  level1: {
    url: '/level-1',
    name: 'Level 1',
  },
} as const satisfies LevelConfig;

export type Levels = typeof levels;
export type LevelName = keyof Levels;

export default levels;
