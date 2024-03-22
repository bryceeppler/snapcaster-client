export interface ArticleObject {
  header: string;
  content: string;
  image: string;
  imageTitle: string;
}

export const prereleasePromoContent: ArticleObject[] = [
  {
    header: 'Pre-release Cards',
    content:
      'Pre-release cards are given to players who attend pre-release events leading up to a new set. These events are typically held at official local game stores across the country prior to the set’s official launch. These cards are meant to provide players with a sneak peek of the new set typically a week before the release. The cards are typically creatures that highlight a new aspect in that set alongside a unique stamp not found in the regular cards.',
    image: '/buyers-guide-images/vannifar-prerelease.jpg',
    imageTitle: 'Vannifar, Evolved Enigma Pre-release (PMKM)'
  },
  {
    header: 'Promo Cards',
    content:
      'Promo cards fall into a broader category and are not synonymous with pre-release events or cards. These cards can be obtained through various means including buy-a-box promos, special products, promotional packs, and much more. This category of cards also includes a wide range of cards from local game store giveaways and tournament rewards. They can include unique features such as alternate arts and foil treatments not found in their regular set’s printings.',
    image: '/buyers-guide-images/vannifar-promo.jpg',
    imageTitle: 'Vannifar, Evolved Enigma Promo (PMKM)'
  }
];

export const borderFrameContent: ArticleObject[] = [
  {
    header: 'Full Art',
    content:
      'Full art cards feature artwork that cover the entire card face with very minimal borders. This is commonly found in lands, but they can also appear in other cards as well.',
    image: '/buyers-guide-images/plains-full-art.jpg',
    imageTitle: 'Plains 282 (MOM) - Full Art'
  },
  {
    header: 'Extended Art',
    content:
      "Extended Art cards extend the artwork to the edges of the card, reducing the border size. Unlike borderless cards, it does not eliminate the card's border.",
    image: '/buyers-guide-images/baru-extended.jpg',
    imageTitle: 'Baru, Wurmspeaker (DMC) - Extended Art'
  },

  {
    header: 'Borderless',
    content:
      'Borderless cards feature art that extends all the way to the edges of the card leaving no no border remaining, except for at the bottom where the artist name and set symbol are printed. Although many alternate art cards are borderless, these characteristics can often be found in other categories such as Showcase cards.',
    image: '/buyers-guide-images/azami-borderless.jpg',
    imageTitle: 'Azami, Lady of Scrolls (CMM) - Borderless'
  },
  {
    header: 'Showcase',
    content:
      'Showcase cards were introduced in new sets starting with the introduction of the Thrones of Eldraine back in October 2019. These sets include an alternate treatment of various cards printed, usually unique to its own set. Many of these cards include an exhaustive list of unique treatments/frames such as the Fang frame, Storybook frame, Retro frame, and much more.',
    image: '/buyers-guide-images/olivia-fang-frame.jpg',
    imageTitle: 'Olivia, Crimson Bride (VOW) - Fang Frame Showcase'
  },
  {
    header: 'Black Border',
    content:
      "These cards feature a black outline encompassing the card. Originally restricted to cards printed for the first time, it is now the standard for core sets from the Tenth Edition onwards including reprints. Foreign black bordered cards are foreign-language, black bordered editions of Revised and Fourth Edition. Despite Revised containing white borders on the cards it reprinted from Magic's earliest sets, Foreign black bordered cards were printed with a black border since it was the first time the cards were being printed in a new language and made them easily identifiable.",
    image: '/buyers-guide-images/cryptex-black-border.jpg',
    imageTitle: 'Cryptex (MKM) - Black Border'
  },
  {
    header: 'White Border',
    content:
      'These cards feature a white outline encompassing the card. White bordered cards were printed between Unlimited and Ninth Edition and are no longer being printed.',
    image: '/buyers-guide-images/shock-white-border.jpg',
    imageTitle: 'Shock (8ED) - White Border'
  },
  {
    header: 'Gold Border',
    content:
      'These cards feature a gold outline encompassing the card and are typically used for commemorative sets. These can be obtained from the original Collectors Edition, tournament deck series between 1997-2004, and the 30th Anniversary Edition. Although not explicitly banned in tournaments, these cards have non legal card backs meaning they can’t be used regardless.',
    image: '/buyers-guide-images/gaeas-gold-border.jpg',
    imageTitle: "Gaea's Cradle (WC99) - Gold Border"
  },
  {
    header: 'Silver Border',
    content:
      'A non legal card that features a silver outline encompassing the card. These are obtained from a list of parody sets including, unglued, certain promos, holiday cards, and more. The cards typically feature mechanics that are impossible to achieve in standard formats.',
    image: '/buyers-guide-images/seraph-silver-border.jpg',
    imageTitle: 'Do-It-Yourself Seraph (UST) - Silver Border'
  },
  {
    header: 'Art Series',
    content:
      'These cards were first introduced in the Modern Horizons Art Series in June 2019 and are typically oriented horizontally. The front side of the card features the card art in its entirety edge to edge with no borders, frames, or text featured on the card.  These cards come with a Golden-Stamped Signature variant that features the artist’s signature on the card face.',
    image: '/buyers-guide-images/asari-art-series.jpg',
    imageTitle: 'Asari Captain (ANEO) - Art Series'
  }
];

