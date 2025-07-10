import { Resend } from 'resend';
import * as validate from '../helpers/validation.js';
import { htmlTemp } from '../helpers/htmlTemplate.js';
import withCors from '../middleware/corsHandler.js';
import { IncomingForm } from 'formidable';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: {
    bodyParser: false, // nødvendig for formidable
  },
};

/**
 * Vercel Serverless Function til at sende en mail via Resend
 */
async function handler(req, res) {
    const apiKeyError = validate.apiKey(req.headers['x-api-key']);
    if (apiKeyError) {
        return res.status(apiKeyError.status).json({ error: apiKeyError.message });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
        return res.status(415).json({ error: 'Unsupported Media Type. Only multipart/form-data is allowed.' });
    }

    const form = new IncomingForm();

    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable fejl:\n', err);
                return res.status(500).json({ error: 'An error occurred while parsing form data.' });
            }

            const fieldKeys = Object.keys(fields);

            let invalidFields;
            let inputError;

            [invalidFields, inputError] = validate.missingFields(fieldKeys);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: invalidFields });

            [invalidFields, inputError] = validate.disallowedFields(fieldKeys);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: invalidFields });

            [invalidFields, inputError] = validate.missingValues(fieldKeys, fields);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: invalidFields });

            let { fullname, email, phone, message } = fields;

            [fullname, inputError] = validate.fullname(fullname[0]);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: ['fullname'] });

            [email, inputError] = validate.email(email[0]);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: ['email']});

            [phone, inputError] = validate.phone(phone[0]);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: ['phone'] });

            [message, inputError] = validate.message(message[0]);
            if (inputError) return res.status(400).json({ inputError: inputError, fields: ['message'] });

            const html = htmlTemp
                        .replaceAll('%FULLNAME%', fullname)
                        .replace('%MESSAGE%', message)
                        .replace('%EMAIL%', email)
                        .replace('%PHONE%', phone);
            
            const { data, error } = await resend.emails.send({
                from: 'Morten Gross <no-reply@mortengross.dk>',
                to: ['mortengross_93@hotmail.com'],
                subject:  `New message from ${fullname}`,
                html: html
            });

            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while sending email.' });
            }

            return res.status(200).json({ message: 'Message was successfully sent!' });
        });
    } catch (error) {
        console.error('Serverfejl:\n', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

export default withCors(handler);