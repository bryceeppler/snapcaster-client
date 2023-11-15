import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-SVXYX5MVWZ'); // Replace with your Tracking ID
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const trackOutboundLink = (url: string, price:number) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'outgoing_conversion',
    label: url,
    value: price
  });
};
