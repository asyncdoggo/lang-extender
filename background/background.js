const language_get_url = "http://localhost:5005/translate/list/"



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getLanguages') {
        fetch(language_get_url)
            .then(response => response.json())
            .then(languages => {
                sendResponse({ languages: languages });
            })
            .catch(error => console.error('Error fetching languages:', error));
    }
    if (message.action === 'openPlayground') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content_scripts/playground.js']
            });
        });
    }
    return true;
});


chrome.runtime.onInstalled.addListener(() => { 
    chrome.storage.sync.set({ 'enabled': true });

    fetch(language_get_url)
        .then(response => response.json())
        .then(languages => {
            chrome.storage.sync.set({ 'languages': languages });
        })
        .catch(error => console.error('Error fetching languages:', error));
    
    chrome.storage.sync.set({ 'selectedLanguage': { from: '', to: '' } }); 
})