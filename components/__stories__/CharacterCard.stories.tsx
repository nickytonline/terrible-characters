import React, { MouseEventHandler } from 'react';

import { Meta } from '@storybook/react';
import { CharacterCard } from '@components/CharacterCard';
import { Character } from 'utilities/Contract';
import { action } from '@storybook/addon-actions';

const meta: Meta = {
  title: 'Components/Character Card',
  component: CharacterCard,
  argTypes: {
    character: {
      control: { type: 'object' },
      defaultValue: {
        name: 'Smasher',
        imageURI: '/nft-images/smasher.png',
        hp: 73,
        maxHp: 200,
        attackDamage: 45,
      },
    },
    mint: {
      control: { type: 'object' },
      defaultValue: action('minted'),
    },
  },
};
export default meta;

export const NonMinted: React.VFC<{
  character: Character;
  mint: MouseEventHandler<HTMLButtonElement>;
}> = ({ character, mint }) => {
  return <CharacterCard character={character} mint={mint} isPlaying={false} />;
};

export const Minted: React.VFC<{
  character: Character;
  mint: MouseEventHandler<HTMLButtonElement>;
}> = ({ character, mint }) => {
  return <CharacterCard character={character} isPlaying={true} />;
};
