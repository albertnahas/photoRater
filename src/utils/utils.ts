export const tags: string[] = [
    'amiable',
    'assertive',
    'attractive',
    'beautiful',
    'calm',
    'clean',
    'comfortable',
    'confident',
    'engaged',
    'exuberant',
    'forthcoming',
    'friendly',
    'gentle',
    'genuine',
    'happy',
    'honest',
    'humble',
    'intelligent',
    'interested',
    'interesting',
    'joyful',
    'likable',
    'neat',
    'open',
    'peaceful',
    'respectful',
    'self-assured',
    'smiling',
    'stylish',
    'tidy',
    'trusting',
    'trustworthy',
    'upbeat',
    'well-dressed',
    'agitated',
    'arrogant',
    'closed',
    'dirty',
    'disheveled',
    'dishonest',
    'disingenuous',
    'disinterested',
    'disrespectful',
    'frowning',
    'hateful',
    'irritated',
    'mean',
    'messy',
    'miserable',
    'removed',
    'rude',
    'sneaky',
    'snotty',
    'standoffish',
    'stuck-up',
    'suspicious',
    'ugly',
    'unattractive',
    'uncomfortable',
    'unhappy'
];

export const showGenderLabel = (gender?: string) => {
    if (gender === 'male') return 'males';
    if (gender === 'female') return 'females';
    return 'males and females';
};

export const generateUUID = () => {
    let d = new Date().getTime(); // Timestamp
    let d2 =
        (typeof performance !== 'undefined' &&
            performance.now &&
            performance.now() * 1000) ||
        0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16; // random number between 0 and 16
        if (d > 0) {
            // Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            // Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

export const getResizedName = (fileName: string, dimensions = '600x600') => {
    const extIndex = fileName.lastIndexOf('.');
    const ext = fileName.substring(extIndex);
    return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
};
