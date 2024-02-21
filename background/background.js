const translate_url = "http://localhost:5005/translate/list/"



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getLanguages') {
        fetch(translate_url)
            .then(response => response.json())
            .then(languages => {
                sendResponse({languages: languages });
            })
            .catch(error => console.error('Error fetching languages:', error));
    }
    return true;
});

