import { object, string, number, boolean, date } from 'yup';
import utils from '../../utils';
// all schemas used in the qr page
const schemas = {
    text: object({ text: string().required("Text is required") }),
    url: object({
        url: string()
            .required("URL is required")
            .matches(utils.patterns.url, "Provide a valid URL (eg. https://google.com)")
    }),
    email: object().shape({
        email: string().required("Email is required")
            .email("Email is invalid"),
        cc: string().optional()
            .email("CC is invalid"),
        subject: string().optional(),
        body: string()
            .required("Email body is required")
    }),
    phone: object({
        number: string().required("Phone number is required")
            .matches(utils.patterns.phone, "Phone number is invalid")
    }),
    wifi: object().shape({
        ssid: string().required("Network name required"),
        user: string().optional(),
        pwd: string().optional(),
        encryption: string<"WPA"|"WEP"|"none">().required(),
        hidden: boolean().required()
    })
};

export default schemas;

/* const validationResult = schema
    .validate(values, { abortEarly: false })
    .then(() => {
        alert(JSON.stringify(values, null, 2));
    })
    .catch((err) => {
        console.log(err.errors);
    }); */