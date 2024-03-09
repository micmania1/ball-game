import { Redirect } from 'wouter';
import { useRef } from 'react';
import { useGameContext } from '../providers/game-provider';
import levels from '../../config/levels';

export type JoinRoomParams = {
  roomCode: string | undefined;
};

type RouteFallbackProps = {
  params: JoinRoomParams;
};
export default function JoinRoom({ params }: RouteFallbackProps) {
  const game = useGameContext();
  const hasAttemptedJoinRef = useRef(false);

  const hasAttemptedJoin = hasAttemptedJoinRef.current;
  if (!hasAttemptedJoin && params.roomCode) {
    hasAttemptedJoinRef.current = true;
    game.join(params.roomCode);

    return <Redirect to={levels.lobby.url} />;
  }

  return <Redirect to={levels.start.url} />;
}
