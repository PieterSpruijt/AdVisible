# AdVisible Chrome Extension

A Chrome extension that makes Google search ads more visible by highlighting them with a yellow background, bringing back the clear visibility that ads used to have.

## Features

- 🟡 **Yellow Background Highlighting**: Ads are highlighted with a distinctive yellow background
- 🏷️ **Clear Advertisement Labels**: Replaces small "Sponsored" text with prominent "ADVERTISEMENT" labels
- 🛍️ **Shopping Ads Support**: Also highlights Google Shopping ads
- 🔍 **Auto-Detection**: Automatically detects and highlights new ads as they load
- ⚡ **Real-time Updates**: Works with dynamic content and infinite scroll

## Installation

### From Source (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the AdVisible folder
5. The extension will be installed and ready to use

### Usage

1. Once installed, the extension works automatically
2. Go to [Google Search](https://www.google.com)
3. Search for anything - ads will be highlighted with yellow backgrounds
4. Click the extension icon to see status and features

## How It Works

The extension uses content scripts to:

- Detect Google search ad containers using multiple detection methods
- Apply CSS styling to make ads more visible
- Add clear "ADVERTISEMENT" labels
- Monitor for dynamically loaded ads
- Enhance existing "Sponsored" labels

## Privacy

- **No data collection**: This extension does not collect, store, or transmit any user data
- **Local processing**: All ad detection happens locally in your browser
- **Minimal permissions**: Only requires access to Google search pages

## Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Other Chromium-based browsers

## File Structure

```text
AdVisible/
├── manifest.json          # Extension configuration
├── content.js            # Main ad detection and highlighting logic
├── styles.css            # CSS for ad highlighting
├── popup.html            # Extension popup interface
├── icons/                # Extension icons
└── README.md             # This file
```

## Technical Details

### Ad Detection Methods

1. **CSS Selectors**: Uses known Google ad container selectors
2. **Content Analysis**: Searches for "Sponsored" and "Ad" text
3. **DOM Attributes**: Checks for ad-related data attributes
4. **Container Pattern**: Identifies ad containers by structure and size

### Highlighting Features

- Yellow background (`#fff3cd`) with golden border (`#ffc107`)
- "📢 ADVERTISEMENT" label positioned above ads
- Enhanced styling for shopping ads
- Improved visibility for sponsored labels

## Version History

- **v1.0**: Initial release with basic ad highlighting functionality

## Support

If you encounter any issues or have suggestions:

1. Check that the extension is enabled in Chrome extensions
2. Refresh the Google search page
3. Try searching with different terms

## License

This project is open source and available under the MIT License.

---

*Making the web more transparent, one search at a time.*
