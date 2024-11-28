// Get the canvas element and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');  // Correct capitalization

// Set canvas properties
ctx.fillStyle = 'white';  // Background color
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white
ctx.strokeStyle = 'black'; // Color of the line
ctx.lineWidth = 5;         // Thickness of the line
ctx.lineCap = 'round';     // Line ends will be rounded

let drawing = false;  // Flag to check if we are drawing

// Start drawing when mouse button is pressed
canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();  // Start a new path
    ctx.moveTo(event.offsetX, event.offsetY);  // Move to the mouse's position
});

// Continue drawing as the mouse moves
canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        ctx.lineTo(event.offsetX, event.offsetY);  // Draw a line to the mouse's new position
        ctx.stroke();  // Apply the stroke (draw the line)
    }
});

// Stop drawing when the mouse button is released
canvas.addEventListener('mouseup', () => {
    drawing = false;  // Stop drawing
    ctx.closePath();  // Close the path
});

// Also stop drawing if the mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
    drawing = false;  // Stop drawing if mouse leaves the canvas
});

// Clear the canvas when the clear button is clicked
document.getElementById('clear').addEventListener('click', () => {
    location.reload();
});

// Send the canvas image to the server for prediction
document.getElementById('predict').addEventListener('click', () => {
    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append('image', blob);

        fetch('/predict', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `Predicted Digit: ${data.digit}`;
        })
        .catch(err => console.error('Error:', err));
    }, 'image/png');
});

