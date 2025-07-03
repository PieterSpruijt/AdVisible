// popup.js for AdVisible

document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('advisible-toggle');
    const statusText = document.getElementById('advisible-status-text');

    // Load state
    chrome.storage.sync.get(['advisibleEnabled'], function (result) {
        const enabled = result.advisibleEnabled !== false; // default true
        toggle.checked = enabled;
        statusText.textContent = enabled ? 'Extension is active on Google Search' : 'Extension is disabled';
        document.querySelector('.status').classList.toggle('active', enabled);
    });

    toggle.addEventListener('change', function () {
        const enabled = toggle.checked;
        chrome.storage.sync.set({ advsibleEnabled: enabled }, function () {
            statusText.textContent = enabled ? 'Extension is active on Google Search' : 'Extension is disabled';
            document.querySelector('.status').classList.toggle('active', enabled);
        });
    });
});
