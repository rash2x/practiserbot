const { messages } = require('./messages');
const { bot } = require('./telegram');

const categories = (chatId, data) => {
  bot.sendMessage(chatId, 'Выберите категорию', {
    'reply_markup': {
      'inline_keyboard': [data.map(entry => {
        return {
          text: entry.name,
          callback_data: `category-${entry.id}`
        };
      })]
    }
  });
};

const lessons = (chatId, data) => {
  bot.sendMessage(chatId, 'Выберите урок', {
    'reply_markup': {
      'inline_keyboard': [data.map(entry => {
        return {
          text: entry.name,
          callback_data: `lesson-${entry.id}`
        };
      })]
    }
  });
};

const lesson = (chatId, data) => {
  if (data.hasOwnProperty('photo')) {
    bot.sendVideo(chatId, data.photo);
  }

  if (data.hasOwnProperty('video')) {
    bot.sendVideo(chatId, data.video);
  }

  bot.sendMessage(chatId, data.message, {
    'reply_markup': {
      'inline_keyboard': [
        [{
          text: '✅ я прошел урок',
          callback_data: `lessonAnswer-${data.id}-completed`
        }, {
          text: '↩️ к урокам',
          callback_data: `lessonAnswer-${data.id}-back`
        }]
      ],
      'one_time_keyboard': true
    }
  });

  if (data.hasOwnProperty('file')) {
    bot.sendVideo(chatId, data.file);
  }
};

const welcome = (chatId) => {
  bot.sendMessage(chatId, messages.welcome, {
    'reply_markup': {
      'keyboard': [
        [{ text: 'Contact', request_contact: true }]
      ],
    }
  });
};

const lessonCompleted = (chatId) => {
  bot.sendMessage(chatId, messages.lessonCompleted, {
    'reply_markup': {
      'remove_keyboard': true
    }
  });
};

const admin = (chatId) => {
  bot.sendMessage(chatId, messages.admin, {
    'reply_markup': {
      'keyboard': [
        [{
          text: 'Добавить пользователя',
          callback_data: `addUser`
        }, {
          text: 'Добавить категорию',
          callback_data: `addCategory`
        }, {
          text: 'Добавить урок',
          callback_data: `addLesson`
        }]
      ],
      'one_time_keyboard': true
    }
  });
}

module.exports.send = {
  categories,
  lessons,
  lesson,
  lessonCompleted,
  welcome,
  admin
};
