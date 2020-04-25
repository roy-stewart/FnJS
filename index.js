/**
 * A function that takes a value and determines a true of false status for the value
 * @callback Predicate
 * @template T the type of value
 * @param {T} value the value to be evaluated
 * @returns {boolean} whether or not the provided value satisfies the predicate function
 */

/**
 * @callback Mapper
 * @template T, U
 * @param {T} value - the input value to be mapped
 * @returns {U} the result of the mapping
 */

/**
 * A function that takes an iterable and produces a Generator that that returns values after an operation has been applied the values in the source iterable
 * @callback Operation
 * @template T, U
 * @param {Iterable<T>} source - the source iterable to be operated on
 * @return {Generator<U>} the values from the source after the operation has been applied
 */

/**
 * @function
 * @template T
 * @param {Predicate<T>} predicate determines if a value from the source iterable will be in the output Generator
 * @return {Operation<T, T>} a new filter operation that uses predicate
 */
exports.filter = predicate => function*(source) {
    for (const value of source) {
        if (predicate(value)) {
            yield value;
        }
    }
}

/**
 * @function
 * @template T, U
 * @param {Mapper<T, U>} mapper
 * @return {Operation<T, U>} a new map operation that uses mapper
 */
exports.map = operation => function*(source) {
    for (const value of source) {
        yield operation(value);
    }
}

exports.flat = function*(source) {
    for (const value of source) {
        yield value;
    }
}

exports.take = count => function*(source) {
    for (const value of source) {
        if (count > 0) {
            yield value;
        } else {
            break;
        }
        count--;
    }
}

exports.drop = count => function*(source) {
    for (const value of source) {
        if (count > 0) {
            continue;
        } else {
            yield value;
        }
    }
}

exports.takeWhile = predicate => function*(source) {
    for (const value of source) {
        if (predicate(value)) {
            yield value;
        } else {
            break;
        }
    }
}

exports.distinct = function*(source) {
    let previousValues = new Set();
    for (const value of source) {
        if (!previousValues.has(value)) {
            previousValues.add(value);
            yield value;
        }
    }
}

exports.concat = function*(...sources) {
    for (const source of sources) {
        yield *source;
    }
}

exports.sort = comparator => function*(source) {
    let remainingValues = Array.from(source);
    while (remainingValues.length > 0) {
        for (let index = remainingValues.length; index > 0; index--) {
            let currentValue = remainingValues[index];
            let nextIndex = index - 1;
            let nextValue = remainingValues[nextIndex];
            if (comparator(currentValue, nextValue) < 0) {
                remainingValues[index] = nextValue;
                remainingValues[nextIndex] = currentValue;
            }
        }
        yield remainingValues.shift();
    }
}

// comparator = (x, y) => x - y
// negative = x < y
// zero = x == y
// positive x > y

exports.max = comparator => source => {
    let isFirstValue = true;
    let currentMax;
    for (const value of source) {
        if (isFirstValue) {
            currentMax = value;
            isFirstValue = false;
        } else if (comparator(currentMax, value) < 0) {
            currentMax = value;
        }
    }
    return currentMax;
}

exports.min = comparator => {
    const inverseComparator = x => 0 - comparator(x);
    return exports.max(inverseComparator);
}

exports.count = function(source) {
    let count = 0;
    for (const value of source) {
        count++;
    }
    return count;
}

exports.find = predicate => source => {
    for (const value of source) {
        if (predicate(value)) {
            return value;
        }
    }
    return null;
}

exports.reduce = aggregator => initial => source => {
    let aggregate = initial;
    for (const value of source) {
        aggregate = aggregator(aggregate, value);
    }
    return aggregate;
}

exports.some = predicate => source => {
    for (const value of source) {
        if (predicate(value)) {
            return true;
        }
    }
    return false;
}

exports.none = predicate => source => {
    for (const value of source) {
        if (predicate(value)) {
            return false;
        }
    }
    return true;
}

exports.sum = (values) => reduce((x, y) => x + y)(0)(values);

exports.every = predicate => source => {
    for (const value of source) {
        if (!predicate(value)) {
            return false;
        }
    }
    return true;
}

exports.range = function*(start, end, step) {
    for (let index = start; index < end; index += step) {
        yield index;
    }
}

function isDivisibleBy(value, divisor) {
    return value % divisor === 0;
}

exports.primes = function*() {
    const previousPrimes = [];
    for (let num = 0; ; num++) {
        if (!previousPrimes.some(prime => isDivisibleBy(num, prime))) {
            previousPrimes.push(num);
            yield num;
        }
    }
}
