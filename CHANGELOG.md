# Changelog

## 2024-07-18

### Changed

- Added a setDiscount function in singleSearchStore.ts which hard codes a priceBeforeDiscount for obsidian for now
- It's just setup this way because we start advertising tomorrow (August 1). I'll need setup and apply the discount table in postgres another day.

## 2024-07-18

### Changed

- Major redesign for the single search filters and interface.
- UI changes for multi search
- Multi search "Recommended Stores" component finished, it now opens a modal when clicked to add all the results from that store.
- LoginRequired component updated to include signin form.

## 2024-07-15

### Changed

- Changed all references to website.code to website.slug to match new database schema

## 2024-07-09

### Added

- Added input for Discord username to sign up form
- Added input for Discord username to profile page
- Restyled reset-password, forgot-password, login, signup
