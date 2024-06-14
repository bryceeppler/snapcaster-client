---
title: 'March Development Blog'
date: '2024-03-03'
author: 'Snapcaster Team'
tags:
  - Development Update
  - Magic the Gathering
  - Features
preview: "This month has been a significant one for Snapcaster! I've optimized the backend infrastructure, which has greatly improved both reliability and performance for searches. With these enhancements out of the way, we can now focus on developing new features. Additionally, we've introduced the Snapcaster Pro membership, providing an avenue for users to support the development and maintenance of Snapcaster."
image: 'blog-images/march-thumbnail.png'
---

This month has been a significant one for Snapcaster! I've optimized the backend infrastructure, which has greatly improved both reliability and performance for searches. With these enhancements out of the way, we can now focus on developing new features. Additionally, we've introduced the Snapcaster Pro membership, providing an avenue for users to support the development and maintenance of Snapcaster.

We have also launched our Discord server, where you can join to give us feedback, report bugs, and keep up with updates. We're excited to have you join our community and look forward to hearing your thoughts and suggestions.

Moving forward, new features will primarily be exclusive to Pro members. We've already begun implementing some of these features, and users can anticipate seeing them evolve over time. Note that we intend on keeping the core search and multisearch functionality free.

## New Features

### Wishlists

- Users can now create lists of cards for easy price checking.
- A price notification feature is in the works, which will allow users to be notified when a card matching their criteria becomes available.

Wishlist items currently use the single search API endpoint which means that this service is ideal for people who want to build a deck using the cheapest card printing for their deck. We hope to allow users to apply advanced search filters in wishlists in the future but we're experimenting with the filter options alot right now and don't want to affect old wishlists.

![Wishlist feature](/blog-images/march-wishlist.png)

### Advanced Search

- An advanced search feature now supports the majority of stores on Snapcaster.
- Efforts are ongoing to expand this feature to include as many websites on Snapcaster as possible.
- This tool enables users to filter by specific criteria, helping to exclude unwanted cards or discover deals on specific printings or art styles.

Some of the filters we're experimenting with include: Website, Set, Condition, Foil, Showcase Treatment, Art Frame Type, Collector Number, Pre-release, Promo, Alternate Art, Retor, Art Series, Golden Stamped Signature, and Other. We'll probably add, remove, and adjust these as we continue to develop as we find the best way to structure the filter options to accommodate as many websites as possible.

The term showcase has become extremely vague over the past 5 years since it's debut and makes scraping cards alot more difficult. For example, many showcase cards are technically borderless cards but aren't categorized as such on the LGS listing so we're going to experiment with an option to toggle between search results containing non showcase, showcase, or both in your queries and adjust from there.

Advanced search supports about 2/3 of the websites used in single search and multisearch. Local Game Stores that use Crystal Commerce to power their back end use really messy naming conventions that we'll have to take into account.

![Advanced search feature](/blog-images/march-advanced.png)

### 100 Card Multisearch

Pro users can now search for up to 100 cards simultaneously using the multisearch tool.

## 17 New Stores

We've revisited our to-do list this month and added a substantial number of the requested stores, with more to come soon!

- J&J Cards
- MTG North
- Dragon Fyre Games
- Carta Magica Ottawa
- Carta Magica Montreal
- Free Game
- Gods Arena
- Fetch Shock Games
- Boutique Awesome
- Gaming Kingdom
- Mecha Games
- Multizone
- Trinity Hobby
- Luke’s Cards
- Dark Crystal Cards
- Bootown’s Games
- Prisma Games Edmonton

## Websites Removed from Snapcaster

- North of Exile Games

This development journey continues to be an exciting one, and your support, especially through the Pro membership, is invaluable to us. Stay tuned for more updates and enhancements as we continue to work on Snapcaster and introduce some cool features. Thank you for being a part of our community!
