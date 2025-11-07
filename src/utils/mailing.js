const nodemailer = require('nodemailer');
const AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
const SES = new AWS.SES({ apiVersion: '2010-12-01' });
const config = require('../utils/config');

exports.SendEmail = async (toEmail, Subject, Message, carbonCopy="") => {
    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: config.mailSMTP,
        port: 465,
        secure: true,
        auth: {
            user: config.fromEmail,
            pass: config.fromPassword
        }
    });

    let mailOptions = {
        from: config.fromEmail,
        to: toEmail,
        subject: Subject,
        text: Message,
        bcc: config.fromEmail,
        cc: carbonCopy
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendDownloadingLinkMail = async (toEmail, Subject, htmlBody, carbonCopy="") => {
    const transporter = nodemailer.createTransport({
        host: config.mailSMTP,
        port: 465,
        secure: true,
        auth: { user: config.fromEmail, pass: config.fromPassword }
    });

    const mailOptions = {
        from: config.fromEmail,
        to: toEmail,
        subject: Subject,
        html: htmlBody,
        bcc: config.fromEmail,
        cc: carbonCopy
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if(!error) return `'Email sent: ${info.response}`;
        else console.log(error);
    });
}

exports.sendSESEmail = async (email, data, subject, sourceemail) => {
    // SES params to be sent
    const sesParams = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Data: data,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: subject,
            }
        },
        Source: sourceemail
    };

    // Send mail
    return await SES.sendEmail(sesParams).promise();
};