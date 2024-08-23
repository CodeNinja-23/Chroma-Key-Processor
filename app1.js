
const video = document.getElementById('video');
const backgroundVideo = document.getElementById('backgroundVideo');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size equal to the video size
video.addEventListener('loadeddata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

backgroundVideo.addEventListener('loadeddata', () => {
    if (video.readyState >= 2) {
        startProcessing();
    }
});

// Function to process each video frame
function processFrame() {
    // Draw the background video onto the canvas
    ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);

    // Draw the video with the green screen onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data from the canvas
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const length = frame.data.length;

    // Chroma key logic: remove the green background
    for (let i = 0; i < length; i += 4) {
        const r = frame.data[i];     // Red
        const g = frame.data[i + 1]; // Green
        const b = frame.data[i + 2]; // Blue

        // Define the green color range to remove
        if (g > 100 && r < 100 && b < 100) {
            frame.data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }

    // Put the processed image data back to the canvas
    ctx.putImageData(frame, 0, 0);

    // Call the function again on the next animation frame
    requestAnimationFrame(processFrame);
}

// Start processing once both videos are playing
function startProcessing() {
    video.play();
    backgroundVideo.play();
    processFrame();
}

video.addEventListener('play', () => {
    if (backgroundVideo.readyState >= 2) {
        startProcessing();
    }
});

backgroundVideo.addEventListener('play', () => {
    if (video.readyState >= 2) {
        startProcessing();
    }
});
