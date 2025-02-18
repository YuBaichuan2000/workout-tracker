import {client, sender} from './mailtrap.js';
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await client.send({
            from : sender,
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email Verification"
        })

        console.log('Email sent successfully');
    } catch (e) {
        console.error('Error sending email:', e);
        throw new Error(`Error sending email: ${e.message}`);
    }
}

export const sendWelcomeEmail = async (email) => {
    const recipient = [{email}];
    
    try {
        await client.send({
            from: sender,
            to: recipient,
            template_uuid: "9d3a26e0-1a15-4729-be38-271995e11760",
            template_variables: {
            },
        });
        console.log('Welcome email sent successfully');
    } catch (e) {
        console.error('Error sending email:', e);
        throw new Error(`Error sending email: ${e.message}`);
    }
}
