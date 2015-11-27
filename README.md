# missing-ids

## Overview

Finds holes in sequential series fetched by `listNumsF` between `minNumF`
and `maxNumF`, which are all async.

Note: Performs chunking of listNumsF of `chunking` amount so as not to
overload DB / memory.

## Installing

    npm install --save missing-ids

## Usage

```javascript

function getListingFunction(missingIds) {
    return function(start, end, next) {
        var r = [];
        for (var i = start; i <= end; i++) {
            if (missingIds.indexOf(i) == -1) {
                r.push(i);
            }
        }
        if (start > 11) {
            r.reverse();
        }
        next(null, r);
    };
}

function getNumberFunction(n) {
    return function(next) {
        next(null, n);
    };
}

var missingNumbers = [5, 10, 12, 29];

findMissingIds(
    5,
    getNumberFunction(5),
    getNumberFunction(32),
    getListingFunction(missingNumbers),
    function(err, resultingMissingNumbers) {
        expect(err).to.eql(null);
        expect(resultingMissingNumbers).to.eql(missingNumbers);
        done();
    }
);

```
