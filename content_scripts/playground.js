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
        height: 300px;
        background-color: white;
        border: 1px solid black;
        box-shadow: 0px 0px 5px 0px black;
        border-radius: 5px;
        padding: 10px;
    }
    #resize_bar {
        width: 100%;
        height: 20px;
        background-color: #ccc;
        cursor: move;
        user-select: none;
    }
    #dismissButton {
        position: absolute;
        bottom: 5px;
        right: 5px;
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
        position: absolute;
        bottom: 5px;
        right: 5px;
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
}

// Call the function to create the playground
createPlayground();
