const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
undoBtn = document.querySelector(".undo"),
redoBtn = document.querySelector(".redo"),
ctx = canvas.getContext("2d");

// Global variables
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000",
undoStack = [], // Stack to save the canvas state for undo
redoStack = []; // Stack to save the canvas state for redo

// Function to set the canvas background to white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Reset the fillStyle to the selected color
}

// Function to save the current canvas state to the undo stack
const saveCanvasState = () => {
    undoStack.push(canvas.toDataURL()); // Save the current state to the undo stack
    redoStack = []; // Clear the redo stack whenever a new action is performed
}

// Function to restore a previous canvas state
const restoreCanvasState = (state) => {
    let img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, 0, 0); // Restore the previous state
    };
}

// Undo last action
const undoLastAction = () => {
    if (undoStack.length > 1) { // Make sure there's something to undo
        redoStack.push(undoStack.pop()); // Move the last state to the redo stack
        const previousState = undoStack[undoStack.length - 1]; // Get the previous state
        restoreCanvasState(previousState); // Restore the previous state
    }
}

// Redo last undone action
const redoLastAction = () => {
    if (redoStack.length > 0) { // Make sure there's something to redo
        const nextState = redoStack.pop(); // Get the last undone state
        undoStack.push(nextState); // Push it back to the undo stack
        restoreCanvasState(nextState); // Restore the canvas to the redone state
    }
}

// Start drawing on canvas
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // Take a snapshot of the canvas
    saveCanvasState(); // Save the canvas state before starting a new drawing
}

// Handle drawing on the canvas
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); // Restore the canvas to the last snapshot
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor; // Set the color based on the selected tool
        ctx.lineTo(e.offsetX, e.offsetY); // Create a line according to the mouse pointer
        ctx.stroke(); // Draw the line
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

// Function to draw a rectangle
const drawRect = (e) => {
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}

// Function to draw a circle
const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Create the circle
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the circle based on fillColor
}

// Function to draw a triangle
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the triangle
}

// Event listeners for tool selection
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// Event listener for size slider
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

// Event listener for color buttons
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Event listener for color picker
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Event listener for clearing the canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    setCanvasBackground(); // Reset the background
    saveCanvasState(); // Save the cleared canvas state
});

// Event listener for saving the image
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; // Save the canvas as an image
    link.href = canvas.toDataURL();
    link.click();
});

// Event listeners for undo and redo
undoBtn.addEventListener("click", undoLastAction);
redoBtn.addEventListener("click", redoLastAction);

// Canvas drawing event listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false); // Stop drawing on mouseup

// Set canvas dimensions and background on window load
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground(); // Set the initial background
    saveCanvasState(); // Save the initial blank state
});
