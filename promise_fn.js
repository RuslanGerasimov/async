function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function checkIfIterableOfPromises(promises) {
    if (!isIterable(promises)) {
        return {result: false, message: "argument must be iterable"};
    }

    for (let promise of promises) {
        if (!(promise instanceof Promise)) {
            return {result: false, message: "iterable must include only Promises"};
        }
    }
    return {result: true, message: "ok"};
}

Promise._any = function (promises) {
    const {result, message} = checkIfIterableOfPromises(promises);
    if (!result) {
        throw new Error(message);
    }

    return new Promise((resolve, reject) => {
        const rejectErrors = [];
        for (let promise of promises) {
            promise
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    rejectErrors.push(err);
                    if (rejectErrors.length === promises.length) {
                        reject(rejectErrors);
                    }
                });
        }
    })
};

Promise._allSettled = function (promises) {
    const {result, message} = checkIfIterableOfPromises(promises);
    if (!result) {
        throw new Error(message);
    }
    const results = [];
    const sizeProp = Array.isArray(promises) ? "length" : "size";
    const promisesLength = promises[sizeProp];
    return new Promise((resolve) => {
        for (let promise of promises) {
            promise
                .then((data) => {
                    results.push({status: "fulfilled", data: data});
                    if (results.length === promisesLength) {
                        resolve(results);
                    }
                })
                .catch((err) => {
                    results.push({status: "rejected", data: err});
                    if (results.length === promisesLength) {
                        resolve(results);
                    }
                });
        }
    });
};

Promise.prototype._finally = function(cb, args = null) {
    if(typeof cb !== "function") {
        throw new Error("cb must be a function");
    }

    if(args && !Array.isArray(args)) {
        throw new Error("args must be an array or null");
    }

    return this.then((data) => {
        cb.call(null, ...args);
        return Promise.resolve(data);
    }, (err) => {
        cb.call(null, ...args);
        return Promise.reject(err);
    })
};