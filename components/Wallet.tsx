import { Maybe } from '@metamask/providers/dist/utils';
import { EtherscanLink } from '@components/EtherscanLink';
import { Button } from '@components/Button';
import Image from 'next/image';

export const Wallet: React.FC<{
  account: Maybe<string>;
  connectWallet: () => void;
}> = ({ account, connectWallet }) => {
  return (
    <div sx={{ display: 'grid', placeItems: 'center', margin: '1rem 0' }}>
      {account ? (
        <span
          sx={{
            display: 'inline-flex',
            background: '#000',
            color: '#fff',
            fontWeight: 500,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            '& a': {
              wordBreak: 'break-word',
            },
          }}
        >
          <span sx={{ marginRight: '0.25rem' }}>Account:</span>{' '}
          <EtherscanLink address={account} />
        </span>
      ) : (
        <div sx={{ display: 'grid', gridGap: '1rem' }}>
          <Image
            src="https://media.giphy.com/media/3o6UB5RrlQuMfZp82Y/giphy.gif"
            layout="responsive"
            width="480"
            height="356"
            alt="John Travolta in Pulp Fiction wandering around inside a wallet"
          />
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      )}
    </div>
  );
};
