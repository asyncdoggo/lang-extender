chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getLanguages') {
        fetch('http://localhost:8000/translate/list/')
            .then(response => response.json())
            .then(languages => {
                sendResponse({languages: languages });
            })
            .catch(error => console.error('Error fetching languages:', error));
    }
    return true;
});

