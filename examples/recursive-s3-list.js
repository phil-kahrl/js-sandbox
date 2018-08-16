const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

/**
    Recursive method to list all the objects in an S3 bucket which may be paginated.
**/

const listObjects = (  
                        resultList, // This is the list of combined results from all calls.
                        NextContinuationToken // Tells S3 to get the next page of results.
    ) => {
    console.log('list object called, NextContinuationToken = ' + NextContinuationToken)
    return new Promise( (resolve, reject) => {  // This function will return a Promise
        list = resultList ? resultList : [] // initialize an empty result list if one is not passed in.
        const params = {
            Bucket: 'practical-recursion-example', // a publicly accessible bucket for this example
            MaxKeys: 3,  // default is 1000 use 3 here to demonstrate use of recursion for multiple pages
            ContinuationToken: NextContinuationToken 
        };

        const request = s3.listObjectsV2(params);
        request.send((err, data) => {
            if (err) {
                reject(err)
            } else {
                list = list.concat(data.Contents) // combine the master list with the result of this function call.
                if(data.IsTruncated) {
                    // if the data is truncated then call this function recursively
                    listObjects(list, data.NextContinuationToken).then( (list) => {
                        console.log('resolving for NextContinuationToken ' + data.NextContinuationToken)
                        resolve(list)
                    })
                } else {
                    /* 
                        The termination condition for the recursion has been met,
                        (There are no more pages left in the bucket) so we resolve here.
                     */
                    console.log('done, resolving final result')
                    resolve(list)
                }
            }

        })
    })

}

module.exports = listObjects;
