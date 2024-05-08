---
title: 'April Development Blog'
date: '2024-04-30'
author: 'Snapcaster Team'
tags:
  - Development Update
  - Magic the Gathering
  - Features
---

We hope with the launch of the new premium features last month that our community has been able to further save on their MTG single purchases. Alongside these new features came a new set of system design considerations, performance improvements, UX changes, and various bug fixes.

We’ve also been hard at work setting up systems that will help us standardize our dataset moving forward. Now we will be able to better detect incorrect card information as we continue to fully flesh out advanced search, wish lists, and new features.

## April Updates

### Single Search

- Users can now switch between list, catalog/grid, and table views when performing single searches.

![Wishlist feature](/blog-images/thumbnail-april.png)

### Wish Lists

- Improved wish list performance and loading times through caching.
- Set a limit of 100 cards per wish list.

### Advanced Search

- Refactored filtering options due to card data inconsistencies between different websites.
- We standardized our card data to its corresponding set. Users can expect significantly more results returned when searching by set.

### Bug Fixes

- Fixed Face to Face Games displaying thousands of duplicate data.
- General UI updates and fixes.

### Added and Removed Stores

- **Added:** Obsidian Games (Vernon BC)
- **Removed:** Untouchables (Mississauga, ON)

### Other

- Added various MTG single purchasing guides.
- Backend refactoring and internal tools used to check the health of our data.
- The search bar autocomplete logic has been updated.
- Spent the month migrating our CDN service.

During the first half of the upcoming month, we’ll be focusing on bugs and UX enhancements from our to-do list. Once satisfied with those changes, we'll flesh out our wish list feature while integrating the remaining 23 websites missing from advanced search.
