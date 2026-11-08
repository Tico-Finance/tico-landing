#!/usr/bin/env node
// Creates sign-in details for one course buyer.
//   node tools/course-access.js "Name" [YYYY-MM-DD expiry]
// Prints the code and password to send to the buyer, and the entry to add to the COURSE_USERS env var in Vercel.
// The password is shown once and never stored in the repository.
const crypto = require('crypto');
const { hashPassword } = require('../api/_course-lib');

const name = process.argv[2] || '';
const exp = process.argv[3] || '';
if (exp && !/^\d{4}-\d{2}-\d{2}$/.test(exp)) { console.error('Expiry must look like 2027-12-31'); process.exit(1); }

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no look-alike characters
const pick = (n) => Array.from(crypto.randomBytes(n), (b) => alphabet[b % alphabet.length]).join('');
const code = `TICO-${pick(4)}-${pick(4)}`;
const password = `${pick(4)}${pick(4)}${pick(4)}`.toLowerCase();
const salt = crypto.randomBytes(16).toString('hex');
const entry = { s: salt, h: hashPassword(password, salt) };
if (name) entry.n = name;
if (exp) entry.exp = exp;

console.log('\nSend to the buyer:');
console.log('  Code:     ' + code);
console.log('  Password: ' + password);
console.log('\nAdd this key to the COURSE_USERS JSON in Vercel (then redeploy):');
console.log('  ' + JSON.stringify({ [code]: entry }));
console.log('\nTo revoke access later, delete that key from COURSE_USERS and redeploy.\n');
