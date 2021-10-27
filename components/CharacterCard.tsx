import { MouseEventHandler } from 'react';
import Image from 'next/image';
import { Character } from 'utilities/Contract';
import { Button } from './Button';
import MintIcon from '../public/mint.svg';

type CharacterCardProps =
  | { character: Character; isPlaying: true }
  | {
      character: Character;
      isPlaying: false;
      mint: MouseEventHandler<HTMLButtonElement>;
    };

export const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character } = props;

  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
        borderRadius: '0.5rem',
        backgroundImage: `linear-gradient(to right top, #d8ff10, #ffb900, #ff5843, #ff0099, #c312eb)`,
        padding: '1rem',
        width: '13rem',
        height: '18rem',
        transform: 'scale(1.0)',
        transition: 'transform 0.5s ease',
        position: 'relative',
        '&:hover': {
          zIndex: 1,
          '@media screen and (prefers-reduced-motion: no-preference)': {
            transform: 'scale(1.25)',
          },
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
      {!props.isPlaying && <Button onClick={props.mint}>mint</Button>}
    </div>
  );
};
