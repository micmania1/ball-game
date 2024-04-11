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

export type PhysicsGroup = keyof typeof collisionGroups;

export const restitution: Record<PhysicsGroup, number> = {
  ground: 0.2,
  ball: 1,
  obstacle: 0.001,
  goal: 0,
  lose: 0,
  groundDetector: 0,
};

export const friction: Record<PhysicsGroup, number> = {
  ground: 10,
  ball: 10,
  obstacle: 0.25,
  goal: 0,
  lose: 0,
  groundDetector: 0,
};
