import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { DegreeOfCare, DoesThePersonHaveDifficultyRememberingThingsOrIsConfused, Gender, HowIndependentIsThePersonConcernedInEverydayLife, SupportReceived, WhatIsTheMainReasonForYourRequest } from '../../objects/FieldObjects';
import CommonRadioGroup from '../common-elements/CommonRadioGroup';
import CommonResponsiveDatePicker from '../common-elements/CommonResponsiveDatePicker';
import CommonCheckBoxGroup from '../common-elements/CommonCheckBoxGroup';
import CommonCheckBox from '../common-elements/CommonCheckBox';
import { Verify } from 'react-puzzle-captcha';
import 'react-puzzle-captcha/dist/react-puzzle-captcha.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { formatDateFunctionHandling } from '../utils/FormatDateFunction';
import { inputSanitization } from '../utils/Sanitization';
import postalCodeValidation from '../utils/ValidatePostalCode';
import axios from 'axios';
import getEnvironments from '../utils/GetEnv';

function BodyForm({ setIsSubmittedSuccessfully, organizationId }) {

    const [defaultValues, setDefaultValues] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: null,
        degreeOfCare: "",
        postalCode: "",
        telephoneNumberOfInquirer: "",
        inquirerEmailAddress: "",
        howIndependentIsThePersonConcernedInEverydayLife: "",
        doesThePersonHaveDifficultyRememberingThingsOrIsConfused: "",
        whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: [],
        whatIsTheMainReasonForYourRequest: "",
        iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: false,
    });

    const [visible, setVisible] = useState(false);
    const [dataForSubmitted, setDataForSubmitted] = useState({});

    // Set validation schema for validation
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .max(100, "First name is too long")
            .required("First name is required"),
        lastName: Yup.string()
            .max(100, "Last name is too long")
            .required("Last name is required"),
        gender: Yup.string().required("Gender is required"),
        dateOfBirth: Yup.date().required("Date of birth is required").typeError("Invalid date format"),
        degreeOfCare: Yup.string().required("Degree of care is required"),
        postalCode: Yup.string()
            .max(5, "Postal code is too long")
            .required("Postal code is required")
            .test(
                "test-postal-code",
                "Postal code is invalid",
                async function (postalCode) {
                    return await postalCodeValidation(postalCode);
                }
            ),
        telephoneNumberOfInquirer: Yup.string()
            .max(50, "Telephone number is too long")
            .required("Telephone number is required"),
        inquirerEmailAddress: Yup.string()
            .max(100, "Email is too long")
            .email("Email is in incorrect format")
            .required("Email is required"),
        howIndependentIsThePersonConcernedInEverydayLife: Yup.string().required(
            "One option must be chonse"
        ),
        doesThePersonHaveDifficultyRememberingThingsOrIsConfused: Yup.string().required(
            "One option must be chosen"
        ),
        whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: Yup.array().min(
            1,
            "One option must be chosen"
        ),
        whatIsTheMainReasonForYourRequest: Yup.string().required(
            "One option must be chosen"
        ),
        iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: Yup.boolean().oneOf(
            [true],
            "You must consent to proceed with the contact form"
        ),
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
      } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
        mode: "onChange",
        shouldFocusError: false
      });

    // Set effect for automated scrolls
    useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = document.querySelector(`[name=${Object.keys(errors)[0]}]`);
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    }, [errors]);

    //Handle submit after submitting form
    
    const onSubmit = (data) => {
        setDataForSubmitted(data);
        setVisible(true);
    };

    //Handle submit after captcha verification is done

    const finalSubmit = async () => {

        const dataForSubmittingToBackend = {
            firstName: inputSanitization(dataForSubmitted?.firstName),
            lastName: inputSanitization(dataForSubmitted?.lastName),
            gender: inputSanitization(dataForSubmitted?.gender),
            dateOfBirth: formatDateFunctionHandling(inputSanitization(dataForSubmitted?.dateOfBirth)),
            degreeOfCare: inputSanitization(dataForSubmitted?.degreeOfCare),
            postalCode: inputSanitization(dataForSubmitted?.postalCode),
            telephoneNumberOfInquirer: inputSanitization(dataForSubmitted?.telephoneNumberOfInquirer),
            inquirerEmailAddress: inputSanitization(dataForSubmitted?.inquirerEmailAddress),
            howIndependentIsThePersonConcernedInEverydayLife: inputSanitization(dataForSubmitted?.howIndependentIsThePersonConcernedInEverydayLife),
            doesThePersonHaveDifficultyRememberingThingsOrIsConfused: inputSanitization(dataForSubmitted?.doesThePersonHaveDifficultyRememberingThingsOrIsConfused),
            whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: dataForSubmitted?.whatKindOfSupportDoesThePersonConcernedCurrentlyReceive,
            whatIsTheMainReasonForYourRequest: inputSanitization(dataForSubmitted?.whatIsTheMainReasonForYourRequest),
            iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: dataForSubmitted?.iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation,
            captchaVerificationCompleted: true,
            organizationId: organizationId
        };

        try {

            const response = await axios.post(getEnvironments() + "/api/v1/case/saveCase", dataForSubmittingToBackend);

            const data = response?.data;
    
            setIsSubmittedSuccessfully(true);   
            toast.success(data?.message);
    
            reset();
            setDefaultValues({
                firstName: "",
                lastName: "",
                gender: "",
                dateOfBirth: "",
                degreeOfCare: "",
                postalCode: "",
                telephoneNumberOfInquirer: "",
                inquirerEmailAddress: "",
                howIndependentIsThePersonConcernedInEverydayLife: "",
                doesThePersonHaveDifficultyRememberingThingsOrIsConfused: "",
                whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: [],
                whatIsTheMainReasonForYourRequest: "",
                iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: false
            });

        } catch(error) {
            const errorMessage = error?.response?.data?.message;
            toast.error(errorMessage);
        }
      
    }

    return (
    <Box className="my-5">
        
        <form onSubmit={handleSubmit(onSubmit)} >
        
        <Box className="w-full mb-10">
         <TextField
          error={errors?.firstName || false}
          id="first-name"
          label="First Name"
          defaultValue={defaultValues?.firstName}
          helperText={errors?.firstName?.message}
          {...register("firstName")}
          className="w-full lg:w-2/4"
        />
        </Box>
        
        <Box className="w-full mb-10">
        <TextField
          error={errors?.lastName || false}
          id="last-name"
          label="Last Name"
          defaultValue={defaultValues?.lastName}
          helperText={errors?.lastName?.message}
          {...register("lastName")}
          className="w-full lg:w-2/4"
        />
        </Box>

        <Box className="w-full mb-10">
            <CommonRadioGroup id="gender" label="gender" name="gender" value={defaultValues?.gender} setValue={setValue} fieldName="gender" objects={Gender} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full lg:w-2/4 mb-10">
            <CommonResponsiveDatePicker id="date-of-birth" value={defaultValues?.dateOfBirth} label="Date of birth" errors={errors} fieldName="dateOfBirth" setValue={setValue} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
            <CommonRadioGroup id="degree-of-care" label="Degree of care" name="degreeOfCare" value={defaultValues?.degreeOfCare} setValue={setValue} fieldName="degreeOfCare" objects={DegreeOfCare} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
        <TextField
          error={errors?.postalCode || false}
          id="postal-code"
          name='postalCode'
          label="Postal Code"
          defaultValue={defaultValues?.postalCode}
          helperText={errors?.postalCode?.message}
          {...register("postalCode")}
          className="w-full lg:w-2/4"
        />
        </Box>

        <Box className="w-full mb-10">
        <TextField
          error={errors?.telephoneNumberOfInquirer || false}
          id="telephone-number-of-inquirer"
          label="Telephone Number Of Inquirer"
          defaultValue={defaultValues?.telephoneNumberOfInquirer}
          helperText={errors?.telephoneNumberOfInquirer?.message}
          {...register("telephoneNumberOfInquirer")}
          className="w-full lg:w-2/4"
        />
        </Box>

        <Box className="w-full mb-10">
        <TextField
          error={errors?.inquirerEmailAddress || false}
          id="inquirer-email-address"
          label="Inquirer Email Address"
          defaultValue={defaultValues?.inquirerEmailAddress}
          helperText={errors?.inquirerEmailAddress?.message}
          {...register("inquirerEmailAddress")}
          className="w-full lg:w-2/4"
        />
        </Box>

        <Box className="w-full mb-10">
            <CommonRadioGroup id="how-independent-is-the-person-concerned-in-everyday-life" label="How independent is the person concerned in everyday life?" name="howIndependentIsThePersonConcernedInEverydayLife" value={defaultValues?.howIndependentIsThePersonConcernedInEverydayLife} setValue={setValue} fieldName="howIndependentIsThePersonConcernedInEverydayLife" objects={HowIndependentIsThePersonConcernedInEverydayLife} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
            <CommonRadioGroup id="does-the-person-have-difficulty-remembering-things-or-is-confused" label="Does the person have difficulty remembering things or is confused?" name="doesThePersonHaveDifficultyRememberingThingsOrIsConfused" value={defaultValues?.doesThePersonHaveDifficultyRememberingThingsOrIsConfused} setValue={setValue} fieldName="doesThePersonHaveDifficultyRememberingThingsOrIsConfused" objects={DoesThePersonHaveDifficultyRememberingThingsOrIsConfused} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
            <CommonCheckBoxGroup id="what-kind-of-support-does-the-person-concerned-currently-receive" label="What kind of support does the person concerned currently receive?" name="whatKindOfSupportDoesThePersonConcernedCurrentlyReceive" value={defaultValues?.whatKindOfSupportDoesThePersonConcernedCurrentlyReceive} setValue={setValue} fieldName={"whatKindOfSupportDoesThePersonConcernedCurrentlyReceive"} objects={SupportReceived} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
            <CommonRadioGroup id="what-is-the-main-reason-for-your-request" label="What is the main reason for your request?" name="whatIsTheMainReasonForYourRequest" value={defaultValues?.whatIsTheMainReasonForYourRequest} setValue={setValue} fieldName="whatIsTheMainReasonForYourRequest" objects={WhatIsTheMainReasonForYourRequest} errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="w-full mb-10">
            <CommonCheckBox id="date-consent-notice" label="I have read the data protection consent and agree with the terms of use" name="iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation" value={defaultValues?.iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation} setValue={setValue} fieldName="iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation" errors={errors} setDefaultValues={setDefaultValues} trigger={trigger}/>
        </Box>

        <Box className="flex content-center justify-center">
        <Button variant='contained' type='submit' className="hover:bg-yellow-100" size='large'> Submit </Button>
        </Box>
        </form>

    <Dialog
        onClose={() => setVisible(false)}
        aria-labelledby="customized-dialog-title"
        open={visible}
    >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Captcha Verification!
        </DialogTitle>
        
        <DialogContent>
        <Verify
            width={320}
            height={160}
            visible={visible}
            onSuccess={async () => {
                setVisible(false);
                await finalSubmit();
            }
            }
            onFail={() => {
                setVisible(false);
                toast.error("Verification is failed! Please try again!");
            }}
            onRefresh={() => {
                toast.warning("Verification is refreshed with a new option!");
            }}
        />
        </DialogContent>
    </Dialog>
    </Box>
  )
}

export default BodyForm;