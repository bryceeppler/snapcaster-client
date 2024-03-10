import { create } from 'zustand';
import { useRef, useEffect } from 'react';
import { useStore } from '@/stores/store';
import axiosInstance from '@/utils/axiosWrapper';

// The huge Filter lists are temporary. I'll have the scraper store it in the mongo database so I dont have to manually update it here

export interface Filter {
  name: string;
  abbreviation: string;
}

export interface AdvancedSearchResult {
  name: string;
  link: string;
  image: string;
  set: string;
  condition: string;
  foil: string;
  price: number;
  website: string;
  preRelease: boolean;
  promoPack: boolean;
  showcase: string;
  artType: string;
  alternateArt: boolean;
  retro: boolean;
  artSeries: boolean;
  goldenStampedSeries: boolean;
  other: string;
  number: number;
}

export const useOutsideClick = (callback: () => void) => {
  const sortRadioRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortRadioRef.current &&
        !sortRadioRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);
  return sortRadioRef;
};

const shopifyOnlySites = useStore.getState().websites.filter(function (item) {
  return item.shopify == true;
});

const websiteList: Filter[] = shopifyOnlySites.map((item) => ({
  name: item.name,
  abbreviation: item.code
}));

const conditionList: Filter[] = [
  {
    name: 'Near Mint',
    abbreviation: 'NM'
  },
  {
    name: 'Lightly Played',
    abbreviation: 'LP'
  },
  {
    name: 'Moderetly Played',
    abbreviation: 'MP'
  },
  {
    name: 'Heavily Played',
    abbreviation: 'HP'
  },
  {
    name: 'Damaged',
    abbreviation: 'DMG'
  }
];
const artTypeList: Filter[] = [
  {
    name: 'Borderless',
    abbreviation: 'Borderless'
  },
  {
    name: 'Extended Art',
    abbreviation: 'Extended Art'
  },
  {
    name: 'Full Art',
    abbreviation: 'Full Art'
  }
];

const otherList: Filter[] = [
  {
    name: 'Anime',
    abbreviation: 'Anime'
  },
  {
    name: 'Manga',
    abbreviation: 'Manga'
  },
  {
    name: 'The Moonlit Lands',
    abbreviation: 'The Moonlit Lands'
  }
];
const sortByList: Filter[] = [
  {
    name: 'Price',
    abbreviation: 'price'
  },
  {
    name: 'Name',
    abbreviation: 'name'
  },
  {
    name: 'Website',
    abbreviation: 'website'
  },
  {
    name: 'Set',
    abbreviation: 'set'
  },
  {
    name: 'Condition',
    abbreviation: 'condition'
  }
];

const foilList: Filter[] = [
  {
    name: 'Regular Foil',
    abbreviation: 'Foil'
  },
  {
    name: 'Etched',
    abbreviation: 'Etched'
  },
  {
    name: 'Ampersand',
    abbreviation: 'Ampersand'
  },
  {
    name: 'Neon Ink',
    abbreviation: 'Neon Ink'
  },
  {
    name: 'Gilded',
    abbreviation: 'Gilded'
  },
  {
    name: 'Galaxy',
    abbreviation: 'Galaxy'
  },
  {
    name: 'Surge',
    abbreviation: 'Surge'
  },
  {
    name: 'Textured',
    abbreviation: 'Textured'
  },
  {
    name: 'Serialized',
    abbreviation: 'Serialized'
  },
  {
    name: 'Step and Compleat',
    abbreviation: 'Compleat'
  },
  {
    name: 'Oil Slick',
    abbreviation: 'Oil Slick'
  },
  {
    name: 'Halo',
    abbreviation: 'Halo'
  },
  {
    name: 'Invisible Ink',
    abbreviation: 'Invisible Ink'
  },
  {
    name: 'Rainbow',
    abbreviation: 'Rainbow'
  }
];

const showcaseTreatmentList: Filter[] = [
  {
    name: 'Regular Showcase',
    abbreviation: 'Showcase'
  },
  {
    name: 'Ninja',
    abbreviation: 'Ninja'
  },
  {
    name: 'Samurai',
    abbreviation: 'Samurai'
  },
  {
    name: 'Golden Age',
    abbreviation: 'Golden Age'
  },
  {
    name: 'Art Deco',
    abbreviation: 'Art Deco'
  },
  {
    name: 'Skyscraper',
    abbreviation: 'Skyscraper'
  },
  {
    name: 'Ring Frame',
    abbreviation: 'Ring Frame'
  },
  {
    name: 'Fang Frame',
    abbreviation: 'Fang Frame'
  },
  {
    name: 'Eternal Night',
    abbreviation: 'Eternal Night'
  },
  {
    name: 'Sketch',
    abbreviation: 'Sketch'
  },
  {
    name: 'Dungeon Module',
    abbreviation: 'Dungeon Module'
  },
  {
    name: 'Ichor',
    abbreviation: 'Ichor'
  },
  {
    name: 'Phyrexian',
    abbreviation: 'Phyrexian'
  },
  {
    name: 'Scrolls',
    abbreviation: 'Scrolls'
  }
];

