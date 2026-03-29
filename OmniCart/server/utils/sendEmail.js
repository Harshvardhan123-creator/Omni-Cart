import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    const info = await transporter.sendMail({
        from: '"OmniCart" <noreply@omnicart.com>',
        to: options.to,
        subject: options.subject,
        html: options.text,
    });

    console.log('\n========================================');
    console.log('📧  PASSWORD RESET EMAIL FOR:', options.to);
    console.log('🔗  Click this link to see the reset link:');
    console.log('   ', nodemailer.getTestMessageUrl(info));
    console.log('========================================\n');
};

export default sendEmail;
