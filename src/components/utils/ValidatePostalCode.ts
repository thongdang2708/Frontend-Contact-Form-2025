import axios from "axios";
import getEnvironments from "./GetEnv";

const postalCodeValidation = async (postalCode) => {

    try {
    
    await axios.get(getEnvironments() + `/api/v1/postal-code/${postalCode}`);

    return true;

    } catch (e) {
        return false;
    }
};

export default postalCodeValidation;