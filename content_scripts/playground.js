

function createPlayground() {

    const setSelected = (languageFromSelect, languageToSelect) => {
        const toSelectedLanguage = languageToSelect.value;
        const fromSelectedLanguage = languageFromSelect.value;
        // chrome.storage.sync.set({ 'selectedLanguage': { from: fromSelectedLanguage, to: toSelectedLanguage } });
    }


    let timer = null
    let timer2 = null
    const translate_url = 'http://localhost:5005/translate/'
    // Create the floating window
    const playgroundWindow = document.createElement('div')
    playgroundWindow.id = 'playgroundWindow';
    const resize_bar = document.createElement('div');
    resize_bar.id = 'resize_bar';
    const title = document.createElement('p');
    title.textContent = 'Playground';
    resize_bar.appendChild(title);
    playgroundWindow.appendChild(resize_bar);
    const select1 = document.createElement('select');
    select1.id = 'language1';
    const textArea1 = document.createElement('textarea');
    textArea1.id = 'text1';
    playgroundWindow.appendChild(select1);
    playgroundWindow.appendChild(textArea1);
    const select2 = document.createElement('select');
    select2.id = 'language2';
    const textArea2 = document.createElement('textarea');
    textArea2.id = 'text2';
    textArea2.readOnly = true;
    playgroundWindow.appendChild(select2);
    playgroundWindow.appendChild(textArea2);
    const dismissButton = document.createElement('button');
    // Append the floating window to the document body
    detectLanguageBox = document.createElement('div');
    detectLanguageBox.id = 'detectLanguageBox';
    detectTextBox = document.createElement('textarea');
    detectTextBox.id = 'detectTextBox';
    detectTextBox.placeholder = 'Detect Language';
    detectLanguageBox.appendChild(detectTextBox);
    detectedLanguage = document.createElement('p');
    detectedLanguage.id = 'detectedLanguage';
    detectLanguageBox.appendChild(detectedLanguage);
    playgroundWindow.appendChild(detectLanguageBox);
    dismissButton.id = 'dismissButton';
    dismissButton.textContent = 'Dismiss';
    playgroundWindow.appendChild(dismissButton);
    
    document.body.appendChild(playgroundWindow);

    const styles = `
    #playgroundWindow {
        left: 0;
        top: 0;
        position: absolute;
        z-index: 9999;
        width: 300px;
        background-color: white;
        border: 1px solid black;
        box-shadow: 0px 0px 5px 0px black;
        border-radius: 5px;
        padding:0 10px 10px 10px;
    }
    #resize_bar {
        width: 100%;
        height: 20px;
        background-color: #ccc;
        cursor: move;
        user-select: none;
    }
    #language1, #language2 {
        width: 100%;
        margin-bottom: 5px;
        background-color: white !important;
        color: black !important;
    }

    #text1, #text2 {
        width: 100%;
        height: 100px;
        margin-bottom: 5px;
        background-color: white !important;
        color: black !important;
        resize: none;
    }
    #dismissButton {
        background-color: #f44336;
        color: white;
        
    }
   
    #resize_bar p {
        background-color: white !important;
        color: black !important;
        margin: 5px;
    }
    #detectLanguageBox {
        width: 100%;   
    }
    #detectTextBox {
        width: 100%;
        height: 100px;
        margin-bottom: 5px;
        background-color: white !important;
        color: black !important;
        resize: none;
    }
    #detectedLanguage {
        background-color: white !important;
        color: black !important;
        margin: 5px;
    }
    `

    const styleSheet = document.createElement("style")
    styleSheet.setAttribute("type", "text/css")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    


    let isDragging = false;
    let offsetX, offsetY;

    // Mouse down event listener to start dragging
    resize_bar.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetX = event.clientX - playgroundWindow.offsetLeft;
        offsetY = event.clientY - playgroundWindow.offsetTop;
    });

    // Mouse move event listener to handle dragging
    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            playgroundWindow.style.left = (event.clientX - offsetX) + 'px';
            playgroundWindow.style.top = (event.clientY - offsetY) + 'px';
            // do not let the window go off the screen to the left or top or right or bottom
            if (playgroundWindow.offsetLeft < 0) {
                playgroundWindow.style.left = 0;
            }
            if (playgroundWindow.offsetTop < 0) {
                playgroundWindow.style.top = 0;
            }
            if (playgroundWindow.offsetLeft + playgroundWindow.offsetWidth > window.innerWidth) {
                playgroundWindow.style.left = window.innerWidth - playgroundWindow.offsetWidth + 'px';
            }
            if (playgroundWindow.offsetTop + playgroundWindow.offsetHeight > window.innerHeight) {
                playgroundWindow.style.top = window.innerHeight - playgroundWindow.offsetHeight + 'px';
            }

        
        }
    });

    // Mouse up event listener to stop dragging
    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    // Dismiss button functionality
    dismissButton.addEventListener('click', function () {
        playgroundWindow.remove(); // Remove the playground window from the DOM
    });


    // get languages from the storage
    chrome.storage.sync.get(['languages'], function (data) {
        let languages = data.languages;
        for (const key in languages) {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            select1.appendChild(option);
        }
        const toList = languages[Object.keys(languages)[0]];
        for (const language of toList) {
            const option = document.createElement('option');
            option.value = language;
            option.text = language;
            select2.appendChild(option);
        }
    });


    select1.addEventListener('change', function () {
        const selectedLanguage = select1.value;
        chrome.storage.sync.get(['languages']).then(data => {
            const toLanguages = data.languages[selectedLanguage];
            select2.innerHTML = '';
            for (language of toLanguages) {
                const option = document.createElement('option');
                option.value = language;
                option.text = language;
                select2.appendChild(option);
                setSelected(select1, select2);
            }

        })
    })

    select2.addEventListener('change', () => {
        setSelected(select1, select2);
    })

    textArea1.addEventListener('input', function () {
        // check if user has stopped typing for 1 second
        clearTimeout(timer);
        timer = setTimeout(() => {
            const text = textArea1.value;
            const from_code = select1.value;
            const to_code = select2.value;
            fetch(translate_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, from_code, to_code })
            })
                .then(response => response.json())
                .then(data => {
                    textArea2.value = data.translation;
                })
                .catch(error => {
                    console.error('Error fetching languages:', error);
                })
        }
            , 1000);
    })

    detectTextBox.addEventListener('input', function () {
        // check if user has stopped typing for 1 second
        clearTimeout(timer2);
        timer2 = setTimeout(() => {
            const text = detectTextBox.value;
            fetch('http://localhost:5005/detect/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            })
                .then(response => response.json())
                .then(data => {
                    detectedLanguage.innerText = ""
                    detectedLanguage.innerText = `${data.language}
                    confidence:${data.confidence.toFixed(2) * 100}%`
                })
        }, 1000)
    })
}



// Call the function to create the playground
createPlayground();
