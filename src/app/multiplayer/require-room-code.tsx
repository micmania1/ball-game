import { getRoomCode } from 'playroomkit';
import { ReactNode } from 'react';
import { Redirect } from 'wouter';

type RequireRoomCodeProps = {
  children: ReactNode;
  fallbackUrl: string;
};
export default function RequireRoomCode({
  children,
  fallbackUrl,
}: RequireRoomCodeProps) {
  const code = getRoomCode();

  return code ? children : <Redirect to={fallbackUrl} />;
}

export function useRoomCode() {
  const code = getRoomCode();

  if (!code) {
    throw new Error('Room code is required');
  }

  return code;
}
