// テスト手法について学習する用のファイル

// テストの種類->ユニットテスト
// 関数を用意するので適切なテストを設計することが目的

/**
 * 注文を処理して最終的な合計金額を計算する関数
 * @param {Array} orders - 注文の配列
 * @param {number} discountThreshold - 割引が適用される金額の閾値
 * @param {number} discountRate - 割引率（例：0.1は10%）
 * @param {number} taxRate - 税率（例：0.08は8%）
 * @returns {number} - 最終的な合計金額
 */


// テストデータに依存しない数値はテスト対象の関数外で定数として定義することで、その値が変更された場合に関数内の修正が不要になる
// 各テストコード内にテストデータを直接記述することで、テストデータがどのテストに対応しているかが明確になる
/*
    const discountThreshold = 1000;
    const discountRate = 0.1;
    const taxRate = 0.1;
*/


function processOrders(orders, discountThreshold, discountRate, taxRate) {
    if (!Array.isArray(orders)) {
        throw new Error('orders must be an array');
    }
    if (typeof discountThreshold !== 'number' || typeof discountRate !== 'number' || typeof taxRate !== 'number') {
        throw new Error('Threshold and rates must be numbers');
    }

    // 各注文の合計を計算
    let subtotal = orders.reduce((acc, order) => {
        if (!order.items || !Array.isArray(order.items)) {
            throw new Error('Each order must have an items array');
        }
        const orderTotal = order.items.reduce((sum, item) => {
            if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                throw new Error('Item price and quantity must be numbers');
            }
            return sum + item.price * item.quantity;
        }, 0);
        return acc + orderTotal;
    }, 0);

    // 割引の適用
    let discount = 0;
    if (subtotal >= discountThreshold) {
        discount = subtotal * discountRate;
    }
    const discountedTotal = subtotal - discount;

    // 税金の計算
    const tax = discountedTotal * taxRate;

    // 最終的な合計金額
    const finalTotal = discountedTotal + tax;

    return parseFloat(finalTotal.toFixed(2)); // 小数点以下2桁に丸める
}

// サンプルデータ
const orders = [
    {
        orderId: 1,
        items: [
            { name: 'Laptop', price: 1000, quantity: 1 },
            { name: 'Mouse', price: 50, quantity: 2 }
        ]
    },
    {
        orderId: 2,
        items: [
            { name: 'Keyboard', price: 80, quantity: 1 },
            { name: 'Monitor', price: 300, quantity: 2 }
        ]
    }
];

//OK: processOrders関数のユニットテストを設計する
//test1: 合計金額の閾値(=境界値)テスト
//test2: 異常値のテスト
    //test2-1: ordersが配列でない場合・ordersが空の場合
    //test2-2: discountThreshold, discountRate, taxRateが数値でない場合
    //test2-3: 各orderのitemsが配列でない場合
    //test2-4: itemのprice, quantityが数値でない場合・price, quantityが空の場合・price, quantityがマイナスの場合
//test3: 正常値のテスト(境界値テストの複数要素版)


// テストコード
//test1: 合計金額の閾値(=境界値)テスト
//test1_1: 合計金額が閾値以上の場合
function test1_1() {
    
    const discountThreshold = 1762.2;
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        const result = processOrders(orders, discountThreshold, discountRate, taxRate);
        const expected = 1000 * 1 + 50 * 2 + 80 * 1 + 300 * 2; // = 1780
        const discount = expected * discountRate; // = 178
        const discountedTotal = expected - discount; // = 1602
        const tax = discountedTotal * taxRate; // = 160.2
        const finalTotal = discountedTotal + tax; // = 1762.2
        if (result === finalTotal) {
            console.log('test1: OK');
        } else {
            console.log(`test1 failed: expected ${finalTotal}, got ${result}`);
        }
    } catch (error) {
        console.log(`Test 1 failed with error: ${error.message}`);
    }
}

