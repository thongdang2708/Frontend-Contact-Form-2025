
const dateValidationNotInFuture = (date) => {

    const convertedDate = new Date(date).getTime();

    const todayDate = new Date().getTime();

    if (convertedDate > todayDate || convertedDate < 0) {
        return false;
    }

    return true;
}

export default dateValidationNotInFuture;