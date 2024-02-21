document.addEventListener('DOMContentLoaded', function () {
    var toggleSwitch = document.getElementById('toggleSwitch');
    var statusText = document.getElementById('statusText');
    const languageFromSelect = document.getElementById('languageFromSelect');
    const languageToSelect = document.getElementById('languageToSelect');

    // check if languages are already stored in storage
    chrome.storage.sync.get(['languages'], function (data) {
        let languages = data.languages;
        if (!languages) {
            languages = updateLanguages(languageFromSelect, languageToSelect);
            setSelected(languageFromSelect, languageToSelect);
        } else {
            fillLanguages(languages, languageFromSelect, languageToSelect);
            setSelected(languageFromSelect, languageToSelect);
        }
    });



    // Load the current toggle state from storage
    chrome.storage.sync.get('enabled', function (data) {
        toggleSwitch.checked = data.enabled;
        statusText.textContent = data.enabled ? 'enabled' : 'disabled';
    });

    // Toggle the extension's enabled state when the switch changes
    toggleSwitch.addEventListener('change', function () {
        var enabled = toggleSwitch.checked;
        statusText.textContent = enabled ? 'enabled' : 'disabled';
        // Save the toggle state to storage
        chrome.storage.sync.set({ 'enabled': enabled });
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
            setSelected(languageFromSelect, languageToSelect);
        })
    })
    languageToSelect.addEventListener('change', () => { 
        setSelected(languageFromSelect, languageToSelect);
    })

    const openPlaygroundButton = document.getElementById('openPlayground');

    openPlaygroundButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: 'openPlayground' });
    });

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'error') {
        document.getElementById('error').textContent = request.error;
    }
});


const setSelected = (languageFromSelect, languageToSelect) => {
    const toSelectedLanguage = languageToSelect.value;
    const fromSelectedLanguage = languageFromSelect.value;
    chrome.storage.sync.set({ 'selectedLanguage': { from: fromSelectedLanguage, to: toSelectedLanguage } });
    console.log('Selected language:', fromSelectedLanguage, toSelectedLanguage);
}



const updateLanguages = (languageFromSelect, languageToSelect) => { 
    chrome.runtime.sendMessage({ action: 'getLanguages' }, (response) => {
        const languages = response.languages;
        // store languages in storage
        chrome.storage.sync.set({ 'languages': languages });
        fillLanguages(languages, languageFromSelect, languageToSelect);
        return languages;
    });
}


const fillLanguages = (languages, languageFromSelect, languageToSelect) => { 
    

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

}