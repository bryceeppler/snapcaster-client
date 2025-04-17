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
  setName: string,
  promoted: boolean,
  tcg: string
) => {
  const domain = link.split('/')[2];
  const priceInCents = price * 100;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'buy_button_click',
    website: domain,
    card_name: cardName,
    set_name: setName,
    card_price: priceInCents,
    tcg: tcg
  });

  if (promoted) {
    let adId;
    switch (domain) {
      case 'chimeragamingonline.com':
        adId = '47';
        break;
      case 'exorgames.com':
        adId = '45';
        break;
      case 'levelupgames.ca':
        adId = '46';
        break;
      case 'obsidiangames.ca':
        adId = '48';
        break;
      default:
        adId = 'unknown';
    }
    trackAdClick(adId);
  }
};

export const trackAdClick = (adId: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'ad_click',
    ad_id: adId
  });
};

export const trackSearch = (
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
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'ad_visible',
    ad_id: adId
  });
};
