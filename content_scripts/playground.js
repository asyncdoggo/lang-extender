

function createPlayground() {

    const setSelected = (languageFromSelect, languageToSelect) => {
        return
        const toSelectedLanguage = languageToSelect.value;
        const fromSelectedLanguage = languageFromSelect.value;
        // chrome.storage.sync.set({ 'selectedLanguage': { from: fromSelectedLanguage, to: toSelectedLanguage } });
    }


    let timer = null
    let timer2 = null
    const translate_url = 'http://localhost:5005/translate/'
    const detect_url = 'http://localhost:5005/detect/'


    const html = `
    <div id="playgroundWindow">
        <div id="resize_bar">
            <p>Playground</p>
            <div id="buttons">
                <svg id="minimizeButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                    <path d="M0 192v128h512V192z"/>
                </svg>

                <svg id="dismissButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                    <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                </svg>
            </div>
        </div>
        <select id="language1"></select>
        <textarea id="text1"></textarea>
        <select id="language2"></select>
        <textarea id="text2" readonly></textarea>
        <div id="detectLanguageBox">
            <textarea id="detectTextBox" placeholder="Detect Language"></textarea>
            <p id="detectedLanguage"></p>
        </div>
    </div>
    `
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const playgroundWindow = doc.getElementById('playgroundWindow');
    const resize_bar = doc.getElementById('resize_bar');
    const select1 = doc.getElementById('language1');
    const textArea1 = doc.getElementById('text1');
    const select2 = doc.getElementById('language2');
    const textArea2 = doc.getElementById('text2');
    const dismissButton = doc.getElementById('dismissButton');
    const minimizeButton = doc.getElementById('minimizeButton');
    const detectTextBox = doc.getElementById('detectTextBox');
    const detectedLanguage = doc.getElementById('detectedLanguage');
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

        display: flex;
        justify-content: space-between;
        align-items: center;
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

    #buttons{
        display: flex;
        align-items: center;
    }

    #dismissButton,#minimizeButton {
        color: white;
        cursor: pointer;
        padding: 2px;
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

    // Minimize button functionality
    minimizeButton.addEventListener('click', function () { 
        if (playgroundWindow.style.height === '20px') {
            playgroundWindow.style.height = 'auto';
            textArea1.style.display = 'block';
            textArea2.style.display = 'block';
            detectTextBox.style.display = 'block';
            detectedLanguage.style.display = 'block';
            select1.style.display = 'block';
            select2.style.display = 'block';
        } else {
            playgroundWindow.style.height = '20px';
            textArea1.style.display = 'none';
            textArea2.style.display = 'none';
            detectTextBox.style.display = 'none';
            detectedLanguage.style.display = 'none';
            select1.style.display = 'none';
            select2.style.display = 'none';
        }
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
            fetch(detect_url, {
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

createPlayground();
