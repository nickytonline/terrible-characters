import type { NextPage } from 'next';
import Head from 'next/head';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { BaseProvider } from '@metamask/providers';
import { Maybe } from '@metamask/providers/dist/utils';
import { toast, ToastContainer } from 'react-toastify';
import { RinkebyNetworkId } from 'utilities/NetworkIds';

import 'react-toastify/dist/ReactToastify.css';
import { Wallet } from '@components/Wallet';
import { SelectCharacter } from '@components/SelectCharacter';
import {
  contractAbi,
  CONTRACT_ADDRESS,
  transformCharacterData,
  RawCharacter,
  Character,
  Contract,
  ToNumber,
} from '../utilities/Contract';
import { Miner } from '@components/Miner';
import { getMissingMetamaskMessage } from 'utilities/metamask';
import Arena from '@components/Arena';
import { LoadingIndicator } from '@components/LoadingIndicator';

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState<Maybe<string>>(null);
  const [characterNft, setCharacterNft] = useState<Character | null>(null);
  const [gameContract, setGameContract] = useState<Contract | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function stopLoading() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        stopLoading();
        toast.error(getMissingMetamaskMessage());
        return;
      }

      if (
        ethereum.networkVersion != null &&
        ethereum.networkVersion !== RinkebyNetworkId
      ) {
        stopLoading();
        toast.error('You are not on the Rinkeby network.');
        return;
      }

      ethereum.on('accountsChanged', ([account]: Array<string>) => {
        if (account) {
          // We're only interested in the first account for now
          // to keep things simple
          setCurrentAccount(account);
        } else {
          setCurrentAccount(null);
          toast.warn(
            'No authorized account found. Connect your account in your Metamask wallet.',
          );
        }
      });

      const accounts = await ethereum.request<[string]>({
        method: 'eth_requestAccounts',
      });

      if (accounts?.length) {
        const [account] = accounts;
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      }
    } catch (error: any) {
      console.log(error);

      if (
        error.message.includes(
          `Request of type 'wallet_requestPermissions' already pending`,
        )
      ) {
        toast.info(
          `You've already requested to connect your Metamask wallet. Click on the Metamask wallet extension to bring it back to focus so you can connect your wallet.`,
        );
      } else if (error.message.includes(`User rejected the request.`)) {
        toast.info(`That's so sad. You decided to not connect your wallet. 😭`);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      stopLoading();
    }
  }

  function mintCharacterNftAction(characterId: number) {
    return async () => {
      let transactionId: string | undefined;

      try {
        if (gameContract) {
          const mintTxn = await gameContract.mintCharacterNFT(characterId);
          transactionId = mintTxn.hash;

          toast.info(<Miner message="Minting character" />, {
            autoClose: false,
            toastId: transactionId,
          });

          await mintTxn.wait();
          console.log(
            `Successfully minted character with id ${characterId}`,
            mintTxn,
          );
          toast.success(`Successfully minted character with id ${characterId}`);
        }
      } catch (error: unknown) {
        console.warn('MintCharacterAction Error:', error);

        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        if (transactionId != null) {
          toast.dismiss(transactionId);
        }
      }
    };
  }

  useEffect(() => {
    async function checkIfWalletIsConnected(ethereum: BaseProvider) {
      try {
        const accounts = await ethereum.request<[string]>({
          method: 'eth_accounts',
        });

        if (accounts?.length) {
          const [account] = accounts;
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        }
      } catch (error) {
        console.dir(error);
        toast.error('An unknown error occurred connecting your account.');
      } finally {
        stopLoading();
      }
    }

    const { ethereum } = window;

    if (!ethereum) {
      stopLoading();
      toast.error(getMissingMetamaskMessage());
      return;
    }

    if (
      ethereum.networkVersion != null &&
      ethereum.networkVersion !== RinkebyNetworkId
    ) {
      stopLoading();
      toast.error('You are not on the Rinkeby network.');
      return;
    }

    checkIfWalletIsConnected(ethereum);

    document.querySelector('.Toastify')?.setAttribute('aria-live', 'polite');
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNftMetadata = async () => {
      setIsLoading(true);
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi,
        signer,
      ) as Contract;

      setGameContract(gameContract);

      const txn: RawCharacter = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT', txn);

        const character = transformCharacterData(txn);
        setCharacterNft(character);
        stopLoading();

        toast.info(
          <>
            <p>You have the NFT character {character.name}.</p>
            <p>To the Arena! 🔥 ⚔️ 🔥</p>
          </>,
        );
      } else {
        toast.info('No character NFT found. Select a character.');
      }
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNftMetadata();
    }
  }, [currentAccount]);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');

        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract?.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        /*
         * Go through all of our characters and transform the data
         */
        const characters =
          charactersTxn?.map((characterData) =>
            transformCharacterData(characterData),
          ) ?? ([] as Character[]);

        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    async function onCharacterMint(
      sender: unknown,
      tokenId: ToNumber,
      characterIndex: ToNumber,
    ) {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`,
      );

      /*
       * Once our character NFT is minted we can fetch the metadata from our contract
       * and set it in state to move onto the Arena
       */
      if (gameContract) {
        const characterNft = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNft);
        toast.info(
          `Minted character with name ${characterNft.name} has been loaded.`,
        );
        setCharacterNft(transformCharacterData(characterNft));
      }
    }

    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  }, [gameContract]);

  const isPlaying = currentAccount && characterNft;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Head>
        <title>Terrible Characters!</title>
        <meta name="description" content="Welcome to Web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1
          sx={{
            fontFamily: 'Dokdo',
            color: 'rgba(121,9,59,0.8169642857142857)',
            fontSize: '3rem',
            '@media only screen and (min-width: 768px) and (orientation: landscape)':
              {
                fontSize: '5rem',
              },
            textAlign: 'center',
          }}
        >
          Terrible Characters!
        </h1>
      </header>
      <main>
        <ToastContainer position="top-right" theme="dark" />
        <Wallet connectWallet={connectWallet} account={currentAccount} />
        {currentAccount && !characterNft && (
          <>
            <SelectCharacter
              characters={characters}
              mint={mintCharacterNftAction}
            />
          </>
        )}
        {isPlaying && (
          <Arena character={characterNft} updateCharacter={setCharacterNft} />
        )}
      </main>
      <footer>
        <nav>
          <ul
            sx={{
              listStyle: 'none',
              display: 'flex',
              margin: 0,
              marginTop: '1rem',
              padding: 0,
              justifyContent: 'space-between',
              '& li + li': {
                paddingLeft: '1rem',
              },
            }}
          >
            <li>
              <a href="https://github.com/nickytonline/terrible-characters">
                source code
              </a>
            </li>
            <li>
              <a href="https://timeline.iamdeveloper.com">about Nick</a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
};

export default Home;
