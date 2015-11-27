import _ from 'lodash';
import async from 'async';

/**
 * Finds holes in sequential series fetched by `listNumsF` between `minNumF`
 * and `maxNumF`, which are all async.
 *
 * Note: Performs chunking of listNumsF of `chunking` amount so as not to
 * overload DB / memory.
 */
export default function findMissingIds(chunking, minNumF, maxNumF, listNumsF, next) {

    function getChunksFunc(min, max) {

        return function(chunkNext) {

            listNumsF(min, max, function(err, nums) {
                if (err) { return next(err); }
                chunkNext(null, _.difference(_.range(min, max + 1), nums));
            });

        };
    }

    function getChunksFuncs(min, max) {
        return _.map(
            _.range(min, max + 1, chunking),
            function(n) {
                return getChunksFunc(
                    n,
                    Math.min(n + chunking - 1, max)
                );
            }
        );
    }

    async.parallel([minNumF, maxNumF], function(err, [min, max]) {
        if (err) { return next(err); }
        async.series(getChunksFuncs(min, max), function(err2, result) {
            if (err2) { return next(err2); }
            next(null, _.flatten(result));
        });
    });

}