const setList: Filter[] = [
  { name: '15th Anniversary Cards', abbreviation: '15th Anniversary Cards' },
  {
    name: '2016 Heroes of the Realm',
    abbreviation: '2016 Heroes of the Realm'
  },
  { name: '2017 Gift Pack', abbreviation: '2017 Gift Pack' },
  {
    name: '2017 Heroes of the Realm',
    abbreviation: '2017 Heroes of the Realm'
  },
  {
    name: '2018 Heroes of the Realm',
    abbreviation: '2018 Heroes of the Realm'
  },
  {
    name: '2019 Heroes of the Realm',
    abbreviation: '2019 Heroes of the Realm'
  },
  {
    name: '2020 Heroes of the Realm',
    abbreviation: '2020 Heroes of the Realm'
  },
  {
    name: '2021 Heroes of the Realm',
    abbreviation: '2021 Heroes of the Realm'
  },
  {
    name: '2022 Heroes of the Realm',
    abbreviation: '2022 Heroes of the Realm'
  },
  {
    name: '30th Anniversary Celebration Tokyo',
    abbreviation: '30th Anniversary Celebration Tokyo'
  },
  {
    name: '30th Anniversary Edition',
    abbreviation: '30th Anniversary Edition'
  },
  {
    name: '30th Anniversary History Promos',
    abbreviation: '30th Anniversary History Promos'
  },
  {
    name: '30th Anniversary Misc Promos',
    abbreviation: '30th Anniversary Misc Promos'
  },
  {
    name: '30th Anniversary Play Promos',
    abbreviation: '30th Anniversary Play Promos'
  },
  { name: '30th Anniversary Tokens', abbreviation: '30th Anniversary Tokens' },
  {
    name: 'Adventures in the Forgotten Realms Art Series',
    abbreviation: 'Adventures in the Forgotten Realms Art Series'
  },
  {
    name: 'Adventures in the Forgotten Realms Minigames',
    abbreviation: 'Adventures in the Forgotten Realms Minigames'
  },
  {
    name: 'Adventures in the Forgotten Realms Promos',
    abbreviation: 'Adventures in the Forgotten Realms Promos'
  },
  {
    name: 'Adventures in the Forgotten Realms Tokens',
    abbreviation: 'Adventures in the Forgotten Realms Tokens'
  },
  {
    name: 'Adventures in the Forgotten Realms',
    abbreviation: 'Adventures in the Forgotten Realms'
  },
  { name: 'Aether Revolt Promos', abbreviation: 'Aether Revolt Promos' },
  { name: 'Aether Revolt Tokens', abbreviation: 'Aether Revolt Tokens' },
  { name: 'Aether Revolt', abbreviation: 'Aether Revolt' },
  { name: 'Alara Reborn Promos', abbreviation: 'Alara Reborn Promos' },
  { name: 'Alara Reborn Tokens', abbreviation: 'Alara Reborn Tokens' },
  { name: 'Alara Reborn', abbreviation: 'Alara Reborn' },
  {
    name: "Alchemy Horizons: Baldur's Gate",
    abbreviation: "Alchemy Horizons: Baldur's Gate"
  },
  { name: 'Alchemy: Dominaria', abbreviation: 'Alchemy: Dominaria' },
  { name: 'Alchemy: Innistrad', abbreviation: 'Alchemy: Innistrad' },
  { name: 'Alchemy: Ixalan', abbreviation: 'Alchemy: Ixalan' },
  { name: 'Alchemy: Kamigawa', abbreviation: 'Alchemy: Kamigawa' },
  { name: 'Alchemy: New Capenna', abbreviation: 'Alchemy: New Capenna' },
  { name: 'Alchemy: Phyrexia', abbreviation: 'Alchemy: Phyrexia' },
  {
    name: "Alchemy: The Brothers' War",
    abbreviation: "Alchemy: The Brothers' War"
  },
  {
    name: 'Alchemy: Wilds of Eldraine',
    abbreviation: 'Alchemy: Wilds of Eldraine'
  },
  { name: 'Alliances', abbreviation: 'Alliances' },
  { name: 'Amonkhet Invocations', abbreviation: 'Amonkhet Invocations' },
  { name: 'Amonkhet Promos', abbreviation: 'Amonkhet Promos' },
  { name: 'Amonkhet Remastered', abbreviation: 'Amonkhet Remastered' },
  { name: 'Amonkhet Tokens', abbreviation: 'Amonkhet Tokens' },
  { name: 'Amonkhet', abbreviation: 'Amonkhet' },
  { name: 'Anthologies', abbreviation: 'Anthologies' },
  { name: 'Antiquities', abbreviation: 'Antiquities' },
  { name: 'Apocalypse Promos', abbreviation: 'Apocalypse Promos' },
  { name: 'Apocalypse', abbreviation: 'Apocalypse' },
  { name: 'Arabian Nights', abbreviation: 'Arabian Nights' },
  { name: 'Archenemy Schemes', abbreviation: 'Archenemy Schemes' },
  { name: 'Archenemy', abbreviation: 'Archenemy' },
  {
    name: 'Archenemy: Nicol Bolas Schemes',
    abbreviation: 'Archenemy: Nicol Bolas Schemes'
  },
  {
    name: 'Archenemy: Nicol Bolas Tokens',
    abbreviation: 'Archenemy: Nicol Bolas Tokens'
  },
  { name: 'Archenemy: Nicol Bolas', abbreviation: 'Archenemy: Nicol Bolas' },
  { name: 'Arena Beginner Set', abbreviation: 'Arena Beginner Set' },
  { name: 'Arena League 1996', abbreviation: 'Arena League 1996' },
  { name: 'Arena League 1999', abbreviation: 'Arena League 1999' },
  { name: 'Arena League 2000', abbreviation: 'Arena League 2000' },
  { name: 'Arena League 2001', abbreviation: 'Arena League 2001' },
  { name: 'Arena League 2002', abbreviation: 'Arena League 2002' },
  { name: 'Arena League 2003', abbreviation: 'Arena League 2003' },
  { name: 'Arena League 2004', abbreviation: 'Arena League 2004' },
  { name: 'Arena League 2005', abbreviation: 'Arena League 2005' },
  { name: 'Arena League 2006', abbreviation: 'Arena League 2006' },
  {
    name: 'Arena New Player Experience Cards',
    abbreviation: 'Arena New Player Experience Cards'
  },
  {
    name: 'Arena New Player Experience Extras',
    abbreviation: 'Arena New Player Experience Extras'
  },
  {
    name: 'Arena New Player Experience',
    abbreviation: 'Arena New Player Experience'
  },
  {
    name: 'Asia Pacific Land Program',
    abbreviation: 'Asia Pacific Land Program'
  },
  { name: "Assassin's Creed", abbreviation: "Assassin's Creed" },
  { name: 'Astral Cards', abbreviation: 'Astral Cards' },
  { name: 'Avacyn Restored Promos', abbreviation: 'Avacyn Restored Promos' },
  { name: 'Avacyn Restored Tokens', abbreviation: 'Avacyn Restored Tokens' },
  { name: 'Avacyn Restored', abbreviation: 'Avacyn Restored' },
  { name: 'BFZ Standard Series', abbreviation: 'BFZ Standard Series' },
  { name: 'Battle Royale Box Set', abbreviation: 'Battle Royale Box Set' },
  {
    name: "Battle for Baldur's Gate Art Series",
    abbreviation: "Battle for Baldur's Gate Art Series"
  },
  {
    name: "Battle for Baldur's Gate Promos",
    abbreviation: "Battle for Baldur's Gate Promos"
  },
  {
    name: "Battle for Baldur's Gate Tokens",
    abbreviation: "Battle for Baldur's Gate Tokens"
  },
  {
    name: 'Battle for Zendikar Promos',
    abbreviation: 'Battle for Zendikar Promos'
  },
  {
    name: 'Battle for Zendikar Tokens',
    abbreviation: 'Battle for Zendikar Tokens'
  },
  { name: 'Battle for Zendikar', abbreviation: 'Battle for Zendikar' },
  { name: 'Battle the Horde', abbreviation: 'Battle the Horde' },
  { name: 'Battlebond Promos', abbreviation: 'Battlebond Promos' },
  { name: 'Battlebond Tokens', abbreviation: 'Battlebond Tokens' },
  { name: 'Battlebond', abbreviation: 'Battlebond' },
  { name: 'Beatdown Box Set', abbreviation: 'Beatdown Box Set' },
  {
    name: 'Betrayers of Kamigawa Promos',
    abbreviation: 'Betrayers of Kamigawa Promos'
  },
  { name: 'Betrayers of Kamigawa', abbreviation: 'Betrayers of Kamigawa' },
  { name: 'Bloomburrow Tokens', abbreviation: 'Bloomburrow Tokens' },
  { name: 'Bloomburrow', abbreviation: 'Bloomburrow' },
  {
    name: "Born of the Gods Hero's Path",
    abbreviation: "Born of the Gods Hero's Path"
  },
  { name: 'Born of the Gods Promos', abbreviation: 'Born of the Gods Promos' },
  { name: 'Born of the Gods Tokens', abbreviation: 'Born of the Gods Tokens' },
  { name: 'Born of the Gods', abbreviation: 'Born of the Gods' },
  { name: 'Breaking News', abbreviation: 'Breaking News' },
  { name: 'Celebration Cards', abbreviation: 'Celebration Cards' },
  { name: 'Challenger Decks 2022', abbreviation: 'Challenger Decks 2022' },
  {
    name: 'Champions of Kamigawa Promos',
    abbreviation: 'Champions of Kamigawa Promos'
  },
  { name: 'Champions of Kamigawa', abbreviation: 'Champions of Kamigawa' },
  { name: 'Champs and States', abbreviation: 'Champs and States' },
  {
    name: 'Chronicles Foreign Black Border',
    abbreviation: 'Chronicles Foreign Black Border'
  },
  { name: 'Chronicles', abbreviation: 'Chronicles' },
  { name: 'Classic Sixth Edition', abbreviation: 'Classic Sixth Edition' },
  { name: 'Coldsnap Promos', abbreviation: 'Coldsnap Promos' },
  { name: 'Coldsnap Theme Decks', abbreviation: 'Coldsnap Theme Decks' },
  { name: 'Coldsnap', abbreviation: 'Coldsnap' },
  { name: "Collectors' Edition", abbreviation: "Collectors' Edition" },
  {
    name: 'Commander 2011 Launch Party',
    abbreviation: 'Commander 2011 Launch Party'
  },
  {
    name: 'Commander 2011 Oversized',
    abbreviation: 'Commander 2011 Oversized'
  },
  { name: 'Commander 2011', abbreviation: 'Commander 2011' },
  {
    name: 'Commander 2013 Oversized',
    abbreviation: 'Commander 2013 Oversized'
  },
  { name: 'Commander 2013', abbreviation: 'Commander 2013' },
  {
    name: 'Commander 2014 Oversized',
    abbreviation: 'Commander 2014 Oversized'
  },
  { name: 'Commander 2014 Tokens', abbreviation: 'Commander 2014 Tokens' },
  { name: 'Commander 2014', abbreviation: 'Commander 2014' },
  {
    name: 'Commander 2015 Oversized',
    abbreviation: 'Commander 2015 Oversized'
  },
  { name: 'Commander 2015 Tokens', abbreviation: 'Commander 2015 Tokens' },
  { name: 'Commander 2015', abbreviation: 'Commander 2015' },
  {
    name: 'Commander 2016 Oversized',
    abbreviation: 'Commander 2016 Oversized'
  },
  { name: 'Commander 2016 Tokens', abbreviation: 'Commander 2016 Tokens' },
  { name: 'Commander 2016', abbreviation: 'Commander 2016' },
  {
    name: 'Commander 2017 Oversized',
    abbreviation: 'Commander 2017 Oversized'
  },
  { name: 'Commander 2017 Tokens', abbreviation: 'Commander 2017 Tokens' },
  { name: 'Commander 2017', abbreviation: 'Commander 2017' },
  {
    name: 'Commander 2018 Oversized',
    abbreviation: 'Commander 2018 Oversized'
  },
  { name: 'Commander 2018 Tokens', abbreviation: 'Commander 2018 Tokens' },
  { name: 'Commander 2018', abbreviation: 'Commander 2018' },
  {
    name: 'Commander 2019 Oversized',
    abbreviation: 'Commander 2019 Oversized'
  },
  { name: 'Commander 2019 Tokens', abbreviation: 'Commander 2019 Tokens' },
  { name: 'Commander 2019', abbreviation: 'Commander 2019' },
  {
    name: 'Commander 2020 Oversized',
    abbreviation: 'Commander 2020 Oversized'
  },
  { name: 'Commander 2020 Tokens', abbreviation: 'Commander 2020 Tokens' },
  { name: 'Commander 2020', abbreviation: 'Commander 2020' },
  {
    name: 'Commander 2021 Display Commanders',
    abbreviation: 'Commander 2021 Display Commanders'
  },
  { name: 'Commander 2021 Tokens', abbreviation: 'Commander 2021 Tokens' },
  { name: 'Commander 2021', abbreviation: 'Commander 2021' },
  {
    name: 'Commander Anthology Tokens',
    abbreviation: 'Commander Anthology Tokens'
  },
  {
    name: 'Commander Anthology Volume II Tokens',
    abbreviation: 'Commander Anthology Volume II Tokens'
  },
  {
    name: 'Commander Anthology Volume II',
    abbreviation: 'Commander Anthology Volume II'
  },
  { name: 'Commander Anthology', abbreviation: 'Commander Anthology' },
  {
    name: 'Commander Collection: Black',
    abbreviation: 'Commander Collection: Black'
  },
  {
    name: 'Commander Collection: Green',
    abbreviation: 'Commander Collection: Green'
  },
  {
    name: 'Commander Legends Tokens',
    abbreviation: 'Commander Legends Tokens'
  },
  { name: 'Commander Legends', abbreviation: 'Commander Legends' },
  {
    name: "Commander Legends: Battle for Baldur's Gate Minigames",
    abbreviation: "Commander Legends: Battle for Baldur's Gate Minigames"
  },
  {
    name: "Commander Legends: Battle for Baldur's Gate",
    abbreviation: "Commander Legends: Battle for Baldur's Gate"
  },
  {
    name: 'Commander Masters Art Series',
    abbreviation: 'Commander Masters Art Series'
  },
  {
    name: 'Commander Masters Tokens',
    abbreviation: 'Commander Masters Tokens'
  },
  { name: 'Commander Masters', abbreviation: 'Commander Masters' },
  {
    name: "Commander's Arsenal Oversized",
    abbreviation: "Commander's Arsenal Oversized"
  },
  { name: "Commander's Arsenal", abbreviation: "Commander's Arsenal" },
  { name: 'Conflux Promos', abbreviation: 'Conflux Promos' },
  { name: 'Conflux Tokens', abbreviation: 'Conflux Tokens' },
  { name: 'Conflux', abbreviation: 'Conflux' },
  { name: 'Conspiracy Promos', abbreviation: 'Conspiracy Promos' },
  { name: 'Conspiracy Tokens', abbreviation: 'Conspiracy Tokens' },
  { name: 'Conspiracy', abbreviation: 'Conspiracy' },
  {
    name: 'Conspiracy: Take the Crown Tokens',
    abbreviation: 'Conspiracy: Take the Crown Tokens'
  },
  {
    name: 'Conspiracy: Take the Crown',
    abbreviation: 'Conspiracy: Take the Crown'
  },
  { name: 'Core Set 2019 Promos', abbreviation: 'Core Set 2019 Promos' },
  { name: 'Core Set 2019 Tokens', abbreviation: 'Core Set 2019 Tokens' },
  { name: 'Core Set 2019', abbreviation: 'Core Set 2019' },
  { name: 'Core Set 2020 Promos', abbreviation: 'Core Set 2020 Promos' },
  { name: 'Core Set 2020 Tokens', abbreviation: 'Core Set 2020 Tokens' },
  { name: 'Core Set 2020', abbreviation: 'Core Set 2020' },
  { name: 'Core Set 2021 Promos', abbreviation: 'Core Set 2021 Promos' },
  { name: 'Core Set 2021 Tokens', abbreviation: 'Core Set 2021 Tokens' },
  { name: 'Core Set 2021', abbreviation: 'Core Set 2021' },
  { name: 'Crimson Vow Art Series', abbreviation: 'Crimson Vow Art Series' },
  {
    name: 'Crimson Vow Commander Display Commanders',
    abbreviation: 'Crimson Vow Commander Display Commanders'
  },
  {
    name: 'Crimson Vow Commander Tokens',
    abbreviation: 'Crimson Vow Commander Tokens'
  },
  { name: 'Crimson Vow Commander', abbreviation: 'Crimson Vow Commander' },
  { name: 'DCI Legend Membership', abbreviation: 'DCI Legend Membership' },
  { name: 'DCI Promos', abbreviation: 'DCI Promos' },
  {
    name: 'DMU Japanese Promo Tokens',
    abbreviation: 'DMU Japanese Promo Tokens'
  },
  { name: 'Dark Ascension Promos', abbreviation: 'Dark Ascension Promos' },
  { name: 'Dark Ascension Tokens', abbreviation: 'Dark Ascension Tokens' },
  { name: 'Dark Ascension', abbreviation: 'Dark Ascension' },
  { name: 'Darksteel Promos', abbreviation: 'Darksteel Promos' },
  { name: 'Darksteel', abbreviation: 'Darksteel' },
  { name: 'Deckmasters', abbreviation: 'Deckmasters' },
  { name: 'Defeat a God', abbreviation: 'Defeat a God' },
  { name: 'Dissension Promos', abbreviation: 'Dissension Promos' },
  { name: 'Dissension', abbreviation: 'Dissension' },
  { name: 'Doctor Who Tokens', abbreviation: 'Doctor Who Tokens' },
  { name: 'Doctor Who', abbreviation: 'Doctor Who' },
  { name: 'Dominaria Promos', abbreviation: 'Dominaria Promos' },
  {
    name: 'Dominaria Remastered Tokens',
    abbreviation: 'Dominaria Remastered Tokens'
  },
  { name: 'Dominaria Remastered', abbreviation: 'Dominaria Remastered' },
  { name: 'Dominaria Tokens', abbreviation: 'Dominaria Tokens' },
  {
    name: 'Dominaria United Art Series',
    abbreviation: 'Dominaria United Art Series'
  },
  {
    name: 'Dominaria United Commander Tokens',
    abbreviation: 'Dominaria United Commander Tokens'
  },
  {
    name: 'Dominaria United Commander',
    abbreviation: 'Dominaria United Commander'
  },
  {
    name: 'Dominaria United Jumpstart Front Cards',
    abbreviation: 'Dominaria United Jumpstart Front Cards'
  },
  {
    name: 'Dominaria United Minigames',
    abbreviation: 'Dominaria United Minigames'
  },
  { name: 'Dominaria United Promos', abbreviation: 'Dominaria United Promos' },
  {
    name: 'Dominaria United Southeast Asia Tokens',
    abbreviation: 'Dominaria United Southeast Asia Tokens'
  },
  { name: 'Dominaria United Tokens', abbreviation: 'Dominaria United Tokens' },
  { name: 'Dominaria United', abbreviation: 'Dominaria United' },
  { name: 'Dominaria', abbreviation: 'Dominaria' },
  {
    name: 'Double Masters 2022 Tokens',
    abbreviation: 'Double Masters 2022 Tokens'
  },
  { name: 'Double Masters 2022', abbreviation: 'Double Masters 2022' },
  { name: 'Double Masters Tokens', abbreviation: 'Double Masters Tokens' },
  { name: 'Double Masters', abbreviation: 'Double Masters' },
  { name: 'Dragon Con', abbreviation: 'Dragon Con' },
  { name: "Dragon's Maze Promos", abbreviation: "Dragon's Maze Promos" },
  { name: "Dragon's Maze Tokens", abbreviation: "Dragon's Maze Tokens" },
  { name: "Dragon's Maze", abbreviation: "Dragon's Maze" },
  {
    name: 'Dragons of Tarkir Promos',
    abbreviation: 'Dragons of Tarkir Promos'
  },
  {
    name: 'Dragons of Tarkir Tokens',
    abbreviation: 'Dragons of Tarkir Tokens'
  },
  { name: 'Dragons of Tarkir', abbreviation: 'Dragons of Tarkir' },
  {
    name: 'Duel Decks Anthology: Divine vs. Demonic Tokens',
    abbreviation: 'Duel Decks Anthology: Divine vs. Demonic Tokens'
  },
  {
    name: 'Duel Decks Anthology: Divine vs. Demonic',
    abbreviation: 'Duel Decks Anthology: Divine vs. Demonic'
  },
  {
    name: 'Duel Decks Anthology: Elves vs. Goblins Tokens',
    abbreviation: 'Duel Decks Anthology: Elves vs. Goblins Tokens'
  },
  {
    name: 'Duel Decks Anthology: Elves vs. Goblins',
    abbreviation: 'Duel Decks Anthology: Elves vs. Goblins'
  },
  {
    name: 'Duel Decks Anthology: Garruk vs. Liliana Tokens',
    abbreviation: 'Duel Decks Anthology: Garruk vs. Liliana Tokens'
  },
  {
    name: 'Duel Decks Anthology: Garruk vs. Liliana',
    abbreviation: 'Duel Decks Anthology: Garruk vs. Liliana'
  },
  {
    name: 'Duel Decks Anthology: Jace vs. Chandra Tokens',
    abbreviation: 'Duel Decks Anthology: Jace vs. Chandra Tokens'
  },
  {
    name: 'Duel Decks Anthology: Jace vs. Chandra',
    abbreviation: 'Duel Decks Anthology: Jace vs. Chandra'
  },
  {
    name: 'Duel Decks: Ajani vs. Nicol Bolas Tokens',
    abbreviation: 'Duel Decks: Ajani vs. Nicol Bolas Tokens'
  },
  {
    name: 'Duel Decks: Ajani vs. Nicol Bolas',
    abbreviation: 'Duel Decks: Ajani vs. Nicol Bolas'
  },
  {
    name: 'Duel Decks: Blessed vs. Cursed',
    abbreviation: 'Duel Decks: Blessed vs. Cursed'
  },
  {
    name: 'Duel Decks: Divine vs. Demonic Tokens',
    abbreviation: 'Duel Decks: Divine vs. Demonic Tokens'
  },
  {
    name: 'Duel Decks: Divine vs. Demonic',
    abbreviation: 'Duel Decks: Divine vs. Demonic'
  },
  {
    name: 'Duel Decks: Elspeth vs. Kiora',
    abbreviation: 'Duel Decks: Elspeth vs. Kiora'
  },
  {
    name: 'Duel Decks: Elspeth vs. Tezzeret Tokens',
    abbreviation: 'Duel Decks: Elspeth vs. Tezzeret Tokens'
  },
  {
    name: 'Duel Decks: Elspeth vs. Tezzeret',
    abbreviation: 'Duel Decks: Elspeth vs. Tezzeret'
  },
  {
    name: 'Duel Decks: Elves vs. Goblins Tokens',
    abbreviation: 'Duel Decks: Elves vs. Goblins Tokens'
  },
  {
    name: 'Duel Decks: Elves vs. Goblins',
    abbreviation: 'Duel Decks: Elves vs. Goblins'
  },
  {
    name: 'Duel Decks: Elves vs. Inventors Tokens',
    abbreviation: 'Duel Decks: Elves vs. Inventors Tokens'
  },
  {
    name: 'Duel Decks: Elves vs. Inventors',
    abbreviation: 'Duel Decks: Elves vs. Inventors'
  },
  {
    name: 'Duel Decks: Garruk vs. Liliana Tokens',
    abbreviation: 'Duel Decks: Garruk vs. Liliana Tokens'
  },
  {
    name: 'Duel Decks: Garruk vs. Liliana',
    abbreviation: 'Duel Decks: Garruk vs. Liliana'
  },
  {
    name: 'Duel Decks: Heroes vs. Monsters Tokens',
    abbreviation: 'Duel Decks: Heroes vs. Monsters Tokens'
  },
  {
    name: 'Duel Decks: Heroes vs. Monsters',
    abbreviation: 'Duel Decks: Heroes vs. Monsters'
  },
  {
    name: 'Duel Decks: Izzet vs. Golgari Tokens',
    abbreviation: 'Duel Decks: Izzet vs. Golgari Tokens'
  },
  {
    name: 'Duel Decks: Izzet vs. Golgari',
    abbreviation: 'Duel Decks: Izzet vs. Golgari'
  },
  {
    name: 'Duel Decks: Jace vs. Chandra Tokens',
    abbreviation: 'Duel Decks: Jace vs. Chandra Tokens'
  },
  {
    name: 'Duel Decks: Jace vs. Chandra',
    abbreviation: 'Duel Decks: Jace vs. Chandra'
  },
  {
    name: 'Duel Decks: Jace vs. Vraska Tokens',
    abbreviation: 'Duel Decks: Jace vs. Vraska Tokens'
  },
  {
    name: 'Duel Decks: Jace vs. Vraska',
    abbreviation: 'Duel Decks: Jace vs. Vraska'
  },
  {
    name: 'Duel Decks: Knights vs. Dragons Tokens',
    abbreviation: 'Duel Decks: Knights vs. Dragons Tokens'
  },
  {
    name: 'Duel Decks: Knights vs. Dragons',
    abbreviation: 'Duel Decks: Knights vs. Dragons'
  },
  {
    name: 'Duel Decks: Merfolk vs. Goblins Tokens',
    abbreviation: 'Duel Decks: Merfolk vs. Goblins Tokens'
  },
  {
    name: 'Duel Decks: Merfolk vs. Goblins',
    abbreviation: 'Duel Decks: Merfolk vs. Goblins'
  },
  {
    name: 'Duel Decks: Mind vs. Might Tokens',
    abbreviation: 'Duel Decks: Mind vs. Might Tokens'
  },
  {
    name: 'Duel Decks: Mind vs. Might',
    abbreviation: 'Duel Decks: Mind vs. Might'
  },
  {
    name: 'Duel Decks: Mirrodin Pure vs. New Phyrexia',
    abbreviation: 'Duel Decks: Mirrodin Pure vs. New Phyrexia'
  },
  {
    name: 'Duel Decks: Nissa vs. Ob Nixilis',
    abbreviation: 'Duel Decks: Nissa vs. Ob Nixilis'
  },
  {
    name: 'Duel Decks: Phyrexia vs. the Coalition Tokens',
    abbreviation: 'Duel Decks: Phyrexia vs. the Coalition Tokens'
  },
  {
    name: 'Duel Decks: Phyrexia vs. the Coalition',
    abbreviation: 'Duel Decks: Phyrexia vs. the Coalition'
  },
  {
    name: 'Duel Decks: Sorin vs. Tibalt Tokens',
    abbreviation: 'Duel Decks: Sorin vs. Tibalt Tokens'
  },
  {
    name: 'Duel Decks: Sorin vs. Tibalt',
    abbreviation: 'Duel Decks: Sorin vs. Tibalt'
  },
  {
    name: 'Duel Decks: Speed vs. Cunning',
    abbreviation: 'Duel Decks: Speed vs. Cunning'
  },
  {
    name: 'Duel Decks: Venser vs. Koth Tokens',
    abbreviation: 'Duel Decks: Venser vs. Koth Tokens'
  },
  {
    name: 'Duel Decks: Venser vs. Koth',
    abbreviation: 'Duel Decks: Venser vs. Koth'
  },
  {
    name: 'Duel Decks: Zendikar vs. Eldrazi',
    abbreviation: 'Duel Decks: Zendikar vs. Eldrazi'
  },
  {
    name: 'Duels of the Planeswalkers 2009 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2009 Promos '
  },
  {
    name: 'Duels of the Planeswalkers 2010 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2010 Promos '
  },
  {
    name: 'Duels of the Planeswalkers 2012 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2012 Promos '
  },
  {
    name: 'Duels of the Planeswalkers 2013 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2013 Promos '
  },
  {
    name: 'Duels of the Planeswalkers 2014 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2014 Promos '
  },
  {
    name: 'Duels of the Planeswalkers 2015 Promos ',
    abbreviation: 'Duels of the Planeswalkers 2015 Promos '
  },
  {
    name: 'Duels of the Planeswalkers',
    abbreviation: 'Duels of the Planeswalkers'
  },
  { name: 'Eighth Edition Promos', abbreviation: 'Eighth Edition Promos' },
  { name: 'Eighth Edition', abbreviation: 'Eighth Edition' },
  { name: 'Eldritch Moon Promos', abbreviation: 'Eldritch Moon Promos' },
  { name: 'Eldritch Moon Tokens', abbreviation: 'Eldritch Moon Tokens' },
  { name: 'Eldritch Moon', abbreviation: 'Eldritch Moon' },
  { name: 'Eternal Masters Tokens', abbreviation: 'Eternal Masters Tokens' },
  { name: 'Eternal Masters', abbreviation: 'Eternal Masters' },
  { name: 'Eternal Weekend', abbreviation: 'Eternal Weekend' },
  { name: 'European Land Program', abbreviation: 'European Land Program' },
  { name: 'Eventide Promos', abbreviation: 'Eventide Promos' },
  { name: 'Eventide Tokens', abbreviation: 'Eventide Tokens' },
  { name: 'Eventide', abbreviation: 'Eventide' },
  { name: 'Exodus Promos', abbreviation: 'Exodus Promos' },
  { name: 'Exodus', abbreviation: 'Exodus' },
  { name: 'Explorer Anthology 1', abbreviation: 'Explorer Anthology 1' },
  { name: 'Explorer Anthology 2', abbreviation: 'Explorer Anthology 2' },
  { name: 'Explorer Anthology 3', abbreviation: 'Explorer Anthology 3' },
  { name: 'Explorers of Ixalan', abbreviation: 'Explorers of Ixalan' },
  { name: 'Face the Hydra', abbreviation: 'Face the Hydra' },
  { name: 'Fallen Empires', abbreviation: 'Fallen Empires' },
  { name: 'Fallout Tokens', abbreviation: 'Fallout Tokens' },
  { name: 'Fallout', abbreviation: 'Fallout' },
  {
    name: 'Fate Reforged Clash Pack',
    abbreviation: 'Fate Reforged Clash Pack'
  },
  { name: 'Fate Reforged Promos', abbreviation: 'Fate Reforged Promos' },
  { name: 'Fate Reforged Tokens', abbreviation: 'Fate Reforged Tokens' },
  { name: 'Fate Reforged', abbreviation: 'Fate Reforged' },
  { name: 'Fifth Dawn Promos', abbreviation: 'Fifth Dawn Promos' },
  { name: 'Fifth Dawn', abbreviation: 'Fifth Dawn' },
  { name: 'Fifth Edition', abbreviation: 'Fifth Edition' },
  { name: 'Foreign Black Border', abbreviation: 'Foreign Black Border' },
  {
    name: 'Forgotten Realms Commander Display Commanders',
    abbreviation: 'Forgotten Realms Commander Display Commanders'
  },
  {
    name: 'Forgotten Realms Commander Tokens',
    abbreviation: 'Forgotten Realms Commander Tokens'
  },
  {
    name: 'Forgotten Realms Commander',
    abbreviation: 'Forgotten Realms Commander'
  },
  {
    name: 'Fourth Edition Foreign Black Border',
    abbreviation: 'Fourth Edition Foreign Black Border'
  },
  { name: 'Fourth Edition', abbreviation: 'Fourth Edition' },
  { name: 'Friday Night Magic 2000', abbreviation: 'Friday Night Magic 2000' },
  { name: 'Friday Night Magic 2001', abbreviation: 'Friday Night Magic 2001' },
  { name: 'Friday Night Magic 2002', abbreviation: 'Friday Night Magic 2002' },
  { name: 'Friday Night Magic 2003', abbreviation: 'Friday Night Magic 2003' },
  { name: 'Friday Night Magic 2004', abbreviation: 'Friday Night Magic 2004' },
  { name: 'Friday Night Magic 2005', abbreviation: 'Friday Night Magic 2005' },
  { name: 'Friday Night Magic 2006', abbreviation: 'Friday Night Magic 2006' },
  { name: 'Friday Night Magic 2007', abbreviation: 'Friday Night Magic 2007' },
  { name: 'Friday Night Magic 2008', abbreviation: 'Friday Night Magic 2008' },
  { name: 'Friday Night Magic 2009', abbreviation: 'Friday Night Magic 2009' },
  { name: 'Friday Night Magic 2010', abbreviation: 'Friday Night Magic 2010' },
  { name: 'Friday Night Magic 2011', abbreviation: 'Friday Night Magic 2011' },
  { name: 'Friday Night Magic 2012', abbreviation: 'Friday Night Magic 2012' },
  { name: 'Friday Night Magic 2013', abbreviation: 'Friday Night Magic 2013' },
  { name: 'Friday Night Magic 2014', abbreviation: 'Friday Night Magic 2014' },
  { name: 'Friday Night Magic 2015', abbreviation: 'Friday Night Magic 2015' },
  { name: 'Friday Night Magic 2016', abbreviation: 'Friday Night Magic 2016' },
  { name: 'Friday Night Magic 2017', abbreviation: 'Friday Night Magic 2017' },
  { name: 'Friday Night Magic 2018', abbreviation: 'Friday Night Magic 2018' },
  { name: 'From the Vault: Angels', abbreviation: 'From the Vault: Angels' },
  {
    name: 'From the Vault: Annihilation',
    abbreviation: 'From the Vault: Annihilation'
  },
  { name: 'From the Vault: Dragons', abbreviation: 'From the Vault: Dragons' },
  { name: 'From the Vault: Exiled', abbreviation: 'From the Vault: Exiled' },
  { name: 'From the Vault: Legends', abbreviation: 'From the Vault: Legends' },
  { name: 'From the Vault: Lore', abbreviation: 'From the Vault: Lore' },
  { name: 'From the Vault: Realms', abbreviation: 'From the Vault: Realms' },
  { name: 'From the Vault: Relics', abbreviation: 'From the Vault: Relics' },
  {
    name: 'From the Vault: Transform',
    abbreviation: 'From the Vault: Transform'
  },
  { name: 'From the Vault: Twenty', abbreviation: 'From the Vault: Twenty' },
  { name: 'Future Sight Promos', abbreviation: 'Future Sight Promos' },
  { name: 'Future Sight', abbreviation: 'Future Sight' },
  { name: 'GRN Guild Kit Tokens', abbreviation: 'GRN Guild Kit Tokens' },
  { name: 'GRN Guild Kit', abbreviation: 'GRN Guild Kit' },
  { name: 'GRN Ravnica Weekend', abbreviation: 'GRN Ravnica Weekend' },
  { name: 'Game Day Promos', abbreviation: 'Game Day Promos' },
  { name: 'Game Night 2019 Tokens', abbreviation: 'Game Night 2019 Tokens' },
  { name: 'Game Night 2019', abbreviation: 'Game Night 2019' },
  { name: 'Game Night', abbreviation: 'Game Night' },
  {
    name: 'Game Night: Free-for-All Tokens',
    abbreviation: 'Game Night: Free-for-All Tokens'
  },
  {
    name: 'Game Night: Free-for-All',
    abbreviation: 'Game Night: Free-for-All'
  },
  { name: 'Gatecrash Promos', abbreviation: 'Gatecrash Promos' },
  { name: 'Gatecrash Tokens', abbreviation: 'Gatecrash Tokens' },
  { name: 'Gatecrash', abbreviation: 'Gatecrash' },
  {
    name: 'Global Series Jiang Yanggu & Mu Yanling',
    abbreviation: 'Global Series Jiang Yanggu & Mu Yanling'
  },
  { name: 'Grand Prix Promos', abbreviation: 'Grand Prix Promos' },
  { name: 'Guildpact Promos', abbreviation: 'Guildpact Promos' },
  { name: 'Guildpact', abbreviation: 'Guildpact' },
  {
    name: 'Guilds of Ravnica Promos',
    abbreviation: 'Guilds of Ravnica Promos'
  },
  {
    name: 'Guilds of Ravnica Tokens',
    abbreviation: 'Guilds of Ravnica Tokens'
  },
  { name: 'Guilds of Ravnica', abbreviation: 'Guilds of Ravnica' },
  { name: 'Guru', abbreviation: 'Guru' },
  { name: 'Hachette UK', abbreviation: 'Hachette UK' },
  { name: 'Happy Holidays', abbreviation: 'Happy Holidays' },
  { name: 'HarperPrism Book Promos', abbreviation: 'HarperPrism Book Promos' },
  { name: 'HasCon 2017', abbreviation: 'HasCon 2017' },
  { name: 'Historic Anthology 1', abbreviation: 'Historic Anthology 1' },
  { name: 'Historic Anthology 2', abbreviation: 'Historic Anthology 2' },
  { name: 'Historic Anthology 3', abbreviation: 'Historic Anthology 3' },
  { name: 'Historic Anthology 4', abbreviation: 'Historic Anthology 4' },
  { name: 'Historic Anthology 5', abbreviation: 'Historic Anthology 5' },
  { name: 'Historic Anthology 6', abbreviation: 'Historic Anthology 6' },
  { name: 'Historic Anthology 7', abbreviation: 'Historic Anthology 7' },
  { name: 'Hobby Japan Promos', abbreviation: 'Hobby Japan Promos' },
  { name: 'Homelands', abbreviation: 'Homelands' },
  {
    name: 'Hour of Devastation Promos',
    abbreviation: 'Hour of Devastation Promos'
  },
  {
    name: 'Hour of Devastation Tokens',
    abbreviation: 'Hour of Devastation Tokens'
  },
  { name: 'Hour of Devastation', abbreviation: 'Hour of Devastation' },
  { name: 'IDW Comics Inserts', abbreviation: 'IDW Comics Inserts' },
  { name: 'Ice Age', abbreviation: 'Ice Age' },
  { name: 'Iconic Masters Tokens', abbreviation: 'Iconic Masters Tokens' },
  { name: 'Iconic Masters', abbreviation: 'Iconic Masters' },
  {
    name: 'Ikoria: Lair of Behemoths Promos',
    abbreviation: 'Ikoria: Lair of Behemoths Promos'
  },
  {
    name: 'Ikoria: Lair of Behemoths Tokens',
    abbreviation: 'Ikoria: Lair of Behemoths Tokens'
  },
  {
    name: 'Ikoria: Lair of Behemoths',
    abbreviation: 'Ikoria: Lair of Behemoths'
  },
  { name: 'Innistrad Promos', abbreviation: 'Innistrad Promos' },
  { name: 'Innistrad Tokens', abbreviation: 'Innistrad Tokens' },
  { name: 'Innistrad', abbreviation: 'Innistrad' },
  {
    name: 'Innistrad: Crimson Vow Minigames',
    abbreviation: 'Innistrad: Crimson Vow Minigames'
  },
  {
    name: 'Innistrad: Crimson Vow Promos',
    abbreviation: 'Innistrad: Crimson Vow Promos'
  },
  {
    name: 'Innistrad: Crimson Vow Substitute Cards',
    abbreviation: 'Innistrad: Crimson Vow Substitute Cards'
  },
  {
    name: 'Innistrad: Crimson Vow Tokens',
    abbreviation: 'Innistrad: Crimson Vow Tokens'
  },
  { name: 'Innistrad: Crimson Vow', abbreviation: 'Innistrad: Crimson Vow' },
  {
    name: 'Innistrad: Double Feature',
    abbreviation: 'Innistrad: Double Feature'
  },
  {
    name: 'Innistrad: Midnight Hunt Minigames',
    abbreviation: 'Innistrad: Midnight Hunt Minigames'
  },
  {
    name: 'Innistrad: Midnight Hunt Promos',
    abbreviation: 'Innistrad: Midnight Hunt Promos'
  },
  {
    name: 'Innistrad: Midnight Hunt Substitute Cards',
    abbreviation: 'Innistrad: Midnight Hunt Substitute Cards'
  },
  {
    name: 'Innistrad: Midnight Hunt Tokens',
    abbreviation: 'Innistrad: Midnight Hunt Tokens'
  },
  {
    name: 'Innistrad: Midnight Hunt',
    abbreviation: 'Innistrad: Midnight Hunt'
  },
  {
    name: "Intl. Collectors' Edition",
    abbreviation: "Intl. Collectors' Edition"
  },
  {
    name: 'Introductory Two-Player Set',
    abbreviation: 'Introductory Two-Player Set'
  },
  { name: 'Invasion Promos', abbreviation: 'Invasion Promos' },
  { name: 'Invasion', abbreviation: 'Invasion' },
  { name: 'Ixalan Promos', abbreviation: 'Ixalan Promos' },
  { name: 'Ixalan Tokens', abbreviation: 'Ixalan Tokens' },
  { name: 'Ixalan', abbreviation: 'Ixalan' },
  { name: 'Japan Junior Tournament', abbreviation: 'Japan Junior Tournament' },
  {
    name: "Journey into Nyx Hero's Path",
    abbreviation: "Journey into Nyx Hero's Path"
  },
  { name: 'Journey into Nyx Promos', abbreviation: 'Journey into Nyx Promos' },
  { name: 'Journey into Nyx Tokens', abbreviation: 'Journey into Nyx Tokens' },
  { name: 'Journey into Nyx', abbreviation: 'Journey into Nyx' },
  { name: 'Judge Gift Cards 1998', abbreviation: 'Judge Gift Cards 1998' },
  { name: 'Judge Gift Cards 1999', abbreviation: 'Judge Gift Cards 1999' },
  { name: 'Judge Gift Cards 2000', abbreviation: 'Judge Gift Cards 2000' },
  { name: 'Judge Gift Cards 2001', abbreviation: 'Judge Gift Cards 2001' },
  { name: 'Judge Gift Cards 2002', abbreviation: 'Judge Gift Cards 2002' },
  { name: 'Judge Gift Cards 2003', abbreviation: 'Judge Gift Cards 2003' },
  { name: 'Judge Gift Cards 2004', abbreviation: 'Judge Gift Cards 2004' },
  { name: 'Judge Gift Cards 2005', abbreviation: 'Judge Gift Cards 2005' },
  { name: 'Judge Gift Cards 2006', abbreviation: 'Judge Gift Cards 2006' },
  { name: 'Judge Gift Cards 2007', abbreviation: 'Judge Gift Cards 2007' },
  { name: 'Judge Gift Cards 2008', abbreviation: 'Judge Gift Cards 2008' },
  { name: 'Judge Gift Cards 2009', abbreviation: 'Judge Gift Cards 2009' },
  { name: 'Judge Gift Cards 2010', abbreviation: 'Judge Gift Cards 2010' },
  { name: 'Judge Gift Cards 2011', abbreviation: 'Judge Gift Cards 2011' },
  { name: 'Judge Gift Cards 2012', abbreviation: 'Judge Gift Cards 2012' },
  { name: 'Judge Gift Cards 2013', abbreviation: 'Judge Gift Cards 2013' },
  { name: 'Judge Gift Cards 2014', abbreviation: 'Judge Gift Cards 2014' },
  { name: 'Judge Gift Cards 2015', abbreviation: 'Judge Gift Cards 2015' },
  { name: 'Judge Gift Cards 2016', abbreviation: 'Judge Gift Cards 2016' },
  { name: 'Judge Gift Cards 2017', abbreviation: 'Judge Gift Cards 2017' },
  { name: 'Judge Gift Cards 2018', abbreviation: 'Judge Gift Cards 2018' },
  { name: 'Judge Gift Cards 2019', abbreviation: 'Judge Gift Cards 2019' },
  { name: 'Judge Gift Cards 2020', abbreviation: 'Judge Gift Cards 2020' },
  { name: 'Judge Gift Cards 2021', abbreviation: 'Judge Gift Cards 2021' },
  { name: 'Judge Gift Cards 2022', abbreviation: 'Judge Gift Cards 2022' },
  { name: 'Judge Gift Cards 2023', abbreviation: 'Judge Gift Cards 2023' },
  { name: 'Judgment Promos', abbreviation: 'Judgment Promos' },
  { name: 'Judgment', abbreviation: 'Judgment' },
  {
    name: 'Jumpstart 2022 Front Cards',
    abbreviation: 'Jumpstart 2022 Front Cards'
  },
  { name: 'Jumpstart 2022', abbreviation: 'Jumpstart 2022' },
  {
    name: 'Jumpstart Arena Exclusives',
    abbreviation: 'Jumpstart Arena Exclusives'
  },
  { name: 'Jumpstart Front Cards', abbreviation: 'Jumpstart Front Cards' },
  { name: 'Jumpstart', abbreviation: 'Jumpstart' },
  {
    name: 'Jumpstart: Historic Horizons',
    abbreviation: 'Jumpstart: Historic Horizons'
  },
  { name: 'Junior APAC Series', abbreviation: 'Junior APAC Series' },
  { name: 'Junior Series Europe', abbreviation: 'Junior Series Europe' },
  { name: 'Junior Super Series', abbreviation: 'Junior Super Series' },
  {
    name: 'Jurassic World Collection Tokens',
    abbreviation: 'Jurassic World Collection Tokens'
  },
  {
    name: 'Jurassic World Collection',
    abbreviation: 'Jurassic World Collection'
  },
  { name: 'Kaladesh Inventions', abbreviation: 'Kaladesh Inventions' },
  { name: 'Kaladesh Promos', abbreviation: 'Kaladesh Promos' },
  { name: 'Kaladesh Remastered', abbreviation: 'Kaladesh Remastered' },
  { name: 'Kaladesh Tokens', abbreviation: 'Kaladesh Tokens' },
  { name: 'Kaladesh', abbreviation: 'Kaladesh' },
  { name: 'Kaldheim Art Series', abbreviation: 'Kaldheim Art Series' },
  {
    name: 'Kaldheim Commander Tokens',
    abbreviation: 'Kaldheim Commander Tokens'
  },
  { name: 'Kaldheim Commander', abbreviation: 'Kaldheim Commander' },
  { name: 'Kaldheim Minigames', abbreviation: 'Kaldheim Minigames' },
  { name: 'Kaldheim Promos', abbreviation: 'Kaldheim Promos' },
  {
    name: 'Kaldheim Substitute Cards',
    abbreviation: 'Kaldheim Substitute Cards'
  },
  { name: 'Kaldheim Tokens', abbreviation: 'Kaldheim Tokens' },
  { name: 'Kaldheim', abbreviation: 'Kaldheim' },
  {
    name: 'Kamigawa: Neon Dynasty Minigames',
    abbreviation: 'Kamigawa: Neon Dynasty Minigames'
  },
  {
    name: 'Kamigawa: Neon Dynasty Promos',
    abbreviation: 'Kamigawa: Neon Dynasty Promos'
  },
  {
    name: 'Kamigawa: Neon Dynasty Substitute Cards',
    abbreviation: 'Kamigawa: Neon Dynasty Substitute Cards'
  },
  {
    name: 'Kamigawa: Neon Dynasty Tokens',
    abbreviation: 'Kamigawa: Neon Dynasty Tokens'
  },
  { name: 'Kamigawa: Neon Dynasty', abbreviation: 'Kamigawa: Neon Dynasty' },
  { name: 'Khans of Tarkir Promos', abbreviation: 'Khans of Tarkir Promos' },
  { name: 'Khans of Tarkir Tokens', abbreviation: 'Khans of Tarkir Tokens' },
  { name: 'Khans of Tarkir', abbreviation: 'Khans of Tarkir' },
  { name: 'League Tokens 2012', abbreviation: 'League Tokens 2012' },
  { name: 'League Tokens 2013', abbreviation: 'League Tokens 2013' },
  { name: 'League Tokens 2014', abbreviation: 'League Tokens 2014' },
  { name: 'League Tokens 2015', abbreviation: 'League Tokens 2015' },
  { name: 'League Tokens 2016', abbreviation: 'League Tokens 2016' },
  { name: 'League Tokens 2017', abbreviation: 'League Tokens 2017' },
  { name: 'Legacy Championship', abbreviation: 'Legacy Championship' },
  {
    name: 'Legendary Cube Prize Pack',
    abbreviation: 'Legendary Cube Prize Pack'
  },
  { name: 'Legends', abbreviation: 'Legends' },
  { name: 'Legions Promos', abbreviation: 'Legions Promos' },
  { name: 'Legions', abbreviation: 'Legions' },
  { name: 'Limited Edition Alpha', abbreviation: 'Limited Edition Alpha' },
  { name: 'Limited Edition Beta', abbreviation: 'Limited Edition Beta' },
  { name: 'Lorwyn Promos', abbreviation: 'Lorwyn Promos' },
  { name: 'Lorwyn Tokens', abbreviation: 'Lorwyn Tokens' },
  { name: 'Lorwyn', abbreviation: 'Lorwyn' },
  { name: 'Love Your LGS 2020', abbreviation: 'Love Your LGS 2020' },
  { name: 'Love Your LGS 2021', abbreviation: 'Love Your LGS 2021' },
  { name: 'Love Your LGS 2022', abbreviation: 'Love Your LGS 2022' },
  { name: 'Lunar New Year 2018 ', abbreviation: 'Lunar New Year 2018 ' },
  {
    name: 'M15 Prerelease Challenge',
    abbreviation: 'M15 Prerelease Challenge'
  },
  { name: 'M19 Gift Pack', abbreviation: 'M19 Gift Pack' },
  { name: 'M19 Standard Showdown', abbreviation: 'M19 Standard Showdown' },
  { name: 'M20 Promo Packs', abbreviation: 'M20 Promo Packs' },
  {
    name: 'MKM Japanese Promo Tokens',
    abbreviation: 'MKM Japanese Promo Tokens'
  },
  { name: 'MKM Standard Showdown', abbreviation: 'MKM Standard Showdown' },
  {
    name: 'MOM Japanese Promo Tokens',
    abbreviation: 'MOM Japanese Promo Tokens'
  },
  { name: 'MTG Arena Promos', abbreviation: 'MTG Arena Promos' },
  { name: 'Magic 2010 Promos', abbreviation: 'Magic 2010 Promos' },
  { name: 'Magic 2010 Tokens', abbreviation: 'Magic 2010 Tokens' },
  { name: 'Magic 2010', abbreviation: 'Magic 2010' },
  { name: 'Magic 2011 Promos', abbreviation: 'Magic 2011 Promos' },
  { name: 'Magic 2011 Tokens', abbreviation: 'Magic 2011 Tokens' },
  { name: 'Magic 2011', abbreviation: 'Magic 2011' },
  { name: 'Magic 2012 Promos', abbreviation: 'Magic 2012 Promos' },
  { name: 'Magic 2012 Tokens', abbreviation: 'Magic 2012 Tokens' },
  { name: 'Magic 2012', abbreviation: 'Magic 2012' },
  { name: 'Magic 2013 Promos', abbreviation: 'Magic 2013 Promos' },
  { name: 'Magic 2013 Tokens', abbreviation: 'Magic 2013 Tokens' },
  { name: 'Magic 2013', abbreviation: 'Magic 2013' },
  { name: 'Magic 2014 Promos', abbreviation: 'Magic 2014 Promos' },
  { name: 'Magic 2014 Tokens', abbreviation: 'Magic 2014 Tokens' },
  { name: 'Magic 2014', abbreviation: 'Magic 2014' },
  { name: 'Magic 2015 Clash Pack', abbreviation: 'Magic 2015 Clash Pack' },
  { name: 'Magic 2015 Promos', abbreviation: 'Magic 2015 Promos' },
  { name: 'Magic 2015 Tokens', abbreviation: 'Magic 2015 Tokens' },
  { name: 'Magic 2015', abbreviation: 'Magic 2015' },
  { name: 'Magic Online Avatars', abbreviation: 'Magic Online Avatars' },
  { name: 'Magic Online Promos', abbreviation: 'Magic Online Promos' },
  {
    name: 'Magic Online Theme Decks',
    abbreviation: 'Magic Online Theme Decks'
  },
  {
    name: 'Magic Origins Clash Pack',
    abbreviation: 'Magic Origins Clash Pack'
  },
  { name: 'Magic Origins Promos', abbreviation: 'Magic Origins Promos' },
  { name: 'Magic Origins Tokens', abbreviation: 'Magic Origins Tokens' },
  { name: 'Magic Origins', abbreviation: 'Magic Origins' },
  {
    name: 'Magic Player Rewards 2001',
    abbreviation: 'Magic Player Rewards 2001'
  },
  {
    name: 'Magic Player Rewards 2002',
    abbreviation: 'Magic Player Rewards 2002'
  },
  {
    name: 'Magic Player Rewards 2003',
    abbreviation: 'Magic Player Rewards 2003'
  },
  {
    name: 'Magic Player Rewards 2004',
    abbreviation: 'Magic Player Rewards 2004'
  },
  {
    name: 'Magic Player Rewards 2005',
    abbreviation: 'Magic Player Rewards 2005'
  },
  {
    name: 'Magic Player Rewards 2006',
    abbreviation: 'Magic Player Rewards 2006'
  },
  {
    name: 'Magic Player Rewards 2007',
    abbreviation: 'Magic Player Rewards 2007'
  },
  {
    name: 'Magic Player Rewards 2008',
    abbreviation: 'Magic Player Rewards 2008'
  },
  {
    name: 'Magic Player Rewards 2009',
    abbreviation: 'Magic Player Rewards 2009'
  },
  {
    name: 'Magic Player Rewards 2010',
    abbreviation: 'Magic Player Rewards 2010'
  },
  {
    name: 'Magic Player Rewards 2011',
    abbreviation: 'Magic Player Rewards 2011'
  },
  {
    name: 'Magic Premiere Shop 2005',
    abbreviation: 'Magic Premiere Shop 2005'
  },
  {
    name: 'Magic Premiere Shop 2006',
    abbreviation: 'Magic Premiere Shop 2006'
  },
  {
    name: 'Magic Premiere Shop 2007',
    abbreviation: 'Magic Premiere Shop 2007'
  },
  {
    name: 'Magic Premiere Shop 2008',
    abbreviation: 'Magic Premiere Shop 2008'
  },
  {
    name: 'Magic Premiere Shop 2009',
    abbreviation: 'Magic Premiere Shop 2009'
  },
  {
    name: 'Magic Premiere Shop 2010',
    abbreviation: 'Magic Premiere Shop 2010'
  },
  {
    name: 'Magic Premiere Shop 2011',
    abbreviation: 'Magic Premiere Shop 2011'
  },
  {
    name: 'Magic × Duel Masters Promos',
    abbreviation: 'Magic × Duel Masters Promos'
  },
  { name: 'MagicFest 2019', abbreviation: 'MagicFest 2019' },
  { name: 'MagicFest 2020', abbreviation: 'MagicFest 2020' },
  { name: 'MagicFest 2023', abbreviation: 'MagicFest 2023' },
  { name: 'MagicFest 2024', abbreviation: 'MagicFest 2024' },
  {
    name: 'March of the Machine Art Series',
    abbreviation: 'March of the Machine Art Series'
  },
  {
    name: 'March of the Machine Commander Tokens',
    abbreviation: 'March of the Machine Commander Tokens'
  },
  {
    name: 'March of the Machine Commander',
    abbreviation: 'March of the Machine Commander'
  },
  {
    name: 'March of the Machine Jumpstart Front Cards',
    abbreviation: 'March of the Machine Jumpstart Front Cards'
  },
  {
    name: 'March of the Machine Promos',
    abbreviation: 'March of the Machine Promos'
  },
  {
    name: 'March of the Machine Substitute Cards',
    abbreviation: 'March of the Machine Substitute Cards'
  },
  {
    name: 'March of the Machine Tokens',
    abbreviation: 'March of the Machine Tokens'
  },
  { name: 'March of the Machine', abbreviation: 'March of the Machine' },
  {
    name: 'March of the Machine: The Aftermath Promos',
    abbreviation: 'March of the Machine: The Aftermath Promos'
  },
  {
    name: 'March of the Machine: The Aftermath',
    abbreviation: 'March of the Machine: The Aftermath'
  },
  { name: 'Masters 25 Tokens', abbreviation: 'Masters 25 Tokens' },
  { name: 'Masters 25', abbreviation: 'Masters 25' },
  { name: 'Masters Edition II', abbreviation: 'Masters Edition II' },
  { name: 'Masters Edition III', abbreviation: 'Masters Edition III' },
  { name: 'Masters Edition IV', abbreviation: 'Masters Edition IV' },
  { name: 'Masters Edition', abbreviation: 'Masters Edition' },
  { name: 'Media Inserts', abbreviation: 'Media Inserts' },
  {
    name: 'Mercadian Masques Promos',
    abbreviation: 'Mercadian Masques Promos'
  },
  { name: 'Mercadian Masques', abbreviation: 'Mercadian Masques' },
  { name: 'MicroProse Promos', abbreviation: 'MicroProse Promos' },
  {
    name: 'Midnight Hunt Art Series',
    abbreviation: 'Midnight Hunt Art Series'
  },
  {
    name: 'Midnight Hunt Commander Display Commanders',
    abbreviation: 'Midnight Hunt Commander Display Commanders'
  },
  {
    name: 'Midnight Hunt Commander Tokens',
    abbreviation: 'Midnight Hunt Commander Tokens'
  },
  { name: 'Midnight Hunt Commander', abbreviation: 'Midnight Hunt Commander' },
  { name: 'Mirage', abbreviation: 'Mirage' },
  {
    name: 'Mirrodin Besieged Promos',
    abbreviation: 'Mirrodin Besieged Promos'
  },
  {
    name: 'Mirrodin Besieged Tokens',
    abbreviation: 'Mirrodin Besieged Tokens'
  },
  { name: 'Mirrodin Besieged', abbreviation: 'Mirrodin Besieged' },
  { name: 'Mirrodin Promos', abbreviation: 'Mirrodin Promos' },
  { name: 'Mirrodin', abbreviation: 'Mirrodin' },
  {
    name: 'Miscellaneous Book Promos',
    abbreviation: 'Miscellaneous Book Promos'
  },
  {
    name: 'Modern Event Deck 2014 Tokens',
    abbreviation: 'Modern Event Deck 2014 Tokens'
  },
  { name: 'Modern Event Deck 2014', abbreviation: 'Modern Event Deck 2014' },
  {
    name: 'Modern Horizons 1 Timeshifts',
    abbreviation: 'Modern Horizons 1 Timeshifts'
  },
  {
    name: 'Modern Horizons 2 Art Series',
    abbreviation: 'Modern Horizons 2 Art Series'
  },
  {
    name: 'Modern Horizons 2 Minigames',
    abbreviation: 'Modern Horizons 2 Minigames'
  },
  {
    name: 'Modern Horizons 2 Promos',
    abbreviation: 'Modern Horizons 2 Promos'
  },
  {
    name: 'Modern Horizons 2 Tokens',
    abbreviation: 'Modern Horizons 2 Tokens'
  },
  { name: 'Modern Horizons 2', abbreviation: 'Modern Horizons 2' },
  {
    name: 'Modern Horizons 3 Commander',
    abbreviation: 'Modern Horizons 3 Commander'
  },
  { name: 'Modern Horizons 3', abbreviation: 'Modern Horizons 3' },
  {
    name: 'Modern Horizons Art Series',
    abbreviation: 'Modern Horizons Art Series'
  },
  { name: 'Modern Horizons Promos', abbreviation: 'Modern Horizons Promos' },
  { name: 'Modern Horizons Tokens', abbreviation: 'Modern Horizons Tokens' },
  { name: 'Modern Horizons', abbreviation: 'Modern Horizons' },
  {
    name: 'Modern Masters 2015 Tokens',
    abbreviation: 'Modern Masters 2015 Tokens'
  },
  { name: 'Modern Masters 2015', abbreviation: 'Modern Masters 2015' },
  {
    name: 'Modern Masters 2017 Tokens',
    abbreviation: 'Modern Masters 2017 Tokens'
  },
  { name: 'Modern Masters 2017', abbreviation: 'Modern Masters 2017' },
  { name: 'Modern Masters Tokens', abbreviation: 'Modern Masters Tokens' },
  { name: 'Modern Masters', abbreviation: 'Modern Masters' },
  { name: 'Morningtide Promos', abbreviation: 'Morningtide Promos' },
  { name: 'Morningtide Tokens', abbreviation: 'Morningtide Tokens' },
  { name: 'Morningtide', abbreviation: 'Morningtide' },
  { name: 'Multiverse Gift Box', abbreviation: 'Multiverse Gift Box' },
  {
    name: 'Multiverse Legends Tokens',
    abbreviation: 'Multiverse Legends Tokens'
  },
  { name: 'Multiverse Legends', abbreviation: 'Multiverse Legends' },
  {
    name: 'Murders at Karlov Manor Art Series',
    abbreviation: 'Murders at Karlov Manor Art Series'
  },
  {
    name: 'Murders at Karlov Manor Commander Tokens',
    abbreviation: 'Murders at Karlov Manor Commander Tokens'
  },
  {
    name: 'Murders at Karlov Manor Commander',
    abbreviation: 'Murders at Karlov Manor Commander'
  },
  {
    name: 'Murders at Karlov Manor Promos',
    abbreviation: 'Murders at Karlov Manor Promos'
  },
  {
    name: 'Murders at Karlov Manor Tokens',
    abbreviation: 'Murders at Karlov Manor Tokens'
  },
  { name: 'Murders at Karlov Manor', abbreviation: 'Murders at Karlov Manor' },
  {
    name: 'Mystery Booster Playtest Cards 2019',
    abbreviation: 'Mystery Booster Playtest Cards 2019'
  },
  {
    name: 'Mystery Booster Playtest Cards 2021',
    abbreviation: 'Mystery Booster Playtest Cards 2021'
  },
  { name: 'Mythic Edition Tokens', abbreviation: 'Mythic Edition Tokens' },
  { name: 'Mythic Edition', abbreviation: 'Mythic Edition' },
  { name: 'Nationals Promos', abbreviation: 'Nationals Promos' },
  { name: 'Nemesis Promos', abbreviation: 'Nemesis Promos' },
  { name: 'Nemesis', abbreviation: 'Nemesis' },
  { name: 'Neon Dynasty Art Series', abbreviation: 'Neon Dynasty Art Series' },
  {
    name: 'Neon Dynasty Commander Tokens',
    abbreviation: 'Neon Dynasty Commander Tokens'
  },
  { name: 'Neon Dynasty Commander', abbreviation: 'Neon Dynasty Commander' },
  { name: 'New Capenna Art Series', abbreviation: 'New Capenna Art Series' },
  {
    name: 'New Capenna Commander Promos',
    abbreviation: 'New Capenna Commander Promos'
  },
  {
    name: 'New Capenna Commander Tokens',
    abbreviation: 'New Capenna Commander Tokens'
  },
  { name: 'New Capenna Commander', abbreviation: 'New Capenna Commander' },
  { name: 'New Phyrexia Promos', abbreviation: 'New Phyrexia Promos' },
  { name: 'New Phyrexia Tokens', abbreviation: 'New Phyrexia Tokens' },
  { name: 'New Phyrexia', abbreviation: 'New Phyrexia' },
  { name: 'Ninth Edition Promos', abbreviation: 'Ninth Edition Promos' },
  { name: 'Ninth Edition', abbreviation: 'Ninth Edition' },
  {
    name: 'ONE Japanese Promo Tokens',
    abbreviation: 'ONE Japanese Promo Tokens'
  },
  {
    name: 'Oath of the Gatewatch Promos',
    abbreviation: 'Oath of the Gatewatch Promos'
  },
  {
    name: 'Oath of the Gatewatch Tokens',
    abbreviation: 'Oath of the Gatewatch Tokens'
  },
  { name: 'Oath of the Gatewatch', abbreviation: 'Oath of the Gatewatch' },
  { name: 'Odyssey Promos', abbreviation: 'Odyssey Promos' },
  { name: 'Odyssey', abbreviation: 'Odyssey' },
  { name: 'Onslaught Promos', abbreviation: 'Onslaught Promos' },
  { name: 'Onslaught', abbreviation: 'Onslaught' },
  { name: 'Open the Helvault', abbreviation: 'Open the Helvault' },
  {
    name: 'Outlaws of Thunder Junction',
    abbreviation: 'Outlaws of Thunder Junction'
  },
  { name: "Oversized 90's Promos", abbreviation: "Oversized 90's Promos" },
  { name: 'Oversized League Prizes', abbreviation: 'Oversized League Prizes' },
  {
    name: 'Phyrexia: All Will Be One Art Series',
    abbreviation: 'Phyrexia: All Will Be One Art Series'
  },
  {
    name: 'Phyrexia: All Will Be One Commander Tokens',
    abbreviation: 'Phyrexia: All Will Be One Commander Tokens'
  },
  {
    name: 'Phyrexia: All Will Be One Commander',
    abbreviation: 'Phyrexia: All Will Be One Commander'
  },
  {
    name: 'Phyrexia: All Will Be One Jumpstart Front Cards',
    abbreviation: 'Phyrexia: All Will Be One Jumpstart Front Cards'
  },
  {
    name: 'Phyrexia: All Will Be One Minigames',
    abbreviation: 'Phyrexia: All Will Be One Minigames'
  },
  {
    name: 'Phyrexia: All Will Be One Promos',
    abbreviation: 'Phyrexia: All Will Be One Promos'
  },
  {
    name: 'Phyrexia: All Will Be One Tokens',
    abbreviation: 'Phyrexia: All Will Be One Tokens'
  },
  {
    name: 'Phyrexia: All Will Be One',
    abbreviation: 'Phyrexia: All Will Be One'
  },
  {
    name: 'Pioneer Challenger Decks 2021',
    abbreviation: 'Pioneer Challenger Decks 2021'
  },
  { name: 'Planar Chaos Promos', abbreviation: 'Planar Chaos Promos' },
  { name: 'Planar Chaos', abbreviation: 'Planar Chaos' },
  { name: 'Planechase 2012 Planes', abbreviation: 'Planechase 2012 Planes' },
  { name: 'Planechase 2012', abbreviation: 'Planechase 2012' },
  {
    name: 'Planechase Anthology Planes',
    abbreviation: 'Planechase Anthology Planes'
  },
  {
    name: 'Planechase Anthology Tokens',
    abbreviation: 'Planechase Anthology Tokens'
  },
  { name: 'Planechase Anthology', abbreviation: 'Planechase Anthology' },
  { name: 'Planechase Planes', abbreviation: 'Planechase Planes' },
  { name: 'Planechase Promos', abbreviation: 'Planechase Promos' },
  { name: 'Planechase', abbreviation: 'Planechase' },
  { name: 'Planeshift Promos', abbreviation: 'Planeshift Promos' },
  { name: 'Planeshift', abbreviation: 'Planeshift' },
  {
    name: 'Planeswalker Championship Promos',
    abbreviation: 'Planeswalker Championship Promos'
  },
  { name: 'Ponies: The Galloping', abbreviation: 'Ponies: The Galloping' },
  { name: 'Portal Second Age', abbreviation: 'Portal Second Age' },
  { name: 'Portal Three Kingdoms', abbreviation: 'Portal Three Kingdoms' },
  { name: 'Portal', abbreviation: 'Portal' },
  {
    name: 'Portal: Three Kingdoms Promos',
    abbreviation: 'Portal: Three Kingdoms Promos'
  },
  {
    name: 'Premium Deck Series: Fire and Lightning',
    abbreviation: 'Premium Deck Series: Fire and Lightning'
  },
  {
    name: 'Premium Deck Series: Graveborn',
    abbreviation: 'Premium Deck Series: Graveborn'
  },
  {
    name: 'Premium Deck Series: Slivers',
    abbreviation: 'Premium Deck Series: Slivers'
  },
  { name: 'Pro Tour Collector Set', abbreviation: 'Pro Tour Collector Set' },
  { name: 'Pro Tour Promos', abbreviation: 'Pro Tour Promos' },
  { name: 'Prophecy Promos', abbreviation: 'Prophecy Promos' },
  { name: 'Prophecy', abbreviation: 'Prophecy' },
  { name: 'RNA Guild Kit Tokens', abbreviation: 'RNA Guild Kit Tokens' },
  { name: 'RNA Guild Kit', abbreviation: 'RNA Guild Kit' },
  { name: 'RNA Ravnica Weekend', abbreviation: 'RNA Ravnica Weekend' },
  {
    name: 'Ravnica Allegiance Promos',
    abbreviation: 'Ravnica Allegiance Promos'
  },
  {
    name: 'Ravnica Allegiance Tokens',
    abbreviation: 'Ravnica Allegiance Tokens'
  },
  { name: 'Ravnica Allegiance', abbreviation: 'Ravnica Allegiance' },
  {
    name: 'Ravnica Remastered Tokens',
    abbreviation: 'Ravnica Remastered Tokens'
  },
  { name: 'Ravnica Remastered', abbreviation: 'Ravnica Remastered' },
  {
    name: 'Ravnica: City of Guilds Promos',
    abbreviation: 'Ravnica: City of Guilds Promos'
  },
  { name: 'Ravnica: City of Guilds', abbreviation: 'Ravnica: City of Guilds' },
  {
    name: 'Ravnica: Clue Edition Front Cards',
    abbreviation: 'Ravnica: Clue Edition Front Cards'
  },
  { name: 'Ravnica: Clue Edition', abbreviation: 'Ravnica: Clue Edition' },
  { name: 'Redemption Program', abbreviation: 'Redemption Program' },
  {
    name: 'Regional Championship Qualifiers 2022',
    abbreviation: 'Regional Championship Qualifiers 2022'
  },
  {
    name: 'Regional Championship Qualifiers 2023',
    abbreviation: 'Regional Championship Qualifiers 2023'
  },
  { name: 'Renaissance', abbreviation: 'Renaissance' },
  { name: 'Resale Promos', abbreviation: 'Resale Promos' },
  {
    name: 'Return to Ravnica Promos',
    abbreviation: 'Return to Ravnica Promos'
  },
  {
    name: 'Return to Ravnica Tokens',
    abbreviation: 'Return to Ravnica Tokens'
  },
  { name: 'Return to Ravnica', abbreviation: 'Return to Ravnica' },
  { name: 'Revised Edition', abbreviation: 'Revised Edition' },
  { name: 'Rinascimento', abbreviation: 'Rinascimento' },
  {
    name: 'Rise of the Eldrazi Promos',
    abbreviation: 'Rise of the Eldrazi Promos'
  },
  {
    name: 'Rise of the Eldrazi Tokens',
    abbreviation: 'Rise of the Eldrazi Tokens'
  },
  { name: 'Rise of the Eldrazi', abbreviation: 'Rise of the Eldrazi' },
  { name: 'Rivals Quick Start Set', abbreviation: 'Rivals Quick Start Set' },
  { name: 'Rivals of Ixalan Promos', abbreviation: 'Rivals of Ixalan Promos' },
  { name: 'Rivals of Ixalan Tokens', abbreviation: 'Rivals of Ixalan Tokens' },
  { name: 'Rivals of Ixalan', abbreviation: 'Rivals of Ixalan' },
  { name: 'Salvat 2005', abbreviation: 'Salvat 2005' },
  { name: 'Salvat 2011', abbreviation: 'Salvat 2011' },
  {
    name: 'San Diego Comic-Con 2013',
    abbreviation: 'San Diego Comic-Con 2013'
  },
  {
    name: 'San Diego Comic-Con 2014',
    abbreviation: 'San Diego Comic-Con 2014'
  },
  {
    name: 'San Diego Comic-Con 2015',
    abbreviation: 'San Diego Comic-Con 2015'
  },
  {
    name: 'San Diego Comic-Con 2016',
    abbreviation: 'San Diego Comic-Con 2016'
  },
  {
    name: 'San Diego Comic-Con 2017',
    abbreviation: 'San Diego Comic-Con 2017'
  },
  {
    name: 'San Diego Comic-Con 2018',
    abbreviation: 'San Diego Comic-Con 2018'
  },
  {
    name: 'San Diego Comic-Con 2019',
    abbreviation: 'San Diego Comic-Con 2019'
  },
  {
    name: 'Saviors of Kamigawa Promos',
    abbreviation: 'Saviors of Kamigawa Promos'
  },
  { name: 'Saviors of Kamigawa', abbreviation: 'Saviors of Kamigawa' },
  {
    name: 'Scars of Mirrodin Promos',
    abbreviation: 'Scars of Mirrodin Promos'
  },
  {
    name: 'Scars of Mirrodin Tokens',
    abbreviation: 'Scars of Mirrodin Tokens'
  },
  { name: 'Scars of Mirrodin', abbreviation: 'Scars of Mirrodin' },
  { name: 'Scourge Promos', abbreviation: 'Scourge Promos' },
  { name: 'Scourge', abbreviation: 'Scourge' },
  {
    name: 'Secret Lair 30th Anniversary Countdown Kit',
    abbreviation: 'Secret Lair 30th Anniversary Countdown Kit'
  },
  { name: 'Secret Lair Drop', abbreviation: 'Secret Lair Drop' },
  { name: 'Secret Lair Showdown', abbreviation: 'Secret Lair Showdown' },
  {
    name: 'Secret Lair: Ultimate Edition',
    abbreviation: 'Secret Lair: Ultimate Edition'
  },
  { name: 'Sega Dreamcast Cards', abbreviation: 'Sega Dreamcast Cards' },
  { name: 'Seventh Edition', abbreviation: 'Seventh Edition' },
  { name: 'Shadowmoor Promos', abbreviation: 'Shadowmoor Promos' },
  { name: 'Shadowmoor Tokens', abbreviation: 'Shadowmoor Tokens' },
  { name: 'Shadowmoor', abbreviation: 'Shadowmoor' },
  { name: 'Shadows of the Past', abbreviation: 'Shadows of the Past' },
  {
    name: 'Shadows over Innistrad Promos',
    abbreviation: 'Shadows over Innistrad Promos'
  },
  {
    name: 'Shadows over Innistrad Remastered',
    abbreviation: 'Shadows over Innistrad Remastered'
  },
  {
    name: 'Shadows over Innistrad Tokens',
    abbreviation: 'Shadows over Innistrad Tokens'
  },
  { name: 'Shadows over Innistrad', abbreviation: 'Shadows over Innistrad' },
  { name: 'Shards of Alara Promos', abbreviation: 'Shards of Alara Promos' },
  { name: 'Shards of Alara Tokens', abbreviation: 'Shards of Alara Tokens' },
  { name: 'Shards of Alara', abbreviation: 'Shards of Alara' },
  {
    name: 'Signature Spellbook: Chandra',
    abbreviation: 'Signature Spellbook: Chandra'
  },
  {
    name: 'Signature Spellbook: Gideon',
    abbreviation: 'Signature Spellbook: Gideon'
  },
  {
    name: 'Signature Spellbook: Jace',
    abbreviation: 'Signature Spellbook: Jace'
  },
  { name: 'Special Guests', abbreviation: 'Special Guests' },
  { name: 'Starter 1999', abbreviation: 'Starter 1999' },
  { name: 'Starter 2000', abbreviation: 'Starter 2000' },
  {
    name: 'Starter Commander Deck Tokens',
    abbreviation: 'Starter Commander Deck Tokens'
  },
  { name: 'Starter Commander Decks', abbreviation: 'Starter Commander Decks' },
  { name: 'Store Championships', abbreviation: 'Store Championships' },
  {
    name: 'Streets of New Capenna Minigames',
    abbreviation: 'Streets of New Capenna Minigames'
  },
  {
    name: 'Streets of New Capenna Promos',
    abbreviation: 'Streets of New Capenna Promos'
  },
  {
    name: 'Streets of New Capenna Southeast Asia Tokens',
    abbreviation: 'Streets of New Capenna Southeast Asia Tokens'
  },
  {
    name: 'Streets of New Capenna Tokens',
    abbreviation: 'Streets of New Capenna Tokens'
  },
  { name: 'Streets of New Capenna', abbreviation: 'Streets of New Capenna' },
  { name: 'Strixhaven Art Series', abbreviation: 'Strixhaven Art Series' },
  {
    name: 'Strixhaven Mystical Archive',
    abbreviation: 'Strixhaven Mystical Archive'
  },
  {
    name: 'Strixhaven: School of Mages Minigames',
    abbreviation: 'Strixhaven: School of Mages Minigames'
  },
  {
    name: 'Strixhaven: School of Mages Promos',
    abbreviation: 'Strixhaven: School of Mages Promos'
  },
  {
    name: 'Strixhaven: School of Mages Substitute Cards',
    abbreviation: 'Strixhaven: School of Mages Substitute Cards'
  },
  {
    name: 'Strixhaven: School of Mages Tokens',
    abbreviation: 'Strixhaven: School of Mages Tokens'
  },
  {
    name: 'Strixhaven: School of Mages',
    abbreviation: 'Strixhaven: School of Mages'
  },
  { name: 'Stronghold Promos', abbreviation: 'Stronghold Promos' },
  { name: 'Stronghold', abbreviation: 'Stronghold' },
  { name: 'Summer Magic / Edgar', abbreviation: 'Summer Magic / Edgar' },
  {
    name: 'Summer Vacation Promos 2022',
    abbreviation: 'Summer Vacation Promos 2022'
  },
  {
    name: 'Tales of Middle-earth Art Series',
    abbreviation: 'Tales of Middle-earth Art Series'
  },
  {
    name: 'Tales of Middle-earth Commander Tokens',
    abbreviation: 'Tales of Middle-earth Commander Tokens'
  },
  {
    name: 'Tales of Middle-earth Commander',
    abbreviation: 'Tales of Middle-earth Commander'
  },
  {
    name: 'Tales of Middle-earth Front Cards',
    abbreviation: 'Tales of Middle-earth Front Cards'
  },
  {
    name: 'Tales of Middle-earth Promos',
    abbreviation: 'Tales of Middle-earth Promos'
  },
  {
    name: 'Tales of Middle-earth Tokens',
    abbreviation: 'Tales of Middle-earth Tokens'
  },
  { name: 'Tarkir Dragonfury', abbreviation: 'Tarkir Dragonfury' },
  { name: 'Tempest Promos', abbreviation: 'Tempest Promos' },
  { name: 'Tempest Remastered', abbreviation: 'Tempest Remastered' },
  { name: 'Tempest', abbreviation: 'Tempest' },
  { name: 'Tenth Edition Promos', abbreviation: 'Tenth Edition Promos' },
  { name: 'Tenth Edition Tokens', abbreviation: 'Tenth Edition Tokens' },
  { name: 'Tenth Edition', abbreviation: 'Tenth Edition' },
  { name: 'The Big Score', abbreviation: 'The Big Score' },
  {
    name: "The Brothers' War Art Series",
    abbreviation: "The Brothers' War Art Series"
  },
  {
    name: "The Brothers' War Commander Tokens",
    abbreviation: "The Brothers' War Commander Tokens"
  },
  {
    name: "The Brothers' War Commander",
    abbreviation: "The Brothers' War Commander"
  },
  {
    name: "The Brothers' War Jumpstart Front Cards",
    abbreviation: "The Brothers' War Jumpstart Front Cards"
  },
  {
    name: "The Brothers' War Minigames",
    abbreviation: "The Brothers' War Minigames"
  },
  {
    name: "The Brothers' War Promos",
    abbreviation: "The Brothers' War Promos"
  },
  {
    name: "The Brothers' War Retro Artifacts",
    abbreviation: "The Brothers' War Retro Artifacts"
  },
  {
    name: "The Brothers' War Southeast Asia Tokens",
    abbreviation: "The Brothers' War Southeast Asia Tokens"
  },
  {
    name: "The Brothers' War Substitute Cards",
    abbreviation: "The Brothers' War Substitute Cards"
  },
  {
    name: "The Brothers' War Tokens",
    abbreviation: "The Brothers' War Tokens"
  },
  { name: "The Brothers' War", abbreviation: "The Brothers' War" },
  { name: 'The Dark', abbreviation: 'The Dark' },
  {
    name: 'The List (Unfinity Foil Edition)',
    abbreviation: 'The List (Unfinity Foil Edition)'
  },
  { name: 'The List', abbreviation: 'The List' },
  {
    name: 'The Lord of the Rings: Tales of Middle-earth',
    abbreviation: 'The Lord of the Rings: Tales of Middle-earth'
  },
  {
    name: 'The Lost Caverns of Ixalan Art Series',
    abbreviation: 'The Lost Caverns of Ixalan Art Series'
  },
  {
    name: 'The Lost Caverns of Ixalan Commander Tokens',
    abbreviation: 'The Lost Caverns of Ixalan Commander Tokens'
  },
  {
    name: 'The Lost Caverns of Ixalan Commander',
    abbreviation: 'The Lost Caverns of Ixalan Commander'
  },
  {
    name: 'The Lost Caverns of Ixalan Promos',
    abbreviation: 'The Lost Caverns of Ixalan Promos'
  },
  {
    name: 'The Lost Caverns of Ixalan Substitute Cards',
    abbreviation: 'The Lost Caverns of Ixalan Substitute Cards'
  },
  {
    name: 'The Lost Caverns of Ixalan Tokens',
    abbreviation: 'The Lost Caverns of Ixalan Tokens'
  },
  {
    name: 'The Lost Caverns of Ixalan',
    abbreviation: 'The Lost Caverns of Ixalan'
  },
  {
    name: 'Theros Beyond Death Promos',
    abbreviation: 'Theros Beyond Death Promos'
  },
  {
    name: 'Theros Beyond Death Tokens',
    abbreviation: 'Theros Beyond Death Tokens'
  },
  { name: 'Theros Beyond Death', abbreviation: 'Theros Beyond Death' },
  { name: "Theros Hero's Path", abbreviation: "Theros Hero's Path" },
  { name: 'Theros Promos', abbreviation: 'Theros Promos' },
  { name: 'Theros Tokens', abbreviation: 'Theros Tokens' },
  { name: 'Theros', abbreviation: 'Theros' },
  {
    name: 'Throne of Eldraine Promos',
    abbreviation: 'Throne of Eldraine Promos'
  },
  {
    name: 'Throne of Eldraine Tokens',
    abbreviation: 'Throne of Eldraine Tokens'
  },
  { name: 'Throne of Eldraine', abbreviation: 'Throne of Eldraine' },
  { name: 'Time Spiral Promos', abbreviation: 'Time Spiral Promos' },
  {
    name: 'Time Spiral Remastered Promos',
    abbreviation: 'Time Spiral Remastered Promos'
  },
  {
    name: 'Time Spiral Remastered Tokens',
    abbreviation: 'Time Spiral Remastered Tokens'
  },
  { name: 'Time Spiral Remastered', abbreviation: 'Time Spiral Remastered' },
  { name: 'Time Spiral Timeshifted', abbreviation: 'Time Spiral Timeshifted' },
  { name: 'Time Spiral', abbreviation: 'Time Spiral' },
  { name: 'Torment Promos', abbreviation: 'Torment Promos' },
  { name: 'Torment', abbreviation: 'Torment' },
  { name: 'Transformers Tokens', abbreviation: 'Transformers Tokens' },
  { name: 'Transformers', abbreviation: 'Transformers' },
  { name: 'Treasure Chest', abbreviation: 'Treasure Chest' },
  {
    name: 'Two-Headed Giant Tournament',
    abbreviation: 'Two-Headed Giant Tournament'
  },
  { name: 'URL/Convention Promos', abbreviation: 'URL/Convention Promos' },
  { name: "Ugin's Fate", abbreviation: "Ugin's Fate" },
  { name: 'Ultimate Box Topper', abbreviation: 'Ultimate Box Topper' },
  { name: 'Ultimate Masters Tokens', abbreviation: 'Ultimate Masters Tokens' },
  { name: 'Ultimate Masters', abbreviation: 'Ultimate Masters' },
  { name: 'Unfinity Sticker Sheets', abbreviation: 'Unfinity Sticker Sheets' },
  { name: 'Unfinity Tokens', abbreviation: 'Unfinity Tokens' },
  { name: 'Unfinity', abbreviation: 'Unfinity' },
  { name: 'Unglued Tokens', abbreviation: 'Unglued Tokens' },
  { name: 'Unglued', abbreviation: 'Unglued' },
  { name: 'Unhinged Promos', abbreviation: 'Unhinged Promos' },
  { name: 'Unhinged', abbreviation: 'Unhinged' },
  { name: 'Universes Within', abbreviation: 'Universes Within' },
  { name: 'Unlimited Edition', abbreviation: 'Unlimited Edition' },
  { name: 'Unsanctioned Tokens', abbreviation: 'Unsanctioned Tokens' },
  { name: 'Unsanctioned', abbreviation: 'Unsanctioned' },
  { name: 'Unstable Promos', abbreviation: 'Unstable Promos' },
  { name: 'Unstable Tokens', abbreviation: 'Unstable Tokens' },
  { name: 'Unstable', abbreviation: 'Unstable' },
  { name: "Urza's Destiny Promos", abbreviation: "Urza's Destiny Promos" },
  { name: "Urza's Destiny", abbreviation: "Urza's Destiny" },
  { name: "Urza's Legacy Promos", abbreviation: "Urza's Legacy Promos" },
  { name: "Urza's Legacy", abbreviation: "Urza's Legacy" },
  { name: "Urza's Saga Promos", abbreviation: "Urza's Saga Promos" },
  { name: "Urza's Saga", abbreviation: "Urza's Saga" },
  { name: 'Vanguard Series', abbreviation: 'Vanguard Series' },
  { name: 'Vintage Championship', abbreviation: 'Vintage Championship' },
  { name: 'Vintage Masters', abbreviation: 'Vintage Masters' },
  { name: 'Visions', abbreviation: 'Visions' },
  {
    name: 'WOE Japanese Promo Tokens',
    abbreviation: 'WOE Japanese Promo Tokens'
  },
  { name: 'War of the Spark Promos', abbreviation: 'War of the Spark Promos' },
  { name: 'War of the Spark Tokens', abbreviation: 'War of the Spark Tokens' },
  { name: 'War of the Spark', abbreviation: 'War of the Spark' },
  {
    name: 'Warhammer 40,000 Commander',
    abbreviation: 'Warhammer 40,000 Commander'
  },
  { name: 'Warhammer 40,000 Tokens', abbreviation: 'Warhammer 40,000 Tokens' },
  { name: 'Weatherlight', abbreviation: 'Weatherlight' },
  { name: 'Welcome Deck 2016', abbreviation: 'Welcome Deck 2016' },
  { name: 'Welcome Deck 2017', abbreviation: 'Welcome Deck 2017' },
  {
    name: 'Wilds of Eldraine Art Series',
    abbreviation: 'Wilds of Eldraine Art Series'
  },
  {
    name: 'Wilds of Eldraine Commander Tokens',
    abbreviation: 'Wilds of Eldraine Commander Tokens'
  },
  {
    name: 'Wilds of Eldraine Commander',
    abbreviation: 'Wilds of Eldraine Commander'
  },
  {
    name: 'Wilds of Eldraine Promos',
    abbreviation: 'Wilds of Eldraine Promos'
  },
  {
    name: 'Wilds of Eldraine Tokens',
    abbreviation: 'Wilds of Eldraine Tokens'
  },
  { name: 'Wilds of Eldraine', abbreviation: 'Wilds of Eldraine' },
  {
    name: 'Wilds of Eldraine: Enchanting Tales',
    abbreviation: 'Wilds of Eldraine: Enchanting Tales'
  },
  {
    name: 'Wizards Play Network 2011',
    abbreviation: 'Wizards Play Network 2011'
  },
  {
    name: 'Wizards Play Network 2012',
    abbreviation: 'Wizards Play Network 2012'
  },
  {
    name: 'Wizards Play Network 2021',
    abbreviation: 'Wizards Play Network 2021'
  },
  {
    name: 'Wizards Play Network 2022',
    abbreviation: 'Wizards Play Network 2022'
  },
  {
    name: 'Wizards Play Network 2023',
    abbreviation: 'Wizards Play Network 2023'
  },
  {
    name: 'Wizards Play Network 2024',
    abbreviation: 'Wizards Play Network 2024'
  },
  {
    name: 'Wizards of the Coast Online Store',
    abbreviation: 'Wizards of the Coast Online Store'
  },
  {
    name: 'World Championship Decks 1997',
    abbreviation: 'World Championship Decks 1997'
  },
  {
    name: 'World Championship Decks 1998',
    abbreviation: 'World Championship Decks 1998'
  },
  {
    name: 'World Championship Decks 1999',
    abbreviation: 'World Championship Decks 1999'
  },
  {
    name: 'World Championship Decks 2000',
    abbreviation: 'World Championship Decks 2000'
  },
  {
    name: 'World Championship Decks 2001',
    abbreviation: 'World Championship Decks 2001'
  },
  {
    name: 'World Championship Decks 2002',
    abbreviation: 'World Championship Decks 2002'
  },
  {
    name: 'World Championship Decks 2003',
    abbreviation: 'World Championship Decks 2003'
  },
  {
    name: 'World Championship Decks 2004',
    abbreviation: 'World Championship Decks 2004'
  },
  {
    name: 'World Championship Promos',
    abbreviation: 'World Championship Promos'
  },
  {
    name: 'World Magic Cup Qualifiers',
    abbreviation: 'World Magic Cup Qualifiers'
  },
  { name: 'Worldwake Promos', abbreviation: 'Worldwake Promos' },
  { name: 'Worldwake Tokens', abbreviation: 'Worldwake Tokens' },
  { name: 'Worldwake', abbreviation: 'Worldwake' },
  { name: 'XLN Standard Showdown', abbreviation: 'XLN Standard Showdown' },
  { name: 'XLN Treasure Chest', abbreviation: 'XLN Treasure Chest' },
  { name: 'Year of the Dragon 2024', abbreviation: 'Year of the Dragon 2024' },
  { name: 'Year of the Ox 2021', abbreviation: 'Year of the Ox 2021' },
  { name: 'Year of the Rabbit 2023', abbreviation: 'Year of the Rabbit 2023' },
  { name: 'Year of the Tiger 2022', abbreviation: 'Year of the Tiger 2022' },
  { name: 'Zendikar Expeditions', abbreviation: 'Zendikar Expeditions' },
  { name: 'Zendikar Promos', abbreviation: 'Zendikar Promos' },
  {
    name: 'Zendikar Rising Art Series',
    abbreviation: 'Zendikar Rising Art Series'
  },
  {
    name: 'Zendikar Rising Commander Tokens',
    abbreviation: 'Zendikar Rising Commander Tokens'
  },
  {
    name: 'Zendikar Rising Commander',
    abbreviation: 'Zendikar Rising Commander'
  },
  {
    name: 'Zendikar Rising Expeditions',
    abbreviation: 'Zendikar Rising Expeditions'
  },
  {
    name: 'Zendikar Rising Minigames',
    abbreviation: 'Zendikar Rising Minigames'
  },
  { name: 'Zendikar Rising Promos', abbreviation: 'Zendikar Rising Promos' },
  {
    name: 'Zendikar Rising Substitute Cards',
    abbreviation: 'Zendikar Rising Substitute Cards'
  },
  { name: 'Zendikar Rising Tokens', abbreviation: 'Zendikar Rising Tokens' },
  { name: 'Zendikar Rising', abbreviation: 'Zendikar Rising' },
  { name: 'Zendikar Tokens', abbreviation: 'Zendikar Tokens' },
  { name: 'Zendikar', abbreviation: 'Zendikar' }
];