//test1_2: 合計金額が閾値未満の場合
function test1_2() {

    const discountThreshold = 1762.3;
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        const result = processOrders(orders, discountThreshold, discountRate, taxRate);
        const expected = 1000 * 1 + 50 * 2 + 80 * 1 + 300 * 2; // = 1780
        const discount = 0; // 閾値未満のため
        const discountedTotal = expected - discount; // 0
        const tax = discountedTotal * taxRate; // =
        const finalTotal = discountedTotal + tax;
        if (result == finalTotal) {
            console.log("test1_2: OK");
        } else {
            console.log(`test1_2 failed: expected ${finalTotal}, got ${result}`);
        }
    } catch (error) {
        console.log(`test1_2 failed with error: ${error.message}`);
    }
}

// test2: 異常値のテスト
// test2-1: ordersが配列でない場合
function test2_1() {
    
    const discountThreshold = 1000;
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        processOrders({}, discountThreshold, discountRate, taxRate);
        console.log('test2_1 failed: エラーが発生しませんでした');
    } catch (error) {
        if (error.message === 'orders must be an array') {
            console.log('test2_1: OK');
        } else {
            console.log(`test2_1 failed: 予期しないエラー: ${error.message}`);
        }
    }
}

// test2-2: discountThresholdが数値でない場合
function test2_2() {
    const discountThreshold = 'not a number';
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        processOrders(orders, discountThreshold, discountRate, taxRate);
        console.log('test2_2 failed: エラーが発生しませんでした');
    } catch (error) {
        if (error.message === 'Threshold and rates must be numbers') {
            console.log('test2_2: OK');
        } else {
            console.log(`test2_2 failed: 予期しないエラー: ${error.message}`);
        }
    }
}

// test2-3: 各orderのitemsが配列でない場合
function test2_3() {
    const invalidOrders = [
        {
            orderId: 1,
            items: 'not an array'
        }
    ];
    const discountThreshold = 1000;
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        processOrders(invalidOrders, discountThreshold, discountRate, taxRate);
        console.log('test2_3 failed: エラーが発生しませんでした');
    } catch (error) {
        if (error.message === 'Each order must have an items array') {
            console.log('test2_3: OK');
        } else {
            console.log(`test2_3 failed: 予期しないエラー: ${error.message}`);
        }
    }
}

// test2-4: itemのpriceが数値でない場合
function test2_4() {
    const invalidOrders = [
        {
            orderId: 1,
            items: [
                { name: 'Invalid Item', price: 'not a number', quantity: 1 }
            ]
        }
    ];
    const discountThreshold = 1000;
    const discountRate = 0.1;
    const taxRate = 0.1;

    try {
        processOrders(invalidOrders, discountThreshold, discountRate, taxRate);
        console.log('test2_4 failed: エラーが発生しませんでした');
    } catch (error) {
        if (error.message === 'Item price and quantity must be numbers') {
            console.log('test2_4: OK');
        } else {
            console.log(`test2_4 failed: 予期しないエラー: ${error.message}`);
        }
    }
}

// test3: 正常値のテスト（境界値テストの複数要素版）
function test3() {
    const discountThreshold = 1500;
    const discountRate = 0.1;
    const taxRate = 0.08;

    const testOrders = [
        {
            orderId: 1,
            items: [
                { name: 'Item A', price: 1000, quantity: 1 },
                { name: 'Item B', price: 250, quantity: 2 }
            ]
        },
        {
            orderId: 2,
            items: [
                { name: 'Item C', price: 100, quantity: 3 }
            ]
        }
    ];

    try {
        const result = processOrders(testOrders, discountThreshold, discountRate, taxRate);
        const expected = 1000 + 250 * 2 + 100 * 3; // = 1800
        const discount = expected * discountRate; // = 180
        const discountedTotal = expected - discount; // = 1620
        const tax = discountedTotal * taxRate; // = 129.6
        const finalTotal = parseFloat((discountedTotal + tax).toFixed(2)); // = 1749.60

        if (result === finalTotal) {
            console.log('test3: OK');
        } else {
            console.log(`test3 failed: expected ${finalTotal}, got ${result}`);
        }
    } catch (error) {
        console.log(`test3 failed with error: ${error.message}`);
    }
}

// テストの実行
test1_1();
test1_2();
test2_1();
test2_2();
test2_3();
test2_4();
test3();
