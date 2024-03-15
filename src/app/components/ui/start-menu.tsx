import { useGameContext } from '../providers/game-provider';
import { useCallback, useRef, useState } from 'react';
import { Container, Fullscreen, Text } from '@react-three/uikit';
import { Button } from './button';
import { Card, CardContent } from './card';
import { UserRound, UsersRound } from '@react-three/uikit-lucide';
import {
  Dialog,
  DialogAnchor,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Label } from './label';
import { PerspectiveCamera } from '@react-three/drei';
import Input from './input';

export default function StartMenu() {
  const game = useGameContext();
  const [isEnteringCode, setIsEnteringCode] = useState(false);
  const isJoiningRef = useRef(false);
  const [code, setCode] = useState('');
  const codeLength = 4;

  const join = useCallback(
    (code: string) => {
      const isJoining = isJoiningRef.current;
      if (!isJoining) {
        game.join(code);
        isJoiningRef.current = true;
      }
    },
    [game]
  );

  return (
    <>
      <PerspectiveCamera makeDefault />
      <Fullscreen justifyContent="center" alignItems="center">
        <Card
          flexDirection="column"
          width="100%"
          maxWidth={300}
          backgroundOpacity={0.8}
        >
          <CardContent
            flexDirection="column"
            gap={20}
            width="100%"
            paddingX={20}
            paddingY={20}
          >
            <Text
              marginBottom={24}
              fontSize={48}
              fontWeight="bold"
              alignSelf="center"
            >
              Ball Game
            </Text>
            <Button
              onClick={() => game.startMultiplayer()}
              size="lg"
              width={'100%'}
              gap={4}
            >
              <UsersRound />
              <Text>Create Lobby</Text>
            </Button>
            <Button
              size="lg"
              width={'100%'}
              gap={4}
              onClick={() => setIsEnteringCode(true)}
            >
              <UsersRound />
              <Text>Join Lobby</Text>
            </Button>
            <Button
              onClick={() => game.startPrivate()}
              size="lg"
              width={'100%'}
              gap={4}
            >
              <UserRound />
              <Text>Single Player</Text>
            </Button>
          </CardContent>
        </Card>

        <DialogAnchor>
          <Dialog
            open={isEnteringCode}
            onOpenChange={(isOpen) => setIsEnteringCode(isOpen)}
          >
            <DialogContent sm={{ maxWidth: 600 }}>
              <DialogHeader>
                <DialogTitle>
                  <Text>Join Lobby</Text>
                </DialogTitle>
                <DialogDescription>
                  <Text>Enter a code to join the lobby.</Text>
                </DialogDescription>
              </DialogHeader>
              <Container gap={16} paddingY={16} alignItems="center">
                <Label>
                  <Text>Code</Text>
                </Label>
                <Input
                  type="text"
                  name="code"
                  onChange={(e) => setCode(e.currentTarget.value)}
                  maxLength={codeLength}
                  backgroundColor={'white'}
                  borderColor={'black'}
                  border={1}
                  width={260}
                  autoFocus
                />
              </Container>
              <DialogFooter>
                <Button onClick={() => join(code)}>
                  <Text>Join</Text>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogAnchor>
      </Fullscreen>
    </>
  );
}
