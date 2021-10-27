import { keyframes } from '@emotion/react';

const fadeInfadeOut = keyframes`
  from {
  	opacity: 0;
  }
  to {
 	opacity: 1;
  }
`;

export const Miner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <>
      <span
        aria-hidden="true"
        sx={{
          opacity: 1,
          '@media screen and (prefers-reduced-motion: no-preference)': {
            animation: `${fadeInfadeOut} 2.5s ease-in-out infinite`,
          },
          marginRight: '0.75rem',
        }}
      >
        💎
      </span>
      {message}
    </>
  );
};
