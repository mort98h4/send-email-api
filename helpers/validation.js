const requiredFields = ['fullname', 'email', 'message'];
const allowedFields = ['fullname', 'email', 'phone', 'message'];

const fullnameMin = 5;
const fullnameMax = 50;
const messageMin = 2;
const messageMax = 500;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(?:\+45\s?)?(?:\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/;

export function missingFields(fields) {
    const missingFields = [];

    for (let i = 0; i < requiredFields.length; i++) {
        const element = requiredFields[i];

        if (!fields.find(x => x === element)) {
            missingFields.push(element);
        }
    }

    if (missingFields.length > 0) return [missingFields, 'Missing required fields.'];

    return [null, null];
}

export function disallowedFields(fields) {
    const disallowedFields = []

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (!allowedFields.find(x => x === element)) {
            disallowedFields.push(element);
        }
    }

    if (disallowedFields.length > 0) return [disallowedFields, 'Fields not allowed.'];

    return [null, null];
}

export function missingValues(fields, requestBody) {
    const fieldsWithMissingValues = [];

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (requiredFields.find(x => x === element) && (!requestBody[element] || !requestBody[element][0].trim())) {
            fieldsWithMissingValues.push(element);
        }
    }

    if (fieldsWithMissingValues.length > 0) return [fieldsWithMissingValues, {message: 'Missing value(s).', type: 'value_missing'}];

    return [null, null];
}

export function fullname(value) {
    return validateStringLength('fullname', value, fullnameMin, fullnameMax);
}

export function email(value) {
    value = value.trim();

    if (!emailRegex.test(value)) return [null, { message: `'${value}' is not a valid email address.`, type: 'invalid_email' }];

    return [value, null];
}

export function phone(value) {
    value = value.trim();

    if (value === '') return [value, null];
    if (!phoneRegex.test(value)) return [null, { message: `'${value}' is not a valid danish phone number.`, type: 'invalid_phone_number' }];

    return [value, null];
}

export function message(value) {
    return validateStringLength('message', value, messageMin, messageMax);
}

function validateStringLength(field, value, min, max) {
    value = value.trim();

    if (value.length < min) return [null, { message: `'${field}' should have min. ${min} characters.`, type: 'too_small' }];
    if (value.length > max) return [null, { message: `'${field}' should have max. ${max} characters.`, type: 'too_big' }];

    return [value, null]
}