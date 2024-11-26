import axios from "axios";

const postalCodeValidation = async (postalCode) => {

    try {
    
    await axios.get(import.meta.env.VITE_API_KEY + `/api/v1/postal-code/${postalCode}`);

    return true;

    } catch (e) {
        return false;
    }
};

export default postalCodeValidation;