function checkIfEven(a, cb) {
    Homework.mod(a, 2, (result) => {
        Homework.equal(result, 0, (isEven) => {
            cb(isEven)
        });
    });
}

function addOddEvenToResult(result, b, isEvenMode, cb) {
    let bIsEven = false;
    checkIfEven(b, (isEven) => {
        bIsEven = isEven;
        const bNeedToAdd = isEvenMode ? bIsEven : !bIsEven;

        if (bNeedToAdd) {
            Homework.add(result, b, cb);
        } else {
            cb(result);
        }
    });
}


function recursiveSum(arData, result, $isEven, cb) {
    arData.pop((item) => {
        const itemType = typeof item;
        //Обработка завершения массива (массив законичлся если вернулся undefined и длина массива - 0)
        if (!item) {
            Homework.equal(itemType, "undefined", () => {
                arData.length((arLength) => {
                    if (!arLength) {
                        cb(result);
                    } else {
                        recursiveSum(arData, result, $isEven, cb);
                    }
                })
            });
        } else {
            Homework.equal(itemType, "number", (itemIsNumber) => {
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

function getSumOddNumbersInArray(arData, cb) {
    if (!(arData instanceof Homework.AsyncArray)) {
        arData = new Homework.AsyncArray(arData);
    }
    recursiveSum(arData, 0, false, cb);
}
