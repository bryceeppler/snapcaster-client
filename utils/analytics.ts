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

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'buy_button_click',
    website: domain,
    card_name: cardName,
    card_price: priceInCents,
    tcg: tcg
  });
};

export const handleAdClick = (adId: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'ad_click',
    ad_id: adId
  });
};

export const handleQuerySingleCard = (
  searchTerm: string,
  tradingCardGame: string,
  searchTool: string
) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'search',
    search_term: searchTerm,
    tcg: tradingCardGame,
    search_tool: searchTool
  });
};

export const trackAdVisible = (adId: string) => {
  window.dataLayer.push({
    event: 'ad_visible',
    ad_id: adId
  });
};
