# Website structure

## Pages and shared assets

- `index.html` is the bilingual homepage.
- `assets/pages/terms-en.html` and `assets/pages/terms-nl.html` are the English and Dutch terms pages.
- `assets/includes/` contains the shared navigation and footer loaded by `assets/js/script.js`.
- `assets/css/styles.css` contains shared page styles.
- `assets/images/` contains the logo, profile image, favicon, and background artwork.

## Updating homepage content

Localized copy is stored in `assets/data/translations.en.json` and `assets/data/translations.nl.json`.

- Edit the `exp.itemN.*` keys in both translation files to update an experience entry.
- `assets/data/experience-structure.json` controls experience order. Add an item ID there and provide its `period`, `title`, and `desc` keys in both language files.
- `assets/data/skills-structure.json` controls skill groups and order. Add the corresponding translated category and item keys to both language files.

The homepage loads these files with `fetch`, so run it through a local web server when testing; opening `index.html` directly as a file will not load the shared includes and data.
