/**@format */
const Event = require('../../Handlers/Event.js')
module.exports = new Event("ready", (client) => {
    // bot online in console
    console.clear();
  console.log("ready")

    const arrayOfStatus = [
      `${client.users.cache.size} people`,
  ];
  let index = 0;
  setInterval(() => {
      if(index === arrayOfStatus.length) index = 0;
      const status = arrayOfStatus[index];
      client.user.setStatus('online');
      client.user.setActivity(status, { type: "WATCHING" })
      index++;
  }, 15000)
})
