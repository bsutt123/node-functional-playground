const _ = require("ramda");

/*
take an array of items with the following properties...
 
  quantity,
  width,
  height,
  product: {
    area_price
  },
}

orders will have a discount based on the quantity of items purchased. The goal is to be able to feed in an array of items, and then calculate the difference between when the quantity is calculated on an individual basis versus on the total items purchased in the entire order.

*/

//*************Pure Utilities**************//
// logger that you can use in line in a function composition
var logger = function(x) {
  console.log(x);
  return x;
};

//rebind some ramda functions to be a bit easier to use
var reduce = _.reduce;
var curry = _.curry;
var compose = _.compose;
var prop = _.prop;
var map = _.map;

//taken from MDN as a recommendation for rounding
var curriedRound = curry(function(precision, number) {
  var shift = function(number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(
      numArray[0] +
      "e" +
      (numArray[1] ? +numArray[1] + precision : precision)
    );
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
});

//**************Calculation***************//

// calcTotalItem :: [a] -> Number
// uses function composition to calculate total items in an order
var calcTotalItems = compose(reduce(_.add, 0), map(prop("quantity")));

// calcNormalPrice :: a -> Number
// calculates the normal price of the item using its quantity directory
var calcNormalPrice = function(item) {
  return (
    item.width *
    item.height *
    Math.pow(item.quantity, -0.1) *
    item.product.area_price *
    item.quantity
  );
};

// calcReducedPrice :: a ->  Number
// calculated the reduced price of the item by preloading the total quantity into a curried function
var calcReducedPrice = curry(function(totalQuantity, item) {
  return (
    item.width *
    item.height *
    Math.pow(totalQuantity, -0.1) *
    item.product.area_price *
    item.quantity
  );
});

// calculateDiscount :: [a] ->  Number
// calculates the discount necessary to provide between the two different ways of calculating quantity.
var calculateDiscount = function(items) {
  if (items.length === 0) {
    return 0;
  }
  var totalQuantity = calcTotalItems(items);

  var calcNormalTotal = compose(
    curriedRound(2),
    reduce(_.add, 0),
    map(calcNormalPrice)
  );
  var calcReducedTotal = compose(
    curriedRound(2),
    reduce(_.add, 0),
    map(calcReducedPrice(totalQuantity))
  );

  var normalTotal = calcNormalTotal(items);
  var reducedTotal = calcReducedTotal(items);

  return curriedRound(2, normalTotal - reducedTotal);
};

module.exports = calculateDiscount;
