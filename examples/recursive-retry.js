const AWS = require('aws-sdk');

const route53 = new AWS.Route53({
    apiVersion: '2013-04-01'
})

const MAX_RETRIES = 4
const RETRY_INTERVAL = 1000

const getChange = (prevAttemptCount, origResolve, origReject) => {

    // Initialize the attempt if it has not been passed in 
    let attempt = prevAttemptCount ? prevAttemptCount : 0
    return new Promise( (resolve, reject) => {
        // The resolve and reject function references will be passed down the call stack.
        resolve = (origResolve) ? origResolve : resolve
        reject = (origReject) ? origReject : reject
        try {
            attempt++
            console.log(`Attempt: ${attempt}`)      
            if (attempt > MAX_RETRIES) {
                console.log('Max retries exceeded')
                reject()
            } else {
                route53.getChange({Id: 'notarealid'}, function(err, data) {
                    if(err){
                        console.log(err)
                        setTimeout( () => {getChange(attempt, origResolve ? origResolve : resolve, origReject ? origReject : reject)}, RETRY_INTERVAL)
                    } else {
                        if(data.ChangeInfo.Status === 'INSYNC') {
                            resolve(data)
                        } else { 
                            setTimeout( () => {getChange(attempt, origResolve ? origResolve : resolve, origReject ? origReject : reject)}, RETRY_INTERVAL )
                        }
                    }
                })
            }
        } catch(error) {
            console.log('error caught, retrying')
            setTimeout( () => { getChange(attempt, origResolve ? origResolve : resolve, origReject ? origReject : reject)  }, RETRY_INTERVAL )
        }
    })
}

module.exports = getChange
