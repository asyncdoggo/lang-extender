document.addEventListener('DOMContentLoaded', function () {
    var toggleSwitch = document.getElementById('toggleSwitch');
    var statusText = document.getElementById('statusText');

    const setSelected = () => {
        const toSelectedLanguage = languageToSelect.value;
        const fromSelectedLanguage = languageFromSelect.value;
        chrome.storage.sync.set({ 'selectedLanguage': { from: fromSelectedLanguage, to: toSelectedLanguage } });
        console.log('Selected language:', fromSelectedLanguage, toSelectedLanguage);
    }

    // Load the current toggle state from storage
    chrome.storage.sync.get('enabled', function (data) {
        toggleSwitch.checked = data.enabled;
        updateStatusText(data.enabled);
    });

    // Toggle the extension's enabled state when the switch changes
    toggleSwitch.addEventListener('change', function () {
        var enabled = toggleSwitch.checked;
        updateStatusText(enabled);
        // Save the toggle state to storage
        chrome.storage.sync.set({ 'enabled': enabled });
    });

    function updateStatusText(enabled) {
        statusText.textContent = enabled ? 'enabled' : 'disabled';
    }


    const languageFromSelect = document.getElementById('languageFromSelect');
    const languageToSelect = document.getElementById('languageToSelect');
    chrome.runtime.sendMessage({ action: 'getLanguages' }, (response) => { 
        const languages = response.languages;
        // store languages in storage
        chrome.storage.sync.set({ 'languages': languages });
        for (const key in languages) {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            languageFromSelect.appendChild(option);
        }

        const toList = languages[Object.keys(languages)[0]];
        for (const language of toList) {
            const option = document.createElement('option');
            option.value = language;
            option.text = language;
            languageToSelect.appendChild(option);
        }
        setSelected();
    });

    languageFromSelect.addEventListener('change', function () { 
        const selectedLanguage = languageFromSelect.value;
        // Create the 'to' language list for selected 'for' language
        chrome.storage.sync.get(['languages']).then(data => { 
            const toLanguages = data.languages[selectedLanguage];
            languageToSelect.innerHTML = '';
            for(language of toLanguages) {
                const option = document.createElement('option');
                option.value = language;
                option.text = language;
                languageToSelect.appendChild(option);
            }
            setSelected();
        })
    })
    languageToSelect.addEventListener('change', setSelected)

});
