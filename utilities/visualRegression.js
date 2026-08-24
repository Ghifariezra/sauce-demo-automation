import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import pixelmatch from 'pixelmatch';

export class VisualRegressionHelper {
    constructor() {
        this.baselineDir = path.join(process.cwd(), 'visual-baseline');
        this.currentDir = path.join(process.cwd(), 'visual-current');
        this.diffDir = path.join(process.cwd(), 'visual-diff');
        this._ensureDirs();
    }

    _ensureDirs() {
        [this.baselineDir, this.currentDir, this.diffDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    getBaselinePath(filename) {
        return path.join(this.baselineDir, filename);
    }

    getCurrentPath(filename) {
        return path.join(this.currentDir, filename);
    }

    getDiffPath(filename) {
        return path.join(this.diffDir, filename);
    }

    hasBaseline(filename) {
        return fs.existsSync(this.getBaselinePath(filename));
    }

    saveCurrentScreenshot(sourcePath, filename) {
        const currentPath = this.getCurrentPath(filename);
        fs.copyFileSync(sourcePath, currentPath);
    }

    saveAsBaseline(currentFilename, baselineFilename = currentFilename) {
        const currentPath = this.getCurrentPath(currentFilename);
        const baselinePath = this.getBaselinePath(baselineFilename);

        if (fs.existsSync(currentPath)) {
            fs.copyFileSync(currentPath, baselinePath);
        }
    }

    async compareImages(filename) {
        const baselinePath = this.getBaselinePath(filename);
        const currentPath = this.getCurrentPath(filename);
        const diffPath = this.getDiffPath(filename);

        if (!fs.existsSync(baselinePath)) {
            return { hasBaseline: false, match: null, matchPercentage: 0, message: `No baseline found for ${filename}` };
        }

        if (!fs.existsSync(currentPath)) {
            return { hasBaseline: true, match: false, matchPercentage: 0, message: `Current screenshot not found: ${filename}` };
        }

        try {
            const baselineImage = await loadImage(baselinePath);
            const currentImage = await loadImage(currentPath);

            const width = baselineImage.width;
            const height = baselineImage.height;

            if (currentImage.width !== width || currentImage.height !== height) {
                return {
                    hasBaseline: true,
                    match: false,
                    matchPercentage: 0,
                    message: `Image dimensions differ: baseline ${width}x${height} vs current ${currentImage.width}x${currentImage.height}`
                };
            }

            const canvasBaseline = createCanvas(width, height);
            const canvasCurrent = createCanvas(width, height);
            const canvasDiff = createCanvas(width, height);

            const ctxBaseline = canvasBaseline.getContext('2d');
            const ctxCurrent = canvasCurrent.getContext('2d');
            const ctxDiff = canvasDiff.getContext('2d');

            // Fill diff canvas with white background
            ctxDiff.fillStyle = '#ffffff';
            ctxDiff.fillRect(0, 0, width, height);

            ctxBaseline.drawImage(baselineImage, 0, 0);
            ctxCurrent.drawImage(currentImage, 0, 0);

            const imageDataBaseline = ctxBaseline.getImageData(0, 0, width, height);
            const imageDataCurrent = ctxCurrent.getImageData(0, 0, width, height);
            const imageDataDiff = ctxDiff.getImageData(0, 0, width, height);

            const numDiffPixels = pixelmatch(
                imageDataBaseline.data,
                imageDataCurrent.data,
                imageDataDiff.data,
                width,
                height,
                { threshold: 0.1, diffColor: [255, 0, 0] }
            );

            // Put the diff data back to canvas
            ctxDiff.putImageData(imageDataDiff, 0, 0);

            // Save diff image
            const diffBuffer = canvasDiff.toBuffer('image/png');
            fs.writeFileSync(diffPath, diffBuffer);

            const totalPixels = width * height;
            const matchPercentage = ((totalPixels - numDiffPixels) / totalPixels) * 100;

            return {
                hasBaseline: true,
                match: matchPercentage >= 99,
                matchPercentage: parseFloat(matchPercentage.toFixed(2)),
                diffPath: diffPath,
                message: numDiffPixels === 0 ? 'Images are identical' : `Found ${numDiffPixels} different pixels`
            };
        } catch (error) {
            console.error(`Visual Regression Error: ${error.message}`);
            console.error(error.stack);
            return {
                hasBaseline: true,
                match: false,
                matchPercentage: 0,
                message: `Error comparing images: ${error.message}`
            };
        }
    }
}