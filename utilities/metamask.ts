function isMobile() {
  return /mobile|ipad|iphone|ios/i.test(navigator.userAgent.toLowerCase());
}

export function getMissingMetamaskMessage() {
  if (isMobile()) {
    return `You are on a mobile device. To continue, open the Metamask application on your device and use the built-in browser to load the site.`;
  } else {
    return 'The Metamask browser extension was not detected. Unable to continue. Ensure the extenson is installed and enabled.';
  }
}
