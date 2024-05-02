class PixelateVis {

    constructor(parentElement, imagePath) {
        this.parentElement = parentElement;
        this.imagePath = imagePath;
        this.initVis();
    }

    initVis() {
        let vis = this;

        // Create an image element
        vis.img = new Image();
        vis.img.src = vis.imagePath;

        vis.img.onload = function() {
            // Set up the canvas
            vis.canvas = document.createElement('canvas');
            vis.ctx = vis.canvas.getContext('2d');
            document.getElementById(vis.parentElement).appendChild(vis.canvas);

            // Calculate the desired size for the pixelated image
            const scale = window.innerWidth / vis.img.width * 0.5;  // Reduce the scale factor to make the image smaller
            vis.canvas.width = window.innerWidth * 0.5;  // Set canvas width to 75% of window width
            vis.canvas.height = vis.img.height * scale;  // Adjust height to maintain aspect ratio

            // Draw pixelated image by reducing and then scaling up
            const pixelatedSize = 150;  // Increase pixelation detail for a finer look
            vis.ctx.drawImage(vis.img, 0, 0, pixelatedSize, pixelatedSize);
            vis.ctx.drawImage(vis.canvas, 0, 0, pixelatedSize, pixelatedSize, 0, 0, vis.canvas.width, vis.canvas.height);
        };
    }
}

