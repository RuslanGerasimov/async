function checkIfEven (a, cb) {
    Homework.mod(a, 2, (result) => {
        Homework.equal(result, 0, (isEven) => { cb(isEven) });
    });
}

function sumEven (a, b, cb) {
    let aIsEven = false;
    let bIsEven = false;
    checkIfEven(a, (isEven) => {
        aIsEven = isEven;
        checkIfEven(b, (isEven) => {
            bIsEven = isEven ;

            if(aIsEven && bIsEven) {
                Homework.add(a, b, cb);
            } else if(!aIsEven && !bIsEven) {
                cb(0);
            } else if(!aIsEven) {
                cb(b)
            } else {
                cb(a)
            }
        });
    } );
}


function recursiveSum(arData, result = 0, cb) {
    arData.pop((item) => {
        const itemType = typeof item;
        //Обработка завершения массива (массив законичлся если вернулся undefined и длина массива - 0)
        if(!item) {
            Homework.equal(itemType, "undefined", () => {
                arData.length((arLength) => {
                    if(!arLength) {
                        cb(result);
                    } else {
                        recursiveSum(arData, result, cb);
                    }
                })
            });
        } else {
            if(typeof item === "number"){}
            Homework.equal(itemType, "number", (itemIsNumber) => {
                if(itemIsNumber) {
                    sumEven(item, result, (result) => {
                        recursiveSum(arData, result,  cb);
                    });
                } else {
                    recursiveSum(arData, result,  cb);
                }
            });
        }
    });
}

function getSumOfEvenNumbersInArray(arData, cb) {
    if(!(arData instanceof Homework.AsyncArray)) {
        arData = new Homework.AsyncArray(arData);
    }
    recursiveSum(arData, 0, cb);
}
