const container = document.getElementById('container');
const colorPicker = document.getElementById('color-picker');

// Random number between x and y
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Convert rgb to hex
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateGrid(containerSelector) {
    container.style.gridTemplateColumns = `repeat(${containerBoxes}, auto)`;
    for (let i = 1; i <= containerSize; i++) {
        const div = document.createElement('div');
        div.setAttribute('class', 'grid-item');

        containerSelector.appendChild(div);
    }
}

function deleteGrid() {
    let child = container.lastElementChild;

    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}

// Slider event
const slider = document.querySelector('.slider');
slider.addEventListener('change', () => {
    deleteGrid();
    containerBoxes = slider.value;
    containerSize = Math.pow(containerBoxes, 2);
    generateGrid(container);
    applyEventListenersToGrid();
});

// Set default container size
let containerBoxes = 32;
let containerSize = Math.pow(containerBoxes, 2);

// Create grid divs
generateGrid(container);

// Detect mouse down/up/leave. Used for the conditional in mouseover event below
let mouseDown = 0;
let middleMouseDown = 0;
let rightMouseDown = 0;

document.body.addEventListener('mousedown', e => {
    if (e.button === 0) {
        ++mouseDown;
    } else if (e.button === 1) {
        ++middleMouseDown;
    } else if (e.button === 2) {
        ++rightMouseDown;
    }
});

document.body.addEventListener('mouseup', e => {
    if (e.button === 0) {
        --mouseDown;
    } else if (e.button === 1) {
        --middleMouseDown;
    } else if (e.button === 2) {
        --rightMouseDown;
    }
});

document.body.addEventListener('mouseleave', e => {
    if (e.button === 0) {
        mouseDown = 0;
    } else if (e.button === 1) {
        middleMouseDown = 0;
    } else if (e.button === 2) {
        rightMouseDown = 0;
    }
});

// Prevents right click menu inside container
container.addEventListener('contextmenu', e => e.preventDefault());

// Apply mouseover events for each div
function applyEventListenersToGrid() {
    const allDivs = document.querySelectorAll('.grid-item');
    allDivs.forEach(div => {
        div.addEventListener('mouseover', e => {
            if (mouseDown) {
                if (rainbowOn === 1) {
                    // Generate 3 random numbers to create an RGB color, converts to hex & applies style to div
                    let rgb = [];
                    for (let i = 1; i <= 3; i++) {
                        rgb.push(randomNum(0, 256));
                    }

                    const hexValue = rgbToHex(rgb[0], rgb[1], rgb[2]);

                    div.setAttribute('style', `background-color: ${hexValue}`);
                } else {
                    div.setAttribute('style', `background-color: #${colorPicker.value}`);
                }
            } else if (rightMouseDown) {
                div.removeAttribute('style');
            }
        });

        div.addEventListener('mousedown', e => {
            if (e.button === 0) {
                if (rainbowOn === 1) {
                    // Generate 3 random numbers to create an RGB color, converts to hex & applies style to div
                    let rgb = [];
                    for (let i = 1; i <= 3; i++) {
                        rgb.push(randomNum(0, 256));
                    }

                    const hexValue = rgbToHex(rgb[0], rgb[1], rgb[2]);

                    div.setAttribute('style', `background-color: ${hexValue}`);
                } else {
                    div.setAttribute('style', `background-color: #${colorPicker.value}`);
                }
            } else if (e.button === 1) {
                const styleAttribute = div.getAttribute('style');

                if (styleAttribute !== null) {
                    const colorPickerButton = document.querySelector('#color-picker-button');
                    let index = styleAttribute.indexOf('#') + 1;

                    colorPicker.value = styleAttribute.slice(index);
                    colorPickerButton.style.backgroundColor = `#${colorPicker.value}`;
                    colorPickerButton.style.color = '#fff';
                }
            } else if (e.button === 2) {
                div.removeAttribute('style');
            }
        });
    });
}

applyEventListenersToGrid();

// Options

// Clear Grid
const clearGrid = document.querySelector('#clear-grid');
clearGrid.addEventListener('click', () => {
    const allDivs = document.querySelectorAll('.grid-item');
    allDivs.forEach(div => {
        div.removeAttribute('style');
    });
});

// Reset Grid Size
const resetGridSize = document.querySelector('#reset-grid-size');
resetGridSize.addEventListener('click', () => {
    deleteGrid();
    containerBoxes = 32;
    slider.value = 32;
    containerSize = Math.pow(containerBoxes, 2);
    generateGrid(container);
    applyEventListenersToGrid();
});

// Toggle Border
let gridItemBorder = 1;

const removeBorder = document.querySelector('#toggle-border');
removeBorder.addEventListener('click', () => {
    const allDivs = document.querySelectorAll('.grid-item');
    allDivs.forEach(div => {
        if (gridItemBorder === 1) {
            div.classList.add('grid-item-noborder');
        } else if (gridItemBorder === 0) {
            div.classList.remove('grid-item-noborder');
        }
    });

    if (gridItemBorder === 0) {
        gridItemBorder = 1;
    } else if (gridItemBorder === 1) {
        gridItemBorder = 0;
    }
});

// Rainbow
let rainbowOn = 0;

const rainbowButton = document.querySelector('#rainbow');
rainbowButton.addEventListener('click', () => {
    if (rainbowOn === 0) {
        rainbowButton.classList.add('rainbow-gradient');
        rainbowButton.textContent = 'Rainbow: On';
    } else if ((rainbowOn = 1)) {
        rainbowButton.classList.remove('rainbow-gradient');
        rainbowButton.textContent = 'Rainbow: Off';
    }

    if (rainbowOn === 0) {
        rainbowOn = 1;
    } else if (rainbowOn === 1) {
        rainbowOn = 0;
    }
});
