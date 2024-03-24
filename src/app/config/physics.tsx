import { interactionGroups } from '@react-three/rapier';

const ground = 0;
const ball = 1;
const obstacle = 2;
const goal = 3;
const lose = 4;
const groundDetector = 5;

export const collisionGroups = {
  ground: interactionGroups(ground, [ball]),
  ball: interactionGroups(ball),
  obstacle: interactionGroups(obstacle, [ball]),
  goal: interactionGroups(goal, [ball]),
  lose: interactionGroups(lose, [ball]),
  groundDetector: interactionGroups(groundDetector, [ground]),
};

export const restitution = {
  ground: 0.2,
  obstacle: 0.001,
  ball: 1,
};
