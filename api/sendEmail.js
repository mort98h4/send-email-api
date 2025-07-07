import { Resend } from 'resend';
import * as validate from '../helpers/validation.js';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Vercel Serverless Function til at sende en mail via Resend
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const fields = Object.keys(req.body);
        let invalidFields;
        let error;

        [invalidFields, error] = validate.missingFields(fields);
        if (error) return res.status(400).json({ error: error, fields: invalidFields });

        [invalidFields, error] = validate.disallowedFields(fields);
        if (error) return res.status(400).json({ error: error, fields: invalidFields });

        [invalidFields, error] = validate.missingValues(fields, req.body);
        if (error) return res.status(400).json({ error: error, fields: invalidFields });

        
        let { fullname, email, phone, message } = req.body;
        

        [fullname, error] = validate.fullname(fullname);
        if (error) return res.status(400).json({ error: error, fields: ['fullname'] });

        [email, error] = validate.email(email);
        if (error) return res.status(400).json({ error: error, fields: ['email']});

        [phone, error] = validate.phone(phone);
        if (error) return res.status(400).json({ error: error, fields: ['phone'] });

        [message, error] = validate.message(message);
        if (error) return res.status(400).json({ error: error, fields: ['message'] });

        let data = {};
        data.fullname = fullname;
        data.email = email;
        data.phone = phone;
        data.message = message;
        
        return res.status(200).json({ message: 'Message was successfully sent!', data: data });
    } catch (error) {
        console.error('Serverfejl:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}