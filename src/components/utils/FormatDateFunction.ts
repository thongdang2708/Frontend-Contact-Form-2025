
export const formatDateFunctionHandling = (date : string) : string => {
    const dateOfBirthFormat = new Date(date);
    dateOfBirthFormat.setDate(dateOfBirthFormat.getDate() + 1);
    
    return dateOfBirthFormat.toISOString();
}