type State = {
  selectedCardCategory: string;

  advancedSearchResults: AdvancedSearchResult[];

  sortByList: Filter[];
  selectedSortBy: string;
  advnacedSearchTextBoxValue: string;

  conditionList: Filter[];
  selectedConditionsCount: number;
  selectedConditionsList: string[];

  artTypeList: Filter[];
  selectedArtTypeCount: number;
  selectedhArtTypeList: string[];

  otherList: Filter[];
  selectedOtherCount: number;
  selectedOtherList: string[];

  websiteList: Filter[];
  selectedWebsiteCount: number;
  selectedWebsiteList: string[];

  foilList: Filter[];
  selectedFoilCount: number;
  selectedFoilList: string[];

  showcaseTreatmentList: Filter[];
  selectedShowcaseTreatmentCount: number;
  selectedShowcaseTreatmentList: string[];

  setList: Filter[];
  selectedSetCount: number;
  selectedSetList: string[];

  preReleaseChecked: boolean;
  promoChecked: boolean;
  alternateArtChecked: boolean;
  retroChecked: boolean;
  artSeriesChecked: boolean;
  goldenStampedChecked: boolean;
  numberChecked: boolean;
  cardNumber: number;

  advancedSearchLoading: boolean;

  changeCardCategory: (textField: string) => void;
  updateAdvnacedSearchTextBoxValue: (textField: string) => void;
  toggleRegularCheckboxes: (checkBoxTitle: string) => void;
  updateNumberText: (textField: number) => void;
  toggle: (fieldName: string, category: string) => void;

  updateSortByFilter: (sortValue: string) => void;
  resetFilters: () => void;
  fetchAdvancedSearchResults: () => Promise<void>;
};

