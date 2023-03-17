import { object, string, number, boolean, date } from 'yup';
import utils from '../../utils';

type encryption = "WPA" | "WEP" | "none"
type otpType = "totp" | "hotp"

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
        encryption: string<encryption>().required(),
        hidden: boolean().required()
    }),
    // https://github.com/google/google-authenticator/wiki/Key-Uri-Format#examples
    otp: object().shape({
        type: string<otpType>().default("totp").required(),
        label: string().matches(utils.patterns.otp.label, "Valid label is required")
            .required("Label is required"),
        params: object().shape({
            secret: string().required("Secret is required"),
            issuer: string().optional(),
            algorithm: string<"SHA1" | "SHA256" | "SHA512">().default("SHA1").optional(),
            digits: number<6 | 8>().default(6).optional(),
            counter: number().when("type", {
                is: "hotp",
                then: (schema) => schema,
                otherwise: null
            }),
            period: number().when("type", {
                is: "totp",
                then: (schema) => schema,
                otherwise: null
            })
        })
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