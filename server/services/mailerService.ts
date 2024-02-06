"use strict";
import nodemailer from "nodemailer";
import smtpGmail from "../tokens/smtpGmail";
import { logsDb } from "../db/db";
import collections from '../db/collections';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtpGmail.email,
        pass: smtpGmail.appPass
    }
});

export const sendMail = (to: string, subject:string, html: string): void => {

  const mailOptions = {
    from: 'hello@lorenpolster.com',
    to: to,
    subject: subject,
    html: html,
  };

	transporter.sendMail(mailOptions, function (err, info) {
		const today = new Date();
		if(err) {
			logsDb.doc(collections.log.docs.mail).set({[today.getTime()]: 'mailer error'})
		} else {
      logsDb.doc(collections.log.docs.mail).set({[`${today.toISOString()}`]: `sent ${info.accepted.join(', ')}`}, {merge: true})
		}
	})
}
