let selected_text = '';
let mouse_timer = 0;
position = {
    x: 0,
    y: 0
}

const translate_url = "http://localhost:5005/translate/"


document.addEventListener('selectionchange', (event) => {
    if (event.target.className === 'popup') { 
        return
    }

    const selection = window.getSelection();
    selected_text = selection.toString();
})

document.addEventListener('mouseup', (event) => {
    // if selected text is in the popup then return
    if (event.target.className === 'popup') {
        return
    }


    if (event.button === 0) {
        if (selected_text.length > 0) {
            translate(selected_text, (data) => {
                showPopup(data, position.x, position.y);
            })
            position.x = event.pageX
            position.y = event.pageY
        }
    }
})

document.addEventListener('mousedown', (event) => {
    // if mouse down on the popup then return
    if (event.target.className === 'popup') {
        return
    }
    document.getElementById('popup')?.remove();

    mouse_timer = performance.now();
    if (event.button === 0) {
        selected_text = '';
    }
})


function translate(text, callback) {

    chrome.storage.sync.get(['selectedLanguage'], (data) => {
        const from_code = data.selectedLanguage.from;
        const to_code = data.selectedLanguage.to;
        fetch(translate_url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, from_code, to_code })
            }
        )
            .then(response => response.json())
            .then(data => {
                if (callback) {
                    callback(data);
                }
            })
            .catch(error => {
                // chrome.runtime.sendMessage({ action: "error", error: error });
                console.error('Error fetching languages:', error);
            })
    })
}

// show popup with translated text at the selected text
function showPopup(data, x, y) { 

    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';
    popup.style.position = 'absolute';
    popup.style.left = x + 'px';
    popup.style.top = y + 15 + 'px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '5px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0px 0px 5px 0px black';
    popup.style.borderRadius = '5px';
    popup.style.maxWidth = '300px';
    
    const translation = document.createElement('div');
    translation.style.fontWeight = 'bold';
    translation.className = 'popup'
    translation.style.setProperty('color', 'black', "important");
    translation.textContent = data.translation;
    popup.appendChild(translation);

    if (data.meaning.length > 0) { 
        const meaning = document.createElement('div');
        meaning.className = 'popup'
        meaning.style.setProperty('color', 'black', "important");
        meaning.textContent += "Meaning: " + data.meaning.join(', ');
        popup.appendChild(meaning);
    }

    if (data.similar_words.length > 0) { 
        const synonyms = document.createElement('div');
        synonyms.className = 'popup'
        synonyms.style.setProperty('color', 'black', "important");
        synonyms.textContent += "Synonyms: " + data.similar_words.join(', ');
        popup.appendChild(synonyms);
    }



    document.body.appendChild(popup);
}