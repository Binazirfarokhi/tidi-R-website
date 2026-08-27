# Prompt History

## Menu Updates

- Identified that the main navigation is hardcoded in each exported HTML page, with separate desktop and mobile menu blocks.
- Confirmed the `More...` menu item is not hardcoded in the HTML; it appears to be handled by the original Weebly theme behavior when the desktop menu overflows.
- Added a test submenu under the `About the Book` menu item in `public/index.html` only.
- Added submenu entries for:
  - `The DNA of Executive Protection` linking to `about-the-book.html`
  - `Ambivalent Crossroads` linking to `ambivalent-crossroads.html`
- Added the submenu in both the desktop navigation and mobile navigation blocks on `public/index.html`.
- Attempted a homepage-only dynamic resize script for the `More...` overflow menu, then reverted it after it did not work as desired.
- Renamed the visible `About the Book` menu label on `public/index.html` to `Books List`, then changed it to `Book List`.
- Current state: `public/index.html` uses `Book List` as the menu label and keeps the two-item submenu beneath it.
- Applied the same `Book List` visible menu label and two-item submenu to the desktop and mobile navigation blocks in the other exported HTML pages: `about-the-book.html`, `about-the-author.html`, `ambivalent-crossroads.html`, `bookstore.html`, `contact.html`, `news-and-events-891839.html`, and `reviews-891839-899175.html`.
- Made the `Book List` parent menu item non-clickable by removing its `href` from the visible desktop and mobile menu anchors across all exported HTML pages while keeping the submenu book links clickable.
