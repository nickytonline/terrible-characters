import { BREAK } from 'graphql';
import Image from 'next/image';
import { Character } from 'utilities/Contract';
import { Button } from './Button';

type ArenaCardProps =
  | {
      character: Character;
      playerType: 'bigboss';
      attackState: 'attacking' | 'hit' | null;
    }
  | {
      character: Character;
      playerType: 'player';
      attack: () => void;
    };

export const ArenaCard: React.FC<ArenaCardProps> = (props) => {
  const { character, playerType } = props;

  let attackSymbol: string = '';

  if (props.playerType === 'bigboss' && props.attackState === 'hit') {
    attackSymbol = '💥';
  }

  if (character.hp === 0) {
    attackSymbol = '💀';
  }

  return (
    <div
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
        borderRadius: '0.5rem',
        background:
          playerType === 'player'
            ? `linear-gradient(to right top, #d8ff10, #ffb900, #ff5843, #ff0099, #c312eb)`
            : '#000',
        color: playerType === 'player' ? 'currentColor' : '#fff',
        padding: '1rem',
        width: '13rem',
        height: '23rem',
        '&::before': {
          position: 'absolute',
          zIndex: 1,
          top: -30,
          left: -30,
          fontSize: '6rem',
          content: `"${attackSymbol}"`,
        },
      }}
    >
      <span
        sx={{
          background: '#36454f',
          padding: '0.25rem 0.5rem',
          fontWeight: '600',
          color: '#fff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
        title={character.name}
      >
        {character.name}
      </span>
      <Image
        src={character.imageURI}
        alt={character.name}
        layout="responsive"
        width="200"
        height="200"
      />
      <div
        sx={{
          display: 'grid',
          placeItems: 'center',
          fontWeight: '600',
        }}
      >
        <progress value={character.hp} max={character.maxHp} />
        <p>{`${character.hp} / ${character.maxHp} HP`}</p>
      </div>
      {props.playerType === 'player' ? (
        <>
          <div
            sx={{
              padding: '0.25rem',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >{`Attack Damage: ${character.attackDamage}`}</div>
          <Button
            onClick={() => {
              if (character.hp > 0) {
                props.attack();
              }
            }}
          >
            Attack
          </Button>
        </>
      ) : (
        <div
          sx={{
            textTransform: 'uppercase',
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          <p>🔥&nbsp;big boss!&nbsp;🔥</p>
        </div>
      )}
    </div>
  );
};
