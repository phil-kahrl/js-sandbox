const listObjects = require('./examples/recursive-s3-list')
const getChange = require('./examples/recursive-retry')

console.log('Full listing of the s3 bucket: ')
listObjects().then( (list) => console.log(list)).catch( () => console.log('listObject failed'))

console.log('Calling getChange function')
getChange().then( () => {console.log('getChange succeeded')} ).catch( () => console.log('getChange failed'))

