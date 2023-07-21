const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_RECORDS = require('./date/records.json')
const SEED_USERS = require('./date/users.json')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  for (const [index, SEED_USER] of SEED_USERS.entries()) {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash =>
        User.create({
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: hash
        })
      )
      .then(user => {
        const userId = user._id

        const record = SEED_USER.recordId.map(index => {
          SEED_RECORDS[index].userId = userId
          return SEED_RECORDS[index]
        })
        console.log(`第${index + 1}筆使用者資料建立完成`)
        return Record.create(record)
      })
      .then(() => {
        console.log('done')
        process.exit()
      })
  }
})
