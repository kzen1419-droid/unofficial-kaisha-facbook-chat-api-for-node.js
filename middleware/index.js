module.exports = {
  logger: require('./logger'),
  permission: require('./permission'),
  cooldown: require('./cooldown'),
  sanitize: require('./sanitize'),
  CHAIN: ['sanitize','logger','permission','cooldown']
};
