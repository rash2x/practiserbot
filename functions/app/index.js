const functions = require('firebase-functions');
const { bot } = require('./telegram');
const { send } = require('./send');
const { api } = require('./api');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  send.welcome(chatId);
});

bot.onText(/\/lessons/, (msg) => {
  const chatId = msg.chat.id;
  api.getCategories().then((data) => send.categories(chatId, data));
});

bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;
  send.admin(chatId);
});

bot.on('callback_query', (callback) => {
  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const data = callback.data.split('-');
  const dataType = data[0];
  const dataId = data[1];
  const dataStatus = data[2];

  bot.deleteMessage(chatId, messageId);

  if (dataType === 'category') {
    api.getCategoryById(dataId).then(category => {
      if (category.children && category.children.length > 0) {
        api.getCategories(dataId).then((data) => send.categories(chatId, data));
      } else {
        api.getLessonsByCategoryId(dataId).then((data) => send.lessons(chatId, data));
      }
    })
  }

  if (dataType === 'lesson') {
    api.getLessonById(dataId).then((data) => send.lesson(chatId, data));
  }

  if (dataType === 'lessonAnswer') {
    if (dataStatus === 'completed') {
      send.lessonCompleted(chatId);
    }

    if (dataStatus === 'back') {
      api.getLessonsByCategoryId(dataId).then((data) =>
        send.lessons(chatId, data)
      );
    }
  }
});

// TODO: add route state management
// TODO: setup channels compatibility
// TODO: roles
// TODO: show completed lessons
// TODO: lesson feedback
// TODO: add users
// TODO: add lesson
// TODO: add category
// TODO: select projects
// TODO: send channel post
// TODO: show lessons stat
// TODO: show users stat
// TODO: show user stat


exports.practiserBot = functions.runWith({
  timeoutSeconds: 540,
}).https.onRequest((request, response) => {
  functions.logger.log('Incoming message', request.body);
  response.send('everything is good');
});
