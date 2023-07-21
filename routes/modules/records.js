const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// create
router.get('/add', (req, res) => {
  res.render('addRecord')
})

router.post('/add', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, category } = req.body

  return Record.create({ name, date, amount, category, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// edit
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id

  return Record.findOne({ _id })
    .lean()
    .then(record => {
      const date = record.date.toISOString().slice(0, 10)
      record.date = date

      res.render('edit', { record })
    })
    .catch(err => console.log(err))
})

router.put('/:id/edit', (req, res) => {
  const _id = req.params.id
  const updateRecord = req.body

  return Record.findByIdAndUpdate(_id, updateRecord)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// delete
router.delete('/:id/delete', (req, res) => {
  const _id = req.params.id

  return Record.findByIdAndDelete(_id)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router
