#!/usr/bin/env node
// Offline check of the quiz routing rules: node tools/test-route.js
const R = require('../assets/js/funnel-route.js');
let fails = 0;
const t = (a, e) => { const r = R.route(a); const got = r.id + (r.guidedFirst ? '+gf' : ''); console.log((got === e ? 'ok   ' : 'FAIL ') + JSON.stringify(a) + ' -> ' + got); if (got !== e) fails++; };
t({ field: 'pro', support: 'guided', stage: 'deal', eq: 'gt500' }, 'pro');
t({ field: 'investor', support: 'alone' }, 'learn');
t({ field: 'investor', support: 'course' }, 'course');
t({ field: 'investor', support: 'guided', stage: 'deal', eq: '200-300' }, 'meeting');
t({ field: 'investor', support: 'guided', stage: 'direction', eq: 'skip' }, 'meeting');
t({ field: 'investor', support: 'guided', stage: 'bank', eq: '100-200' }, 'course+gf');
t({ field: 'investor', support: 'guided', stage: 'deal', eq: 'lt100' }, 'course+gf');
t({ field: 'investor', support: 'guided', stage: 'curious', eq: 'gt500' }, 'course+gf');
t({}, 'learn');
process.exit(fails ? 1 : 0);