export const foilContent: ArticleObject[] = [
  {
    header: 'Pre-Modern Foil',
    content:
      'Pre-Modern Foil cards were the first foil cards printed dating back to the Urza’s Legacy set in 1999 up until the introduction of the 8th edition in 2003. These cards include a shooting star printed in the bottom left corner and represent an exclusive subset of cards before the modern format was introduced. A printing problem occurred with these cards known as a print line which caused a seam to appear on the card face foil treatment.',
    image: '/buyers-guide-images/lighting-dragoin-pre-modern-foil.jpg',
    imageTitle: 'Lightning Dragon (PUSG) - Pre-Modern Foil'
  },
  {
    header: 'Traditional Foil',
    content:
      'With the introduction of the Eighth Edition, a new traditional foiling process was introduced which eliminated the print line issues. These cards feature a rainbow effect covering the whole card face.',
    image: '/buyers-guide-images/sauron-traditional-foil.jpg',
    imageTitle: 'Sauron, the Lidless Eye (LTR) - Traditional Foil'
  },
  {
    header: 'From The Vault Foil',
    content:
      'These cards are unique cards found exclusively in the “From the Vault” sets. They were printed with material twice as reflective as traditional foil cards alongside a treated varnish resulting in a shinier holographic effect.',
    image: '/buyers-guide-images/ancient-tomb-ftv-foil.jpg',
    imageTitle: 'Ancient Tomb (V12) - From the Vault Foil'
  },
  {
    header: 'Etched Foil',
    content:
      'First introduced in the Commander Legends Set, these cards feature a new foiling process that sparkles on certain parts of the card when exposed to light. Unlike most other foil cards which consist of a metallic front and paperback, etched foil cards are printed without the metallic front and instead use metallic ink to create the foil effect. As such, they are NOT prone to the curling issue that most regular foil cards experience in areas of the world which have vastly different humidity to where the card is produced.',
    image: '/buyers-guide-images/wyll-etched-foil.jpg',
    imageTitle: 'Wyll, Blade of Frontiers (CLB) - Etched Foil'
  },
  {
    header: 'Gold Foil-Etched Foil',
    content:
      'Found in the Mischief Secret Lair Drop Series, these cards feature a bright and glittery finish with some of the detail being etched into the card itself.',
    image: '/buyers-guide-images/swords-gold-foiled-etched.jpg',
    imageTitle: 'Swords to Plowshares (SLD) - Gold Foil-Etched'
  },
  {
    header: 'Ampersand Foil',
    content:
      'A very limited treatment found in the Dungeons and Dragons: Adventures in the Forgotten Realms set. This card features the traditional foil alongside a glossy ampersand foil of the Dungeons and Dragons logo on the card face.',
    image: '/buyers-guide-images/tiamat-ampersand-foil.jpg',
    imageTitle: 'Tiamat (AFR) - Ampersand Foil'
  },
  {
    header: 'Silver Screen Foil',
    content:
      'This style of card features the traditional foil with a silver treatment and a glossy finish.',
    image: '/buyers-guide-images/jack-o-lantern-silverscreen-foil.jpg',
    imageTitle: "Jack-o'-Lantern (DBL) - Silver Screen Foil"
  },
  {
    header: 'Neon Ink Foil',
    content:
      'Introduced in the Kamigawa Neon Dynasty set, these foils showcase a fluorescent ink that highlights the card with a pop effect. These cards come in a variety of colour variations ranging from yellow, Blue, Pink, Red, Green, and Rainbow.',
    image: '/buyers-guide-images/hidetsugu-neon-ink-foil.jpg',
    imageTitle: 'Hidetsugu, Devouring Chaos (NEO) - Neon Ink Foil (Red)'
  },
  {
    header: 'Gilded Foil',
    content:
      'The launch of the Streets of New Capenna set brought Gilded Foil cards. Unique features include a smooth elevated 3d frame with a reflective gold finish in addition with the traditional foiling.',
    image: '/buyers-guide-images/atraxa-gilded-foil.jpg',
    imageTitle: 'Atraxa, Praetors’ Voice (SLD) - Gilded Foil'
  },
  {
    header: 'Galaxy Foil',
    content:
      'Galaxy Foils showcase a highly reflective foil treatment with an emphasis on a starry glitter effect which can be found in the Unfinity set.',
    image: '/buyers-guide-images/plains-galaxy-foil.jpg',
    imageTitle: 'Plains (UNF) - Galaxy Foil'
  },
  {
    header: 'Surge Foil',
    content:
      'The Warhammer 40k Commander Series brought the surge foil which features a ripple like foiling effect on the card face.',
    image: '/buyers-guide-images/doctor-surge-foil.jpg',
    imageTitle: 'The First Doctor (WHO) - Surge Foil'
  },
  {
    header: 'Textured Foil',
    content:
      'First featured in Double Masters 2022, these cards feature a unique textured pattern on the card face.',
    image: '/buyers-guide-images/zur-textured-foil.jpg',
    imageTitle: 'Zur, Eternal Schemer (DMU) - Textured Foil'
  },
  {
    header: 'Double-Rainbow Foil',
    content:
      'An extremely rare type of foil only found in numbered serialized schematic retro cards. This set includes 63 serialized cards limited to 500 printings each with its unique print number on the card face.',
    image: '/buyers-guide-images/firesong-double-rainbow.jpg',
    imageTitle: 'Firesong and Sunspeaker (MUL) - Double-Rainbow Foil'
  },
  {
    header: 'Step-and-Compleat Foil',
    content:
      'Exclusively found in the Phyrexia: All Will Be One set, these foils feature the Phyrexian Symbol ”Φ” stamped all across the card face.',
    image: '/buyers-guide-images/wanderer-step-and-compleat-foil.jpg',
    imageTitle: 'The Eternal Wanderer (ONE) - Step-and-Compleat Foil'
  },
  {
    header: 'Oil Slick Raised Foil',
    content:
      'Exclusively found in the Phyrexia: All Will Be One Compleat Edition Bundle, these cards use a very deep and dark foil treatment making it look like it has been exposed to Phyrexian Oil.',
    image: '/buyers-guide-images/elesh-oil-slick-raised-foil.jpg',
    imageTitle: 'Elesh Norn, Mother of Machines (ONE) - Oil Slick Raised Foil'
  },
  {
    header: 'Halo Foil',
    content:
      'These cards feature a unique swirl like effect in the foil treatment all around the card face.',
    image: '/buyers-guide-images/deification-halo-foil.jpg',
    imageTitle: 'Deification (MAT) - Halo Foil'
  },
  {
    header: 'Confetti Foil',
    content:
      'Only appearing in the Anime Borderless cards in the Wilds of Eldraine set, these cards feature a deep and heavy sparkling after effect in the foil treatment.',
    image: '/buyers-guide-images/rhystic-confetti-foil.jpg',
    imageTitle: 'Rhystic Study (WOT) - Confetti Foil'
  },
  {
    header: 'Invisible Ink Foil',
    content:
      'Debuting in the Murders at Karlov Manor set, these cards include hidden notes written by Alquist Proft when viewed at the right angles.',
    image: '/buyers-guide-images/alquist-invisible-ink-foil.jpg',
    imageTitle: 'Alquist Proft, Master Sleuth (MKM) - Invisible Ink Foil'
  }
];

