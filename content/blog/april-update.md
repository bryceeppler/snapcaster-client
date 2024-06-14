---
title: 'April Development Blog'
date: '2024-04-1'
author: 'Snapcaster Team'
tags:
  - Development Update
  - Magic the Gathering
  - Features
preview: "We've been working hard to add single search views, finish up wishlists and refine our advanced search feature. With the addition of Obsidian Games (Vernon) this month, we have now reached 70 active stores!"
image: 'blog-images/april-thumbnail.png'
---

We hope with the launch of the new premium features last month that our community has been able to further save on their MTG single purchases. Alongside these new features came a new set of system design considerations, performance improvements, UX changes, and various bug fixes.

We ran into some issues where some websites were giving us duplicate data which would result in queries having up to 2000 instances of duplicate data. We’ve also been hard at work setting up systems that will help us standardize our dataset moving forward. Now we will be able to better detect incorrect card information as we continue to fully flesh out advanced search, wish lists, and new features.

## April Updates

### Single Search

- Users can now switch between list, catalog/grid, and table views when performing single searches.

![Wishlist feature](/blog-images/april-single-search.png)

### Wish Lists

- Improved wish list performance and loading times through caching.
- Set a limit of 100 cards per wish list.

Users were experience really long load times on really large lists. We've set up a caching service and set a limit of 100 cards per wishlist in place to help smoothen the user experience. We've also made some minor adjustments to the card search box on the wishlist page.

### Advanced Search

- Refactored filtering options due to card data inconsistencies between different websites.
- We standardized our card data to its corresponding set. Users can expect significantly more results returned when searching by set.

We removed the option to filter by card number since about 25-30 of the supported websites don't have a way of getting the collection number easily. The Retro Frame option was placed in the dropdown for the frame type even though Retro Frame is used as a Showcase term. All of the options in the "Other" dropdown menu such as Anime, Manga, The Moonlit Lands were moved to the Showcase Treatment dropdown instead. Golden Stamped Series cards will have the Art Card badge by default in the search results now.

The options in the sets dropdown were using a list of set names from MTGJSON. The issue is that a lot of stores have slightly different naming conventions for their set names. Scraped sets without the exact usage of character like semicolons wouldn't populate in the dropdown. Now, the dropdown will list every single unique set name scraped and will not list any sets that have a card count of 0 across all the websites.

### Other Bug Fixes

- Fixed Face to Face Games displaying thousands of duplicate data.
- General UI updates and fixes.

### Added and Removed Stores

- **Added:** Obsidian Games (Vernon BC)
- **Removed:** Untouchables (Mississauga, ON)

We've removed Untouchables for now. They're one of the few Shopify stores that don't use Binder POS for their back end system so the naming convention of cards and sets have becoming extremly difficult to maintain. Untouchables also had a smaller inventory relative to our other stores but it pretty much came down to issues integrading it with our other stores.

On the other hand, the owner of Obsidian Games reached out to us to have his local game store added to Snapcaster and we're more than happy to add him! We hope you guys can save even more as we continue to add more websites in the future.

### Other

- Added various MTG single purchasing guides.
- Backend refactoring and internal tools used to check the health of our data.
- The search bar autocomplete logic has been updated.
- Spent the month migrating our CDN service.

During the first half of the upcoming month, we’ll be focusing on bugs and UX enhancements from our to-do list. Once satisfied with those changes, we'll flesh out our wish list feature while integrating the remaining 23 websites missing from advanced search.
