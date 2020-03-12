if(!window.hasOwnProperty("Homework")) {
    throw new Error("You need to include Homework lib first");
}

const {
    AsyncArray,
    add,
    mod,
    equal,
} = Homework;

/**
 * Основаная функция (сложение нечетных чисел в массиве)
 * @param {array|AsyncArray} arData
 * @param {function}cb
 */
function getSumOddNumbersInArray(arData, cb) {
    if (!(arData instanceof AsyncArray)) {
        arData = new AsyncArray(arData);
    }
    recursiveSum(arData, 0, false, cb);
}


function checkIfEven(a, cb) {
    mod(a, 2, (result) => {
        equal(result, 0, (isEven) => {
            cb(isEven)
        });
    });
}

/**
 *
 * @param {number} result - промежуточный результат (на четность не проверяется)
 * @param {number} b - слагамеое (проверяется на четность)
 * @param {boolean} isEvenMode (true - четное складывается, нечетное - нет; false - наоборот)
 * @param {function} cb
 */
function addOddEvenToResult(result, b, isEvenMode, cb) {
    let bIsEven = false;
    checkIfEven(b, (isEven) => {
        bIsEven = isEven;
        const bNeedToAdd = isEvenMode ? bIsEven : !bIsEven;

        if (bNeedToAdd) {
            add(result, b, cb);
        } else {
            cb(result);
        }
    });
}

/**
 *
 * @param {AsyncArray} arData
 * @param {number} result
 * @param {boolean} $isEven
 * @param {function} cb
 */
function recursiveSum(arData, result, $isEven, cb) {
    arData.pop((item) => {
        const itemType = typeof item;
        //Обработка завершения массива (массив закончился, если вернулся undefined и длина массива - 0)
        if (!item) {
            equal(itemType, "undefined", () => {
                arData.length((length) => {
                    if (!length) {
                        cb(result);
                    } else {
                        recursiveSum(arData, result, $isEven, cb);
                    }
                })
            });
        } else {
            equal(itemType, "number", (itemIsNumber) => {
                if (itemIsNumber) {
                    addOddEvenToResult(result, item, $isEven,(result) => {
                        recursiveSum(arData, result, $isEven, cb);
                    });
                } else {
                    recursiveSum(arData, result, $isEven, cb);
                }
            });
        }
    });
}