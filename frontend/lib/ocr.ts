// lib/ocr.ts
// OCR utility using Tesseract.js to extract text from images

import Tesseract from 'tesseract.js';

/**
 * Extract text from an image using OCR
 * @param imageSource - Image URL or File object
 * @returns Promise containing extracted text
 */
export async function extractTextFromImage(imageSource: string | File): Promise<string> {
    try {
        const result = await Tesseract.recognize(
            imageSource,
            'eng', // English language
            {
                logger: (m) => {
                    // Optional: log progress for debugging
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );

        // Clean up the extracted text
        let text = result.data.text.trim();

        // Remove extra spaces that break regex patterns
        // Replace multiple spaces with single space
        text = text.replace(/\s+/g, ' ');

        // Fix common OCR errors in email patterns (space before TLD)
        text = text.replace(/@([a-zA-Z0-9.-]+)\s+\.\s*([a-zA-Z]{2,})/g, '@$1.$2');
        text = text.replace(/@([a-zA-Z0-9.-]+)\s+([a-zA-Z]{2,})/g, '@$1$2');

        console.log('OCR extracted text:', text);
        return text;
    } catch (error) {
        console.error('OCR extraction failed:', error);
        return '';
    }
}

/**
 * Quick check if image likely contains text
 * (This is a heuristic, not guaranteed)
 */
export function likelyContainsText(confidence: number): boolean {
    return confidence > 50; // Tesseract confidence threshold
}
