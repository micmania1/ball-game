import { Redirect } from 'wouter';
import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const hasAttemptedJoin = hasAttemptedJoinRef.current;
    if (!hasAttemptedJoin && params.roomCode) {
      hasAttemptedJoinRef.current = true;
      game.join(params.roomCode);
    }
  }, [game, params.roomCode]);

  return params.roomCode ? null : <Redirect to={levels.start.url} />;
}
