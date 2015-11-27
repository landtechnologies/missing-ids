import {expect} from "chai";
import findMissingIds from "../es6";

describe('can find missing ids', function() {

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

    it('direct hit on max', function(done) {

        var missingNumbers = [5, 10, 12, 29];

        findMissingIds(
            5,
            getNumberFunction(5),
            getNumberFunction(29),
            getListingFunction(missingNumbers),
            function(err, resultingMissingNumbers) {
                expect(err).to.eql(null);
                expect(resultingMissingNumbers).to.eql(missingNumbers);
                done();
            }
        );

    });

    it('non direct hit on max', function(done) {

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


    });
});
