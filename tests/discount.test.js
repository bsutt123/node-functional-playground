const calculateDiscount = require("../index");

var testItemsArray = [
  [
    { quantity: 50, width: 2, height: 1, product: { area_price: 0.8 } },
    { quantity: 50, width: 1, height: 1, product: { area_price: 0.8 } }
  ],

  [
    { quantity: 50, width: 2, height: 1, product: { area_price: 0.8 } },
    { quantity: 100, width: 1, height: 1, product: { area_price: 0.8 } },
    { quantity: 150, width: 3, height: 3, product: { area_price: 0.8 } }
  ],

  [
    { quantity: 50, width: 2, height: 2, product: { area_price: 0.6 } },
    { quantity: 150, width: 3, height: 2, product: { area_price: 0.8 } }
  ],

  [{ quantity: 50, width: 2, height: 2, product: { area_price: 0.8 } }]
];

var testItemsOutputs = [5.44, 57.94, 22.88, 0];

test("passes all the tests in the", function tester() {
  testItemsArray.forEach(function calc(items, index) {
    expect(calculateDiscount(items)).toBe(testItemsOutputs[index]);
  });
});
