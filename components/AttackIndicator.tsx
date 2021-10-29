import { keyframes } from '@emotion/react';

// Pulse animation modified from https://www.florin-pop.com/blog/2019/03/css-pulse-effect/
const pulse = keyframes`
  0% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1.5);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

interface AttackIndicatorProps {
  message?: 'string';
}

export const AttackIndicator: React.FC<AttackIndicatorProps> = ({
  message = 'Attacking... ⚔️',
}) => (
  <div
    sx={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      zIndex: 1,
      display: 'grid',
      placeItems: 'center',
    }}
  >
    <div
      sx={{
        borderRadius: '50%',
        boxShadow: '0 0 0 0 rgba(255, 255, 255, 1)',
        transform: 'scale(1)',
        display: 'grid',
        placeItems: 'center',
        width: '10rem',
        height: '10rem',
        color: '#000',
        backgroundColor: '#fff',
        '@media screen and (prefers-reduced-motion: no-preference)': {
          animation: `${pulse} 1.5s ease-in-out infinite`,
        },
      }}
    >
      <div>{message}</div>
    </div>
  </div>
);
