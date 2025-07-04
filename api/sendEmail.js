import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    console.log('Hello world!');
    return res.status(200).json({ message: `Hello World!` });
}