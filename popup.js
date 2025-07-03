// popup.js for AdVisible

document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('advisible-toggle');
    const statusText = document.getElementById('advisible-status-text');
    const statusDiv = document.querySelector('.status');

    function updateStatus(enabled) {
        if (enabled) {
            statusText.textContent = '✅ Extension is active on Google Search';
            statusDiv.classList.add('active');
        } else {
            statusText.textContent = '❌ Extension is disabled';
            statusDiv.classList.remove('active');
        }
    }

    // Only run storage logic if chrome.storage.sync is available
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['advisibleEnabled'], function (result) {
            const enabled = result.advisibleEnabled !== false; // default true
            toggle.checked = enabled;
            updateStatus(enabled);
        });

        toggle.addEventListener('change', function () {
            const enabled = toggle.checked;
            chrome.storage.sync.set({ advisibleEnabled: enabled }, function () {
                updateStatus(enabled);
            });
        });
    } else {
        // Fallback for non-extension environments
        toggle.checked = true;
        updateStatus(true);
        toggle.disabled = true;
    }
});
