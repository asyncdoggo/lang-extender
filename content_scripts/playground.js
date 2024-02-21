let timer = null


function createPlayground() {
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
    dismissButton.id = 'dismissButton';
    dismissButton.textContent = 'Dismiss';
    playgroundWindow.appendChild(dismissButton);
    // Append the floating window to the document body
    document.body.appendChild(playgroundWindow);


    const styles = `
    #playgroundWindow {
        position: absolute;
        z-index: 1000;
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
    }

    #text1, #text2 {
        width: 100%;
        height: 100px;
        margin-bottom: 5px;
    }
    #dismissButton {
        background-color: #f44336;
        color: white;
        
    }
    #text1, #text2 {
        resize: none;
        margin-bottom: 5px;
    }
    #resize_bar p {
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
            fetch('http://localhost:5005/translate/', {
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
                
        const text = textArea1.value;
        const from_code = select1.value;
        const to_code = select2.value;
        // fetch('http://localhost:5005/translate/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ text, from_code, to_code })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         textArea2.value = data.translation;
        //     })
        //     .catch(error => {
        //         console.error('Error fetching languages:', error);
        //     })
    })


}

const setSelected = (languageFromSelect, languageToSelect) => { 
    const toSelectedLanguage = languageToSelect.value;
    const fromSelectedLanguage = languageFromSelect.value;
    chrome.storage.sync.set({ 'selectedLanguage': { from: fromSelectedLanguage, to: toSelectedLanguage } });
}








// Call the function to create the playground
createPlayground();
