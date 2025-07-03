// AdVisible Chrome Extension - Content Script
// Makes Google search ads more visible with yellow background

(function() {
    'use strict';

    // Check if extension is enabled
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['advisibleEnabled'], function (result) {
            if (result.advisibleEnabled === false) {
                // Disabled, do nothing
                return;
            } else {
                main();
            }
        });
    } else {
        // Fallback for non-extension environments
        main();
    }

    function main() {
        // Configuration
        const config = {
            checkInterval: 500, // Check for new ads every 500ms
            maxChecks: 20, // Maximum number of checks
            processed: new Set() // Keep track of processed elements
        };

        // Common selectors for Google ads
        const adSelectors = [
            // Main search ads
            '[data-text-ad]',
            '[data-pla]',
            'div[data-async-context*="ad"]',
            '.ads-ad',
            '.ad_cclk',
            '.commercial-unit-desktop-top',
            '.commercial-unit-desktop-rhs',

            // Shopping ads
            '.sh-pr__product-results-grid .sh-dgr__grid-result',
            '.pla-unit',
            '.pla-unit-container',
            '.commercial-unit-desktop-rhs .pla-unit',

            // Text ads with specific patterns
            'div[data-jibp="h"]',
            'div[jsname][data-async-fc]',

            // New Google ad containers
            'div[data-pcu]',
            'div[jscontroller][data-async-fc]'
        ];

        // Selectors for sponsored labels to enhance
        const sponsoredSelectors = [
            'span:contains("Sponsored")',
            'span:contains("Ad")',
            '.ads-visurl',
            '.ad-label',
            '[aria-label*="Ad"]',
            '[aria-label*="Sponsored"]'
        ];

        function log(message) {
            console.log(`[AdVisible] ${message}`);
        }

        function highlightAds() {
            let highlightedCount = 0;

            // Find and highlight ad containers
            adSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (!config.processed.has(element) && isValidAdElement(element)) {
                            highlightElement(element);
                            config.processed.add(element);
                            highlightedCount++;
                        }
                    });
                } catch (e) {
                    // Ignore selector errors
                }
            });

            // Enhanced detection for ads based on content
            findAdsByContent();

            // Enhance sponsored labels
            enhanceSponsoredLabels();

            return highlightedCount;
        }

        function isValidAdElement(element) {
            // Skip if already processed
            if (element.classList.contains('advisible-highlighted')) {
                return false;
            }

            // Skip if too small (likely not a main ad)
            const rect = element.getBoundingClientRect();
            if (rect.width < 100 || rect.height < 50) {
                return false;
            }

            // Skip if hidden
            if (element.offsetParent === null) {
                return false;
            }

            return true;
        }

        function findAdsByContent() {
            // Look for elements containing "Sponsored" or "Ad" text
            const textNodes = document.evaluate(
                "//text()[contains(., 'Sponsored') or contains(., 'Ad·')]",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for (let i = 0; i < textNodes.snapshotLength; i++) {
                const textNode = textNodes.snapshotItem(i);
                const parent = textNode.parentElement;

                if (parent) {
                    // Find the ad container (usually a few levels up)
                    let adContainer = findAdContainer(parent);
                    if (adContainer && !config.processed.has(adContainer)) {
                        highlightElement(adContainer);
                        config.processed.add(adContainer);
                    }
                }
            }
        }

        function findAdContainer(element) {
            let current = element;
            let levels = 0;

            while (current && levels < 10) {
                // Look for common ad container patterns
                if (current.tagName === 'DIV' &&
                    (current.className.includes('g') ||
                        current.className.includes('ads') ||
                        current.hasAttribute('data-async-fc') ||
                        current.hasAttribute('data-pcu'))) {

                    const rect = current.getBoundingClientRect();
                    if (rect.width > 200 && rect.height > 80) {
                        return current;
                    }
                }

                current = current.parentElement;
                levels++;
            }

            return null;
        }

        function highlightElement(element) {
            // Add highlight class
            element.classList.add('advisible-highlighted');

            // Special handling for shopping ads
            if (element.closest('.sh-pr__product-results-grid') ||
                element.className.includes('pla-')) {
                element.classList.add('advisible-shopping-ad');
            }

            log(`Highlighted ad element: ${element.tagName}.${element.className}`);
        }

        function enhanceSponsoredLabels() {
            // Find and enhance sponsored labels
            const spans = document.querySelectorAll('span');
            spans.forEach(span => {
                const text = span.textContent.trim().toLowerCase();
                if ((text === 'sponsored' || text === 'ad' || text.includes('ad·')) &&
                    !span.classList.contains('advisible-sponsored-label')) {
                    span.classList.add('advisible-sponsored-label');
                }
            });
        }

        function initializeExtension() {
            log('AdVisible extension initialized');

            let checkCount = 0;

            function performCheck() {
                if (checkCount >= config.maxChecks) {
                    log('Maximum checks reached, stopping periodic checks');
                    return;
                }

                const highlighted = highlightAds();
                if (highlighted > 0) {
                    log(`Highlighted ${highlighted} new ads`);
                }

                checkCount++;
                setTimeout(performCheck, config.checkInterval);
            }

            // Initial check
            setTimeout(performCheck, 100);

            // Observer for dynamic content
            const observer = new MutationObserver((mutations) => {
                let shouldCheck = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                    }
                });

                if (shouldCheck) {
                    setTimeout(highlightAds, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            log('MutationObserver set up for dynamic content');
        }

        // Start the extension when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeExtension);
        } else {
            initializeExtension();
        }
    }
})();
