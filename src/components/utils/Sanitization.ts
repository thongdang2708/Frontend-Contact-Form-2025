import DOMPurify from 'dompurify';

export const inputSanitization = (value : string) : string => {
    
    return DOMPurify.sanitize(value);
}