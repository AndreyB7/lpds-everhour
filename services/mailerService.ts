"use strict";
import nodemailer from "nodemailer";
import smtpGmail from "../tokens/smtpGmail";
import db from "../db/db";
import collections from '../db/collections';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtpGmail.email,
        pass: smtpGmail.appPass
    }
});

export const sendMail = (html: string): void => {

  const mailOptions = {
    from: '0129507@gmail.com',
    to: 'andrey1313@ya.ru',
    subject: 'Mail From Node Server',
    html: html,
  };

	transporter.sendMail(mailOptions, function (err, info) {
		const today = new Date();
		if(err) {
			db.collection(collections.log.name).doc(collections.log.docs.mail).set({[today.getTime()]: 'mailer error'})
		} else {
			db.collection(collections.log.name).doc(collections.log.docs.mail).set({[`${today.toISOString()}`]: `sent ${info.accepted.join(', ')}`}, {merge: true})
		}
	})
}
