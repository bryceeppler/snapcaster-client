# Changelog

## 2024-08-21

- Updated store.ts promoMap which is used to apply discount codes based on discound codes and percentages stores in postgres
- Fixed a bug that didnt list advanced filtering fields in the card for non pro members (make sure to disable this September 1)
- Updated single-results.tsx to make use of the new websites fields and promoMap details. Logos and anbd discount codes are pulled from postgres /search endpoint instead of being hard coded now
- Note 1: Take a second and update the image_source field data to come from our S3 instead of our public folder
- Note 2: Make sure the backend /search micro service is updated and you run the sql queries that updates our vendors table before merging this into main.

## 2024-08-13

### Changed

- Fixed UI spacing bugs for single search
- Fixed bug where filters werent reset when changing tcg's or doing a new query within the same tcg leading to limited results
- Added advanced filtering options on the home page for all TCG's (One Piece is a WIP)
- Removed href on cardImage components that would redirect users to snapcaster.ca/# and bring them to the top of the page.

## 2024-08-11

### Changed

- updated the gitignore to not push .env
- removed advanced search from the navbar components/ui/navbar.tsx
- adjusted pages/api/ads.ts to read /development/ads.json so new developers can load the client without the postgres URI (New devs will have to ask an admin for the /development/ads.json file)

## 2024-07-31

### Changed

- Hard coded exor games, level up games, and chimera games as options in the recommended stores options in /pages/multisearch/index.tsx
- you can add and remove websites in the reccomendedWebsites list which contains a list of reccomended stores by slug
- this pull from the postgres tables in the future

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
