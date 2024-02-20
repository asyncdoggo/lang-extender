let selected_text = '';
let mouse_timer = 0;
position = {
    x: 0,
    y: 0
}

document.addEventListener('selectionchange', (event) => {    
    const selection = window.getSelection();
        selected_text = selection.toString();
})

document.addEventListener('mouseup', (event) => {
    // if selected text is in the popup then return
    if (event.target.id === 'popup') {
        return
    }


    if (event.button === 0) {
        if (selected_text.length > 0) {
            translate(selected_text, (translated_text) => { 
                showPopup(translated_text, position.x, position.y);
            })
            position.x = event.pageX
            position.y = event.pageY
        }
    }
})

document.addEventListener('mousedown', (event) => {
    // if mouse down on the popup then return
    if (event.target.id === 'popup') {
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
        console.log('Translating:', data);
        const from_code = data.selectedLanguage.from;
        const to_code = data.selectedLanguage.to;
        fetch("http://localhost:8000/translate/",
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
                console.log('Translated:', data);
                if (callback) {
                    callback(data.translation);
                }
            })
            .catch(error => console.error('Error fetching languages:', error));
    });
}

// show popup with translated text at the selected text
function showPopup(translated_text, x, y) { 
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'absolute';
    popup.style.top = `${y}px`;
    popup.style.left = `${x}px`;
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '10px';
    popup.style.zIndex = '9999';
    popup.style.color = 'black';
    popup.innerHTML = translated_text;
    document.body.appendChild(popup);
}