export const showcaseContent: ArticleObject[] = [
  {
    header: 'Storybook Frame',
    content:
      'The Storybook frame is heavily inspired by fairy tales and folklore. The key features include an old-fashioned story book aesthetic with an elaborate vine like frame surrounding the card art. These cards often feature flavour text that emulate an excerpt from a storybook.',
    image: '/buyers-guide-images/flaxen-storybook.jpg',
    imageTitle: 'Flaxen Intruder (ELB) - Showcase Storybook Frame'
  },
  {
    header: 'Constellation Frame',
    content:
      'Debuting in the Theros Beyond Death set in 2020, this showcase is inspired by Greek mythology with a heavy emphasis on constellations as the key visual element. These cards have a unique constellation framing resembling a starry night. Constellations, stars, and other celestial imagery can be found on the card art.',
    image: '/buyers-guide-images/daxos-constellation.jpg',
    imageTitle: 'Daxos, Blessed by the Sun (THB) - Showcase Constellation Frame'
  },
  {
    header: 'Comic Book Treatment',
    content:
      'The key visuals resemble traditional comic book illustrations. Artwork includes vibrant colors, bold lines, and expressive characters posing in a comic book like panel.',
    image: '/buyers-guide-images/illuna-comic.jpg',
    imageTitle: 'Illuna, Apex of Wishes (IKO) - Comic Book Treatment'
  },
  {
    header: 'Signature Spellbook Frame',
    content:
      'These frames are found in the Signature Spell Book premium products featuring reprints of iconic MTG cards. The borders include a sleek design and picks one solid colour to complement the primary artwork on the specific card.',
    image: '/buyers-guide-images/teferi-signature-spellbook.jpg',
    imageTitle: 'Teferi, Master of Time (M21) - Showcase Signature Showcase'
  },
  {
    header: 'Travel Poster Frame',
    content:
      'Introduced in  the Core Set 2021, these card’s artwork depict a vintage travel poster aesthetic from the early 20th century featuring bright colours and iconic landmarks.',
    image: '/buyers-guide-images/spitfire-travel.jpg',
    imageTitle: 'Spitfire Lagac (ZNR) - Showcase Travel Poster Treatment'
  },
  {
    header: 'Hedron Frame',
    content:
      'These cards use an angular and geometric frame meant to depict the mystical nature of the Hedrons in the plane of Zendikar. They feature Zendikar’s unique characteristics ranging from the lands to the Eldrazi creatures.',
    image: '/buyers-guide-images/marsh-hedron.jpg',
    imageTitle: 'Marsh Flats (ZNE) - Showcase Hedron Frame'
  },
  {
    header: 'Viking Frame',
    content:
      'Kaldheim aims to replicate the rugged aesthetic of Viking and Norse mythology, inspired by Viking-like warriors, gods, and lands. These cards can showcase Norse runes, an aged carved wooden frame, and a weathered aesthetic.',
    image: '/buyers-guide-images/halvar-viking.jpg',
    imageTitle: 'Halvar, God of Battle (KHM) - Showcase Viking Frame'
  },
  {
    header: 'Sketch Frame',
    content:
      'The key visuals of these cards use hand drawn sketches to emulate a more rugged artistic aesthetic. The frame and card artwork feature rough pen work with a limited colour palette giving a sketch-like appearance.',
    image: '/buyers-guide-images/urzas-sektch.jpg',
    imageTitle: "Urza's Saga (MH2) - Showcase Sketch Frame"
  },
  {
    header: 'Retro Frame',
    content:
      'The Retro Frame is a throwback to the card frame styles printed on magic sets before the early 2000’s. They have noticeably thicker framing with a black border and feature their original set’s symbols adding a more retro aesthetic.',
    image: '/buyers-guide-images/marble-retro.jpg',
    imageTitle: 'Marble Gargoyle (MH2) - Showcase Retro Frame'
  },
  {
    header: 'Classic Rulebook Frame',
    content:
      'Rulebook frame cards emulate weathered pages from an old textbook. Artwork is presented in a clean and organized format alongside a neutral beige primary color scheme.',
    image: '/buyers-guide-images/cloister-showcase.jpg',
    imageTitle: 'Cloister Gargoyle (AFR) - Showcase Classic Rulebook Frame'
  },
  {
    header: 'Classic Module Frame',
    content:
      'These cards feature iconic characters, creatures, and locations from the Dungeons and Dragons universe. It uses a modular design meant to represent the different rooms one might encounter in a dungeon in the iconic pen and paper game.',
    image: '/buyers-guide-images/evolving-module.jpg',
    imageTitle: 'Evolving Wilds (AFR) - Showcase Classic Module Frame'
  },
  {
    header: 'Equinox Frame',
    content:
      'These cards depict gothic horror themes of creatures such as vampires and werewolves of the Innistrad plane. They use dark and eerie vines and branches which surround the card art as a frame.',
    image: '/buyers-guide-images/arlinn-equinox.jpg',
    imageTitle: "Arlinn, the Pack's Hope (MID) - Showcase Equinox Frame"
  },
  {
    header: 'Eternal Night Treatment',
    content:
      'These cards showcase an alternative artwork using a monochrome colour palette with a very thin coloured border matching the card’s colour type.',
    image: '/buyers-guide-images/island-eternal.jpg',
    imageTitle: 'Island 270 (MID) - Showcase Eternal Night Treatment'
  },
  {
    header: 'Fang Frame',
    content:
      'The key visuals in these showcase cards revolve around the wedding of Olivia Voldaren using dark and gothic horror themes. These cards typically include a thematic story revolving around weddings, vampires, and romance. The frames emulate a pillar-like architecture seen in the Victorian era.',
    image: '/buyers-guide-images/olivia-fang-frame.jpg',
    imageTitle: 'Olivia, Crimson Bride (VOW) - Fang Frame Showcase'
  },
  {
    header: 'The Moonlit Lands Treatment',
    content:
      'This treatment applies to one of each of the basic lands in Innistrad: Crimson Vow. The colours are completely stripped, include an alternate art, and have a glossy silver foil treatment.',
    image: '/buyers-guide-images/island-moonlit.jpg',
    imageTitle: 'Island 409 (VOW) - Showcase'
  },
  {
    header: 'Ninja Frame',
    content:
      'These cards showcase ninja type cards alongside new artwork with a heavy influence on the cyberpunk aesthetic. These cards have a sleek and angular aesthetic for its border frame.',
    image: '/buyers-guide-images/nashi-ninja.jpg',
    imageTitle: "Nashi, Moon Sage's Scion (NEO) - Showcase Ninja Frame"
  },
  {
    header: 'Samurai Frame',
    content:
      'These cards showcase samurai type cards alongside new artwork with a heavy influence on the cyberpunk aesthetic. The frames depict samurai headgear on the upper part of the frame as well as a background made of wood and rope surrounding the card text near the bottom.',
    image: '/buyers-guide-images/isshin-samurai.jpg',
    imageTitle: 'Isshin, Two Heavens as One (NEO) - Showcase Samurai Frame'
  },
  {
    header: 'Soft Glow Frame ',
    content:
      'Typically found on anime cards in the Kamigawa Neon Dynasty Set, these cards feature a frame that resembles traditional Japanese Torii gates.',
    image: '/buyers-guide-images/chip-soft-glow.jpg',
    imageTitle: 'The Reality Chip (NEO) - Showcase Soft Glow Frame'
  },
  {
    header: 'Ukiyo-e lands Illustration',
    content:
      'Exclusive to basic lands in the Kamigawa Neon Dynasty set, these cards depict an alternate art inspired by traditional Japanese wooden prints known as Ukiyo-e. This aesthetic was often used in the 17th century to the 19th century. Depictions include landscapes, folklore, and nature in Japanese history.',
    image: '/buyers-guide-images/island-ukiyo.jpg',
    imageTitle: 'Island 296 (NEO) - Showcase Ukiyo-e lands Illustration'
  },
  {
    header: 'Golden Age Frame',
    content:
      'These showcase cards depict the families that run the city in the Streets of New Capenna set. Cards with three mana colors are given a frame depicting two golden pillars.',
    image: '/buyers-guide-images/riveteers-showcase.jpg',
    imageTitle: 'Riveteers Ascendancy (SNC) - Showcase Golden Age Frame'
  },
  {
    header: 'Art Deco Frame',
    content:
      'These cards typically depict characters not from the 5 major crime families in the Streets of New Capenna set. It adorns a unique frame with three prominent hexagonal geometric framing on the upper part of the card.',
    image: '/buyers-guide-images/elspeth-art.jpg',
    imageTitle: 'Elspeth Resplendent (SNC) - Showcase Art Deco Frame'
  },
  {
    header: 'Metropolis Lands Illustration',
    content:
      'These basic land cards depict iconic landmarks in the Streets of New Capenna set ranging from towering skyscrapers, crowded city streets, and various marketplaces.',
    image: '/buyers-guide-images/mountain-metropolis.jpg',
    imageTitle: 'Mountain 279 (SNC) - Showcase Metropolis Lands Illustration'
  },
  {
    header: 'Skyscraper Frame',
    content:
      'Exclusive to the multi-coloured lands in the Streets of New Capenna set, these frames have an influence on a combination of futuristic, industrial, and steampunk-like aesthetics. The sides of the frames depict the towering characteristics of this skyscraper society.',
    image: '/buyers-guide-images/raffine-skyscraper.jpg',
    imageTitle: "Raffine's Tower (SNC) - Showcase Skyscraper Frame"
  },
  {
    header: 'Stained Glass Frame',
    content:
      'These cards feature an alternate artwork that depicts the original card as vibrant stained glass window craftmenship.',
    image: '/buyers-guide-images/jodah-stained.jpg',
    imageTitle: 'Jodah, the Unifier (DMU) - Showcase Stained Glass Frame'
  },
  {
    header: 'Ichor Treatment',
    content:
      'The Ichor treatment is a sleek alternative art style introduced in Phyrexia: All Will Be One, illustrated in a black and white colour palette.',
    image: '/buyers-guide-images/elesh-ichor.jpg',
    imageTitle:
      'Elesh Norn, Mother of Machines (ONE) - Showcase Ichor Treatment'
  },
  {
    header: 'Manga "What if?" Illustration',
    content:
      'These are borderless alternate art variations in Phyrexia: All Will Be One. These are black and white manga art representations for various legendary heroes and Planeswalkers in the set.',
    image: '/buyers-guide-images/koth-manga.jpg',
    imageTitle: 'Koth, Fire of Resistance (ONE) - Showcase Manga Illustration'
  },
  {
    header: 'Phyrexian Planeswalkers Frame',
    content:
      'The Phyrexian Planeswalkers Frame are alternate card versions of various planeswalkers with a unique frame and the Phyrexian language replacing the card text.',
    image: '/buyers-guide-images/jace-phyrexian.jpg',
    imageTitle:
      'Jace, the Perfected Mind (ONE) - Showcase Phyrexian Planeswalkers Frame'
  },
  {
    header: 'Amonkhet Invocations Frame',
    content:
      'This category of showcase cards heavily uses an ancient Egyptian inspired aesthetic. The entire card is covered in a design reminiscent of Egyptian architecture, making use of gold foil accents, and hieroglyphics all around.',
    image: '/buyers-guide-images/djeru-amonkhet.jpg',
    imageTitle: 'Djeru and Hazoret (MOM) - Showcase Amonkhet Invocations Frame'
  },
  {
    header: 'Mystical Archive Frame',
    content:
      'Debuting in the Strixhaven School of Mages set in 2021, these cards feature a subset of cards known as the Mystical Archive. They have a book inspired design alongside a vibrant coloured frame which reflects the scholarly setting of Strixhaven. The frame’s vibrant colours vary and are dependent on the mana colour of the card.',
    image: '/buyers-guide-images/dina-mystical.jpg',
    imageTitle: 'Dina, Soul Steeper (MUL) - Showcase Mystical Archive Frame'
  },
  {
    header: 'Treasure Frame',
    content:
      'Featured in the The Lost Caverns of Ixalan set, this showcase style takes various treasure tokens and uses Aztec architecture as inspiration for the card art and frame.',
    image: '/buyers-guide-images/ghalta-treasure.jpg',
    imageTitle: 'Ghalta and Mavren (MOM) - Showcase Treasure Frame'
  },
  {
    header: 'Kaladesh Inventions Frame',
    content:
      'Introduced in the Kaladesh Inventions set, these cards showcase the intricate technology in the mechanical world of Kaladesh. The art style features very detailed designs of cards using a mechanical illustration alongside a whirling orange border.',
    image: '/buyers-guide-images/baral-kaldesh.jpg',
    imageTitle: 'Baral and Kari Zev (MOM) - Showcase Kaladesh Inventions Frame'
  },
  {
    header: 'Dragon Wing Frame',
    content:
      'A Special frame depicting dragon wings along the left and right borders.',
    image: '/buyers-guide-images/goreclaw-dragonwing.jpg',
    imageTitle:
      'Goreclaw, Terror of Qal Sisma (MUL) - Showcase Dragon Wing Frame'
  },
  {
    header: 'The Ring Frame',
    content:
      'A collaboration seen in the Lord of the Rings Tales of Middle-Earth set, these cards highlight 30 legendary characters alongside a circular frame and the elven language written on it.',
    image: '/buyers-guide-images/smeagol-ring.jpg',
    imageTitle: 'Sméagol, Helpful Guide (LTR) - Showcase The Ring Frame'
  },
  {
    header: 'Scene Cards',
    content:
      'Lord of the Rings Tales of Middle Earth also introduced a set of borderless cards, when combined side by side depicts a larger mural.',
    image: '/buyers-guide-images/frodo-scene.jpg',
    imageTitle: "Frodo, Sauron's Bane (LTR) -Showcase Scene Cards"
  },
  {
    header: 'Borderless Profiles',
    content:
      'Commander Masters introduced a set of Borderless Profile cards of various legendary creatures. It depicts many legends in the Magic Universe in a high contrast and eye-catching profile picture.',
    image: '/buyers-guide-images/neheb-profile.jpg',
    imageTitle: 'Neheb, the Eternal (CMM) - Showcase Borderless Profiles'
  },
  {
    header: 'Borderless Frame Break Art',
    content:
      'These cards can be found in every Commander Masters Booster. The artwork pops off the card, overlapping on top of the card frame.',
    image: '/buyers-guide-images/jewled-frame-break.jpg',
    imageTitle: 'Jeweled Lotus (CMM) - Showcase Borderless Frame Break Art'
  },
  {
    header: 'TARDIS Frame',
    content:
      'A collaboration with the Doctor Who, these cards depict characters from the franchise in a cartoon like style and a blue frame.',
    image: '/buyers-guide-images/doctor-tardis.jpg',
    imageTitle: 'The Tenth Doctor (WHO) - Showcase TARDIS Frame'
  },
  {
    header: 'LTR Poster Style Treatment',
    content:
      'A collaboration with Lord of the Rings, these cards depict various characters and scenes from the franchise in a vibrant poster style treatment.',
    image: '/buyers-guide-images/entwood-ltr-poster.jpg',
    imageTitle: 'Hew the Entwood (LTR) - Showcase LTR Poster Style Treatment'
  },
  {
    header: 'Brothers Hildebrandt',
    content:
      '20 borderless reprints of original artwork drawn by Greg and Tim Hildebrant for the Lord of the Rings Holiday Release set.',
    image: '/buyers-guide-images/negation-hildebrandt.jpg',
    imageTitle: 'Pact of Negation (LTC) - Showcase Brothers Hildebrandt'
  },
  {
    header: 'Scroll of Middle-Earth Treatment',
    content:
      'These showcase cards come from the Lord of the Rings Holiday Release set which depict Middle Earth on a medieval parchment style and a unique frame that makes the card face look like a scroll.',
    image: '/buyers-guide-images/one-ring-scrolls.jpg',
    imageTitle: 'The One Ring (LTR) - Showcase Scroll of Middle-Earth Treatment'
  },
  {
    header: 'Legends of Ixalan Treatment',
    content:
      '25 cards in the Lost Caverns of Ixalan set, these cards depict various mysteries in the cavern depths in a unique art style and a frame akin to ancient stone ruins.',
    image: '/buyers-guide-images/breeches-ixalan.jpg',
    imageTitle:
      'Breeches, Eager Pillager (LCI) - Showcase Legends of Ixalan Treatment'
  },
  {
    header: 'Gods of Ixalan Frame',
    content:
      '6 cards in the Lost Caverns of Ixalan set, these cards are very reminiscent to the aztec architecture framing style seen in the Treasure frame but now depicts various mythic rare gods.',
    image: '/buyers-guide-images/ojar-gods-of-ixalan.jpg',
    imageTitle:
      'Ojer Axonil, Deepest Might (LCI) - Showcase Gods of Ixalan Frame'
  },
  {
    header: 'Oltec',
    content:
      '16 borderless cards in the Lost Caverns of Ixalan set where the artwork depicts various Oltec cards with a style heavily inspired by Mesoamerican art.',
    image: '/buyers-guide-images/skullspore-oltec.jpg',
    imageTitle: 'The Skullspore Nexus (LCI) - Showcase Oltec'
  },
  {
    header: 'Dinosaur',
    content:
      '14 borderless cards in the Lost Caverns of Ixalan set, whose artwork depicts various dinosaurs in a storybook like art style.',
    image: '/buyers-guide-images/ghalta-dinosaur.jpg',
    imageTitle: 'Ghalta, Stampede Tyrant (LCI) - Showcase Dinosaur'
  },
  {
    header: 'Cosmium Neon Ink',
    content:
      'Cosmium refers to the power within the civilizations in Ixalam. The Lost Caverns of Ixalam set features 2 cards (Cavern of Souls and Mana Crypt) in 6 neon ink treatments which include, blue, yellow, red, green, pink, and rainbow.',
    image: '/buyers-guide-images/cavern-cosmium-rainbow.jpg',
    imageTitle: 'Cavern of Souls (LCI) - Showcase Cosmium Neon Ink (Rainbow)'
  },
  {
    header: 'Core Full Art Illustration',
    content:
      '5 full art basic land cards featuring alternate arts for each colour in The Lost Caverns of Ixalan set.',
    image: '/buyers-guide-images/plains-core-full-art.jpg',
    imageTitle: 'Plains 287 (LCI) - Showcase Core Full Art Illustration'
  },
  {
    header: 'Anime',
    content:
      'Introduced in Ravnica Remastered, these borderless cards feature new artwork for popular cards in an anime like art style.',
    image: '/buyers-guide-images/bruvac-anime.jpg',
    imageTitle: 'Bruvac the Grandiloquent (RVR) - Showcase Anime'
  },
  {
    header: 'Dossier Frame',
    content:
      'These cards were introduced in the Murders at Karlov Manor and depict various characters in a dossier art style, like a detective case file on a suspect.',
    image: '/buyers-guide-images/cadaver-dossier.jpg',
    imageTitle: 'Curious Cadaver (MKM) - Showcase Dossier Frame'
  },
  {
    header: 'Magnified Frame',
    content:
      'Magnified treatment cards are featured in the Murders at Karlov Manor set. The frame is a magnifying glass hovering over the card art which highlights various story elements in the Murders at Karlov Manor storyline.',
    image: '/buyers-guide-images/fanatical-strength-magnified.jpg',
    imageTitle: 'Fanatical Strength (MKM) - Showcase Magnified Frame'
  },
  {
    header: 'Retro Futuristic Frame',
    content:
      'Seen in the Unfinity Set, these cards feature legendary creatures in MTG in a 1950’s cartoon like art style alongside a unique frame.',
    image: '/buyers-guide-images/nocturno-retro-futuristic.jpg',
    imageTitle:
      "Nocturno of Myra's Marvels (UNF) - Showcase Retro Futuristic Frame"
  }
];
