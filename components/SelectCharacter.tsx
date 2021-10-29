import { MouseEventHandler } from 'react';
import { Character } from 'utilities/Contract';
import { CharacterCard } from './CharacterCard';

export const SelectCharacter: React.FC<{
  characters: Character[];
  mint: (id: number) => MouseEventHandler<HTMLButtonElement>;
}> = ({ characters, mint }) => {
  return (
    <div sx={{ margin: '2.5rem' }}>
      <h2
        sx={{
          color: 'accent',
          textAlign: 'center',
          margin: '1.5rem 0',
          fontSize: '3rem',
        }}
      >
        Select a character
      </h2>
      <ul
        sx={{
          listStyle: 'none',
          display: 'grid',
          '@media only screen and (min-width: 768px) and (orientation: landscape)':
            {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
          justifyItems: 'center',
          gridGap: '1rem',
          margin: '0',
          padding: 0,
        }}
      >
        {characters.map((character, index) => (
          <li key={index}>
            <CharacterCard
              mint={mint(index)}
              isPlaying={false}
              character={character}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
