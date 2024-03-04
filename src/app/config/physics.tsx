import { interactionGroups } from '@react-three/rapier';

const environment = 0;
const ball = 1;
const obstacle = 2;
const goal = 3;
const lose = 4;

export const collissionGroups = {
  environment: interactionGroups(environment, [ball]),
  ball: interactionGroups(ball),
  obstacle: interactionGroups(obstacle, [ball]),
  goal: interactionGroups(goal, [ball]),
  lose: interactionGroups(lose, [ball]),
};
