export const tags:string[] = ['amiable', 'assertive', 'attractive', 'beautiful', 'calm', 'clean', 'comfortable', 'confident', 'engaged', 'exuberant', 'forthcoming', 'friendly', 'gentle', 'genuine', 'happy', 'honest', 'humble', 'intelligent', 'interested', 'interesting', 'joyful', 'likable', 'neat', 'open', 'peaceful', 'respectful', 'self-assured', 'smiling', 'stylish', 'tidy', 'trusting', 'trustworthy', 'upbeat', 'well-dressed', 'agitated', 'arrogant', 'closed', 'dirty', 'disheveled', 'dishonest', 'disingenuous', 'disinterested', 'disrespectful', 'frowning', 'hateful', 'irritated', 'mean', 'messy', 'miserable', 'removed', 'rude', 'sneaky', 'snotty', 'standoffish', 'stuck-up', 'suspicious', 'ugly', 'unattractive', 'uncomfortable', 'unhappy']

export const showGenderLabel = (gender: string) => {
    if(gender === 'male') return 'males'
    if(gender === 'female') return 'females'
    return 'males and females'
}