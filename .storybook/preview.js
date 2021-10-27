import React from 'react';
import { ThemeProvider } from '@theme-ui/theme-provider';
import { defaultTheme } from '../themes/defaultTheme';
import * as NextImage from 'next/image';
import '../styles/globals.css';

// https://dev.to/jonasmerlin/how-to-use-the-next-js-image-component-in-storybook-1415
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const decorators = [
  (Story) => (
    <ThemeProvider theme={defaultTheme}>
      <div
        sx={{
          fontFamily: 'body',
          display: 'grid',
          placeItems: 'center',
          height: '100vh',
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
