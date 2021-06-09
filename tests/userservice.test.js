// require('mysql2/node_moxdules/iconv-lite').encodingExists('foo')
const UserService = require('../services/UserService')
const service  = new UserService()

test('checks for existing user via username in database',()=>{
    expect(service.usernameexists('admin')).toBe(true)
})
test('checks for existing user via email in database',()=>{
    expect(service.emailexists('checking@gmail.com')).toBe(true)
})
test('checks for existing user via username in database',()=>{
    expect(service.usernameexists('notanadmin')).toBe(false)
})
test('checks for existing user via email in database',()=>{
    expect(service.emailexists('notexist@gmail.com')).toBe(false)
})