import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  transformCharacterData,
  contractAbi,
  Character,
  Contract,
  ToNumber,
} from '../utilities/Contract';
import { toast } from 'react-toastify';
import { getMissingMetamaskMessage } from 'utilities/metamask';
import { ArenaCard } from './ArenaCard';
import { LoadingIndicator } from './LoadingIndicator';

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena: React.FC<{
  character: Character;
  updateCharacter: (value: React.SetStateAction<Character | null>) => void;
}> = ({ character, updateCharacter }) => {
  // State
  const [gameContract, setGameContract] = useState<Contract | null>(null);
  const [attackState, setAttackState] = useState<'attacking' | 'hit' | null>(
    null,
  );

  async function attackBoss() {
    try {
      if (gameContract) {
        setAttackState('attacking');
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');

        setTimeout(() => {
          setAttackState(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState(null);
    }
  }

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum) {
      toast.error(getMissingMetamaskMessage());
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi,
      signer,
    ) as Contract;

    setGameContract(gameContract);
  }, []);

  const [boss, setBoss] = useState<Character | null>(null);

  useEffect(() => {
    if (!gameContract) {
      return;
    }

    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    fetchBoss();
  }, [gameContract]);

  useEffect(() => {
    if (!gameContract) {
      return;
    }

    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /*
     * Setup logic when this event is fired off
     */
    const onAttackComplete = (newBossHp: ToNumber, newPlayerHp: ToNumber) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * Update both player and boss Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp } as Character | null;
      });

      updateCharacter((prevState) => {
        return { ...prevState, hp: playerHp } as Character | null;
      });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    /*
     * Make sure to clean up this event when this component is removed
     */
    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
      }
    };
  }, [gameContract, updateCharacter]);

  return (
    boss && (
      <div
        sx={{
          position: 'relative',
        }}
      >
        <div
          sx={{
            display: 'grid',
            placeItems: 'center',
            gridGap: '1rem',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <ArenaCard
            character={boss}
            playerType="bigboss"
            attackState={attackState}
          />

          <ArenaCard
            character={character}
            playerType="player"
            attack={attackBoss}
          />
        </div>
        {attackState === 'attacking' && <LoadingIndicator variant="attack" />}
      </div>
    )
  );
};

export default Arena;
