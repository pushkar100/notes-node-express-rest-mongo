const assert = require('assert')
const User = require('../src/user')

describe('Validating records', () => {
  // We do not need a "beforeEach"
  // since the purpose is to test creation
  // we do not need to have a pre-created record

  it('requires a user name', () => {
    const user = new User({ name: undefined })
    const validationResult = user.validateSync()
    const { message } = validationResult.errors.name

    assert(message === 'Name is required.')
  })

  it('requires a user name with more than 2 characters', () => {
    const user = new User({ name: 'Al' })
    const validationResult = user.validateSync()
    const { message } = validationResult.errors.name

    assert(message === 'Name must be greater than 2 characters.')
  })

  it('disallows invalid records from being saved', done => {
    const user = new User({ name: 'Al' })
    user.save()
      .catch(validationResult => {
        const { message } = validationResult.errors.name
        assert(message === 'Name must be greater than 2 characters.')
        done()
      })
  })
})