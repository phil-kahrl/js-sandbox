const listObjects = require('./examples/recursive-s3-list')
console.log('Full listing of the s3 bucket: ')
listObjects().then( (list) => console.log(list))