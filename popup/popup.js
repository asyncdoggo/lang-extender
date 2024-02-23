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
            fillLanguages(languages, languageFromSelect, languageToSelect);
            setSelected(languageFromSelect, languageToSelect);
            
        } else {
            chrome.storage.sync.get(['selectedLanguage', 'languages'], function (data) {
                console.log(data);
                const selectedLanguage = data.selectedLanguage;
                const languages = data.languages;
                fillLanguages(languages, languageFromSelect, languageToSelect, selectedLanguage.from);
                languageFromSelect.value = selectedLanguage.from;
                languageToSelect.value = selectedLanguage.to;
            });
        }
        
    });



    // Load the current toggle state from storage
    chrome.storage.sync.get('enabled', function (data) {

        toggleSwitch.checked = data.enabled;
        statusText.textContent = data.enabled ? 'enabled' : 'disabled';
        // Send a message to the content script to toggle the extension's enabled state
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { enabled: data.enabled });
        });
    });

    // Toggle the extension's enabled state when the switch changes
    toggleSwitch.addEventListener('change', function () {
        var enabled = toggleSwitch.checked;
        statusText.textContent = enabled ? 'enabled' : 'disabled';
        // Save the toggle state to storage
        chrome.storage.sync.set({ 'enabled': enabled });
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { enabled: enabled });
        });
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
}



const updateLanguages = () => { 
    chrome.runtime.sendMessage({ action: 'getLanguages' }, (response) => {
        const languages = response.languages;
        // store languages in storage
        chrome.storage.sync.set({ 'languages': languages });
        return languages;
    });
}


const fillLanguages = (languages, languageFromSelect, languageToSelect, selectedFrom) => { 

        for (const key in languages) {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            languageFromSelect.appendChild(option);
        }

        selectedFrom = selectedFrom || Object.keys(languages)[0];
    
        const toList = languages[selectedFrom];
        for (const language of toList) {
            const option = document.createElement('option');
            option.value = language;
            option.text = language;
            languageToSelect.appendChild(option);
        }

}