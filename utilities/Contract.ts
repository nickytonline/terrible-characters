import { ethers } from 'ethers';
import abi from './NoNonsenseNftGame.json';

export const CONTRACT_ADDRESS = '0xc9206A37F35340A7685b933Bd3025C3325491917';
export const contractAbi = abi.abi;

export type Contract = ethers.Contract & {
  getAllDefaultCharacters: () => RawCharacter[];
  getBigBoss: () => RawCharacter;
};

export interface RawCharacter {
  name: string;
  imageURI: string;
  hp: { toNumber: () => number };
  maxHp: { toNumber: () => number };
  attackDamage: { toNumber: () => number };
}

export interface Character {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
}

export interface ToNumber {
  toNumber: () => number;
}

export const transformCharacterData = (
  characterData: RawCharacter,
): Character => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};