export const advancedUseStore = create<State>((set, get) => ({
  advancedSearchLoading: false,
  advancedSearchResults: [],

  advnacedSearchTextBoxValue: '',

  selectedCardCategory: 'allCards',

  websiteList: websiteList,
  selectedWebsiteList: [],
  selectedWebsiteCount: 0,

  setList: setList,
  selectedSetList: [],
  selectedSetCount: 0,

  conditionList: conditionList,
  selectedConditionsList: [],
  selectedConditionsCount: 0,

  foilList: foilList,
  selectedFoilList: [],
  selectedFoilCount: 0,

  showcaseTreatmentList: showcaseTreatmentList,
  selectedShowcaseTreatmentList: [],
  selectedShowcaseTreatmentCount: 0,

  artTypeList: artTypeList,
  selectedhArtTypeList: [],
  selectedArtTypeCount: 0,

  otherList: otherList,
  selectedOtherList: [],
  selectedOtherCount: 0,

  preReleaseChecked: false,
  promoChecked: false,
  alternateArtChecked: false,
  retroChecked: false,
  artSeriesChecked: false,
  goldenStampedChecked: false,
  numberChecked: false,
  cardNumber: 0,

  sortByList: sortByList,
  selectedSortBy: 'price',

  updateAdvnacedSearchTextBoxValue: (textField: string) => {
    set({ advnacedSearchTextBoxValue: textField });
  },

  changeCardCategory: (textField: string) => {
    if (get().selectedCardCategory != textField) {
      set({ selectedCardCategory: textField });
      get().resetFilters();
    }
  },

  toggleRegularCheckboxes: (checkBoxTitle: string) => {
    switch (checkBoxTitle) {
      case 'numberCheckBox':
        set({ numberChecked: !get().numberChecked });
        if (get().numberChecked == false) {
          set({ cardNumber: 0 });
        }
        break;
      case 'goldenStampedSeriesCheckBox':
        set({ goldenStampedChecked: !get().goldenStampedChecked });
        break;
      case 'artSeriesCheckBox':
        set({ artSeriesChecked: !get().artSeriesChecked });
        break;
      case 'retroCheckBox':
        set({ retroChecked: !get().retroChecked });
        break;
      case 'alternateArtCheckBox':
        set({ alternateArtChecked: !get().alternateArtChecked });
        break;
      case 'promoCheckBox':
        set({ promoChecked: !get().promoChecked });
        break;
      case 'preReleaseCheckBox':
        set({ preReleaseChecked: !get().preReleaseChecked });
        break;
    }
  },

  updateNumberText: (textField: number) => {
    set({
      cardNumber: textField
    });
  },
  resetFilters: () => {
    set({
      advnacedSearchTextBoxValue: '',

      selectedConditionsList: [],
      selectedhArtTypeList: [],
      selectedOtherList: [],
      selectedWebsiteList: [],
      selectedFoilList: [],
      selectedShowcaseTreatmentList: [],
      selectedSetList: [],

      selectedConditionsCount: 0,
      selectedArtTypeCount: 0,
      selectedOtherCount: 0,
      selectedWebsiteCount: 0,
      selectedFoilCount: 0,
      selectedShowcaseTreatmentCount: 0,
      selectedSetCount: 0,

      preReleaseChecked: false,
      promoChecked: false,
      alternateArtChecked: false,
      retroChecked: false,
      artSeriesChecked: false,
      goldenStampedChecked: false,
      numberChecked: false,
      cardNumber: 0
    });
  },

  toggle: (fieldName: string, category: string) => {
    if (category == 'Condition') {
      if (get().selectedConditionsList.includes(fieldName)) {
        set({
          selectedConditionsList: get().selectedConditionsList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedConditionsCount: get().selectedConditionsCount - 1
        });
      } else {
        set({
          selectedConditionsList: [...get().selectedConditionsList, fieldName],
          selectedConditionsCount: get().selectedConditionsCount + 1
        });
      }
    } else if (category == 'Art Type') {
      if (get().selectedhArtTypeList.includes(fieldName)) {
        set({
          selectedhArtTypeList: get().selectedhArtTypeList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedArtTypeCount: get().selectedArtTypeCount - 1
        });
      } else {
        set({
          selectedhArtTypeList: [...get().selectedhArtTypeList, fieldName],
          selectedArtTypeCount: get().selectedArtTypeCount + 1
        });
      }
    } else if (category == 'Other') {
      if (get().selectedOtherList.includes(fieldName)) {
        set({
          selectedOtherList: get().selectedOtherList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedOtherCount: get().selectedOtherCount - 1
        });
      } else {
        set({
          selectedOtherList: [...get().selectedOtherList, fieldName],
          selectedOtherCount: get().selectedOtherCount + 1
        });
      }
    } else if (category == 'Websites') {
      if (get().selectedWebsiteList.includes(fieldName)) {
        set({
          selectedWebsiteList: get().selectedWebsiteList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedWebsiteCount: get().selectedWebsiteCount - 1
        });
      } else {
        set({
          selectedWebsiteList: [...get().selectedWebsiteList, fieldName],
          selectedWebsiteCount: get().selectedWebsiteCount + 1
        });
      }
    } else if (category == 'Foil') {
      if (get().selectedFoilList.includes(fieldName)) {
        set({
          selectedFoilList: get().selectedFoilList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedFoilCount: get().selectedFoilCount - 1
        });
      } else {
        set({
          selectedFoilList: [...get().selectedFoilList, fieldName],
          selectedFoilCount: get().selectedFoilCount + 1
        });
      }
    } else if (category == 'Showcase Treatment') {
      if (get().selectedShowcaseTreatmentList.includes(fieldName)) {
        set({
          selectedShowcaseTreatmentList:
            get().selectedShowcaseTreatmentList.filter(
              (selectedField: string) => selectedField !== fieldName
            ),
          selectedShowcaseTreatmentCount:
            get().selectedShowcaseTreatmentCount - 1
        });
      } else {
        set({
          selectedShowcaseTreatmentList: [
            ...get().selectedShowcaseTreatmentList,
            fieldName
          ],
          selectedShowcaseTreatmentCount:
            get().selectedShowcaseTreatmentCount + 1
        });
      }
    } else if (category == 'Set') {
      if (get().selectedSetList.includes(fieldName)) {
        set({
          selectedSetList: get().selectedSetList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedSetCount: get().selectedSetCount - 1
        });
      } else {
        set({
          selectedSetList: [...get().selectedSetList, fieldName],
          selectedSetCount: get().selectedSetCount + 1
        });
      }
    }
  },

  updateSortByFilter: (sortValue: string) => {
    set({ selectedSortBy: sortValue });
    if (get().selectedSortBy == 'price') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort(
          (a, b) => a.price - b.price
        )
      });
    } else if (get().selectedSortBy == 'website') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.website === b.website
            ? a.price < b.price
              ? -1
              : 1
            : a.website < b.website
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'set') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.set === b.set
            ? a.price < b.price
              ? -1
              : 1
            : a.set < b.set
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'condition') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.condition === b.condition
            ? a.price < b.price
              ? -1
              : 1
            : a.condition < b.condition
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'name') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.name === b.name
            ? a.price < b.price
              ? -1
              : 1
            : a.name < b.name
            ? -1
            : 1
        )
      });
    }
  },
  fetchAdvancedSearchResults: async () => {
    try {
      set({ advancedSearchResults: [] });
      set({ advancedSearchLoading: true });
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/advanced`,
        {
          cardCategory: get().selectedCardCategory,
          cardName: get().advnacedSearchTextBoxValue,
          website: get().selectedWebsiteList,
          condition: get().selectedConditionsList,
          foil: get().selectedFoilList,
          showcaseTreatment: get().selectedShowcaseTreatmentList,
          artType: get().selectedhArtTypeList,
          other: get().selectedOtherList,
          preRelease: get().preReleaseChecked,
          promo: get().promoChecked,
          alternateArt: get().alternateArtChecked,
          retro: get().retroChecked,
          artSeries: get().artSeriesChecked,
          goldenStampedSeries: get().goldenStampedChecked,
          numberChecked: get().numberChecked,
          cardNumber:
            get().numberChecked == true && get().cardNumber != 0
              ? get().cardNumber
              : -1,
          set: get().selectedSetList
        }
      );
      set({ advancedSearchResults: response.data });
      get().updateSortByFilter(get().selectedSortBy);
      set({ advancedSearchLoading: false });
    } catch {
      set({ advancedSearchLoading: false });
    }
  }
}));
