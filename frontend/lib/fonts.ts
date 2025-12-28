export const GOOGLE_FONTS = [
    { name: 'Roboto', family: 'Roboto' },
    { name: 'Open Sans', family: 'Open Sans' },
    { name: 'Lato', family: 'Lato' },
    { name: 'Montserrat', family: 'Montserrat' },
    { name: 'Oswald', family: 'Oswald' },
    { name: 'Poppins', family: 'Poppins' },
    { name: 'Playfair Display', family: 'Playfair Display' },
    { name: 'Merriweather', family: 'Merriweather' },
    { name: 'Nunito', family: 'Nunito' },
    { name: 'Raleway', family: 'Raleway' },
    { name: 'Impact', family: 'Impact' }, // System font fallback
    { name: 'Arial Black', family: 'Arial Black' }, // System font fallback
];

export const loadGoogleFont = (fontFamily: string) => {
    if (!fontFamily) return;
    // Check if it's a system font we don't need to load
    const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Impact', 'Arial Black', 'Verdana'];
    if (systemFonts.some(f => fontFamily.includes(f))) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};
