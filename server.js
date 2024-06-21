const fs = require('fs');
const util = require('util');
const path = require('path');
const moment = require('moment');
const logFileName = `log_${moment().format('YYYYMMDD_HHmmss')}.txt`;
const logFilePath = path.join('logs', logFileName);
const logFile = fs.createWriteStream(logFilePath, { flags: 'a' });
const logStdout = process.stdout;

require('dotenv').config();

const tmi = require('tmi.js');
const channelsToJoin = ['enter channels names here']; //where the bot connects
const client = new tmi.Client({
  channels: channelsToJoin,
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
});

let startTime;
const processedMessages = [];

client.connect();
client.on('connected', (address, port) => {
  startTime = new Date();
  console.log(" ", `Bot podłączony do kanałów: ${channelsToJoin.join(', ')}`);
});

console.log = function (channel, message) {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] [${channel || 'undefined'}] ${util.format(message)}\n`);
  logStdout.write(`[${timestamp}] [${channel || 'undefined'}] ${util.format(message)}\n`);
};
let delayInMilliseconds = (Math.floor(Math.random() * 6) + 10);

client.on('message', (channel, tags, message, self) => {
  if (self) {
    console.log(channel, `Wiadomość wysłana przez bota: ${message}`);
    return;
  }

  if (processedMessages.includes(tags.id)) {
    return;
  }

  processedMessages.push(tags.id);
 if (tags.username.toLowerCase() === 'enter your name here') {
    console.log(channel, `Wiadomość wysłana przez Ciebie (enteryourname): ${message}`);
  }
let uuhMessageSent = false;
let amdMessageSent = false;
function sendAmdMessage(channel, messages) { // bot responding to !amd message
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];
    client.say(channel, `!amd ${randomMessage}`);
  }, 15 * 60 * 1000);
}

function sendRandomUuhMessages(channel, messages) { //bot sending a message in random interval
  function sendMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];
    client.say(channel, randomMessage);
  }

  function scheduleNextMessage() {
    const randomInterval = Math.floor(Math.random() * (10 * 60 * 1000 - 2 * 60 * 1000 + 1)) + 2 * 60 * 1000;


    if (!uuhMessageSent) {
      uuhMessageSent = true; 
      setTimeout(() => {
        sendMessage();
        uuhMessageSent = false;
        scheduleNextMessage();
      }, randomInterval);
    }
  }

  scheduleNextMessage();
}

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  if (tags.username.toLowerCase() === 'enter your name here' && message.toLowerCase() === 'komenda1' && !amdMessageSent) {
    const amdMessages = ['WOW', 'sigma', 'ligma', 'mamm0nSigma', 'InformatykzPlocka'];
    sendAmdMessage('zgrywu_', amdMessages);
    amdMessageSent = true;

    const uuhMessages = ['uuh', 'cuh', 'iuh', 'ruh', 'quh', 'fuh', 'euh', 'yuh', 'cathuh', 'juh', 'tuh', 'puh', 'suh', 'buh', 'wuh'];
    sendRandomUuhMessages('zgrywu_', uuhMessages);
  }
});

  if (message.toLowerCase().includes('$ping') && tags.username.toLowerCase() === 'enter your name here') { //bot responding to $ping command
    const currentTime = new Date();
    const uptimeInSeconds = Math.floor((currentTime - startTime) / 1000);
    const fullMessage = `Działam od ${uptimeInSeconds} sekund brawo`;
    client.say(channel, fullMessage);
  }
 if (message.toLowerCase().includes('mapa')) {


    console.log(channel, `Wiadomość o mapie: ${tags.username} | ${message}`);

      client.say(channel, 'Zimowa mapa to mod z tej strony: https://killerskins.com/thekillerey/mods/maps/winter-rift-2023/ aok' );
    
  }
  if (message.toLowerCase().includes('enter your name here') || message.includes('@enter your name here')) { //bot writes down all messages in console where you was pinged in chat
    console.log(channel, `Wiadomość od ${tags.username} z oznaczeniem: ${message}`);
  }
});


function logMessage(channel, username, message, command) { //bot writes down all messages from that to the console
  console.log(channel, `Wiadomość od ${username}: [${command}] ${message}`);
}