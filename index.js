'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = findMissingIds;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

/**
 * Finds holes in sequential series fetched by `listNumsF` between `minNumF`
 * and `maxNumF`, which are all async.
 *
 * Note: Performs chunking of listNumsF of `chunking` amount so as not to
 * overload DB / memory.
 */

function findMissingIds(chunking, minNumF, maxNumF, listNumsF, next) {

    function getChunksFunc(min, max) {

        return function (chunkNext) {

            listNumsF(min, max, function (err, nums) {
                if (err) {
                    return next(err);
                }
                chunkNext(null, _lodash2['default'].difference(_lodash2['default'].range(min, max + 1), nums));
            });
        };
    }

    function getChunksFuncs(min, max) {
        return _lodash2['default'].map(_lodash2['default'].range(min, max + 1, chunking), function (n) {
            return getChunksFunc(n, Math.min(n + chunking - 1, max));
        });
    }

    _async2['default'].parallel([minNumF, maxNumF], function (err, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var min = _ref2[0];
        var max = _ref2[1];

        if (err) {
            return next(err);
        }
        _async2['default'].parallelLimit(getChunksFuncs(min, max), 10, function (err2, result) {
            console.log("R: ", result);
            if (err2) {
                return next(err2);
            }
            next(null, _lodash2['default'].flatten(result));
        });
    });
}

module.exports = exports['default'];

