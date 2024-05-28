import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-SVXYX5MVWZ'); // Replace with your Tracking ID
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const trackOutboundLink = (url: string, price: number) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'outgoing_conversion',
    label: url,
    value: price
  });
};

export const handleBuyClick = (
  link: string,
  price: number,
  cardName: string,
  tcg: string
) => {
  const domain = link.split('/')[2];
  const priceInCents = price * 100;

  // Push event to dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'buy_button_click',
    link_url: domain,
    card_name: cardName,
    card_price: priceInCents,
    tcg: tcg
  });
};
