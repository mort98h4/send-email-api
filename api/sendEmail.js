import { Resend } from 'resend';
import * as validate from '../helpers/validation.js';
import { htmlTemp } from '../helpers/htmlTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Vercel Serverless Function til at sende en mail via Resend
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid or missing body' });
    }

    try {
        const fields = Object.keys(req.body);
        let invalidFields;
        let inputError;

        [invalidFields, inputError] = validate.missingFields(fields);
        if (inputError) return res.status(400).json({ error: inputError, fields: invalidFields });

        [invalidFields, inputError] = validate.disallowedFields(fields);
        if (inputError) return res.status(400).json({ error: inputError, fields: invalidFields });

        [invalidFields, inputError] = validate.missingValues(fields, req.body);
        if (inputError) return res.status(400).json({ error: inputError, fields: invalidFields });

        
        let { fullname, email, phone, message } = req.body;
        

        [fullname, inputError] = validate.fullname(fullname);
        if (inputError) return res.status(400).json({ error: inputError, fields: ['fullname'] });

        [email, inputError] = validate.email(email);
        if (inputError) return res.status(400).json({ error: inputError, fields: ['email']});

        [phone, inputError] = validate.phone(phone);
        if (inputError) return res.status(400).json({ error: inputError, fields: ['phone'] });

        [message, inputError] = validate.message(message);
        if (inputError) return res.status(400).json({ error: inputError, fields: ['message'] });

        const html = htmlTemp
                    .replaceAll('%FULLNAME%', fullname)
                    .replace('%MESSAGE%', message)
                    .replace('%EMAIL%', email)
                    .replace('%PHONE%', phone);
        
        const { data, error } = await resend.emails.send({
            // from: 'Morten Gross <no-reply@mortengross.dk>',
            from: 'this@will-not-work.com',
            to: ['mortengross_93@hotmail.com'],
            subject:  `New message from ${fullname}`,
            html: html
        });

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error happened from Resend.' });
        }
        
        return res.status(200).json({ message: 'Message was successfully sent!' });
    } catch (error) {
        console.error('Serverfejl:\n', error);
        return res.status(500).json({ error: 'Server error' });
    }
}