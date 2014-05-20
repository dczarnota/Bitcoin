var currency = "US Dollar", symbol1 = "", symbol2 = "", holder = "";
var currentPrice = [], ask = [], bid = [], dayAverage = [];
var dollarValue = 1, bitcoinValue = 1, difference = 0;

// This function provides the template for appending values to the app via jQuery
// The goal of this function is to prevent the repetition of large blocks of code
var bitcoinDisplayTemplate = function(symbol1, symbol2, holder) {
    $("h1").append(symbol1 + currentPrice + symbol2);
    $("p").append(symbol1 + ask + symbol2 + "<small style=color:gray> Ask </small>" + " | " + symbol1 + bid + symbol2 + "<small style=color:gray> Bid </small>");
    //Replace currency symbol with the selected currency
    $(".sr-only-center").first().empty().append(symbol1 + symbol2);
    //Replace placeholder with selected currency 
    $("#dollarInput[placeholder]").attr("placeholder", holder);

    // Find difference between current price and 24-hour average
    // The anonymous callback calculates the difference between the current price and the 24-hour average
    // Then the anonymous callback adds the difference to the display using jQuery
    // When this function is executed, the array (dayAverage) will only have one item based on the nature of my program
    // Normally map is used to transform each item in an array and then push the new values to a new array
    // However, even though I am only transforming one item I wanted to practice using this method in my program
    dayAverage.map(function(){
      difference = currentPrice-dayAverage;
      if(difference===0)
        $("p2").append("<small style=color:gray>No change compared to 24-hour average</small>");
      if(difference>0)
        $("p2").append("+" + symbol1 + Math.abs(difference).toFixed(2) + symbol2 + "<small style=color:gray> compared to 24-hour average</small>");
      if(difference<0)
        $("p2").append("-" + symbol1 + Math.abs(difference).toFixed(2) + symbol2 + "<small style=color:gray> compared to 24-hour average</small>");
    });
};

// Displays last BTC price (plus ask and bid prices)
var bitcoinDisplay = function(currentPrice, ask, bid, dayAverage) {
  if (currency==="Euro") {
    symbol1 = "€";
    symbol2 = "";
    holder = "euro";

    bitcoinDisplayTemplate(symbol1, symbol2, holder);
    return currentPrice;
  }

  else if (currency==="Złoty") {
    symbol1 = "";
    symbol2 = "zł";
    holder = "złoty";

    bitcoinDisplayTemplate(symbol1, symbol2, holder);
    return currentPrice;
  }

  // US currency
  else {
    symbol1 = "$";
    symbol2 = "";
    holder = "dollars";

    bitcoinDisplayTemplate(symbol1, symbol2, holder);
    return currentPrice;
  }
};

// Gets BTC prices from api and pushes values to variables
// The callback parameter passed through is the function bitcoinDisplay
var getCurrentPrice = function(callback) {
  var url = "";
  if (currency==="Euro") { 
    url = "https://api.bitcoinaverage.com/ticker/EUR/";
  }
  else if (currency==="Złoty") {
    url = "https://api.bitcoinaverage.com/ticker/PLN/";
  }
  // US currency
  else {
    url = "https://api.bitcoinaverage.com/ticker/USD/";
  }
  // getJSON asynchronously fetches data from the api supplied in url variable
  // It uses an anonymous function once the GET HTTP request is successful
  // The anonymous function gets values and pushes them to currentPrice, ask, bid, and dayAverage
  // Then the callback (bitcoinDisplay) function executes 
  $.getJSON(url, function (bcInfo) {
    currentPrice.splice(0,1,bcInfo.last);
    ask.splice(0,1,bcInfo.ask);
    bid.splice(0,1,bcInfo.bid);
    dayAverage.splice(0,1,bcInfo["24h_avg"])
    callback(currentPrice, ask, bid, dayAverage);
  });
};

// Calculate bitcoin value
// This function will be executed in dollarConvert
var calcBitcoinValue = function(dollarValue, currentPrice) {
  // toFixed(8) is utilized because bitcoins are divisible to 8 decimal places
  return (dollarValue/currentPrice).toFixed(8);
};

// Calculate dollar (or other currency) value
// This function will be executed in btcCovert
var calcDollarValue = function(bitcoinValue, currentPrice) {
  return (bitcoinValue*currentPrice).toFixed(2);
};

// Converts currency to bitcoins
// The result from calcBitcoinValue is stored in bitcoinValue
// Appends the converted value and the appropriate currency symbol using jQuery
var dollarConvert = function(dollarValue, currentPrice) {
  if (currency==="Euro"){
  bitcoinValue = calcBitcoinValue(dollarValue, currentPrice);
  $("p3").empty().append("<small style=color:gray>€" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
  }
  
  else if (currency==="Złoty"){
  bitcoinValue = calcBitcoinValue(dollarValue, currentPrice);
  $("p3").empty().append("<small style=color:gray>" + dollarValue + "zł</small>" + " = " + "B⃦" + bitcoinValue);
  }

  else {
  bitcoinValue = calcBitcoinValue(dollarValue, currentPrice);
  $("p3").empty().append("<small style=color:gray>$" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
  }
};


// Although this is not the best use of callbacks...
// I wanted to leave this commented code here to show an example of a callback
// It is a slight variation of the previous two functions above
// The function calcBitcoinValue is executed as a callback in function dollarConvert
// Thus, executing the code: dollarConvert(dollarValue, currentPrice, calcBitcoinValue); 
// Would yield the same results as above
//
// var calcBitcoinValue = function(dollarValue, currentPrice) {
//   return bitcoinValue = (dollarValue/currentPrice).toFixed(8);
// };
//
// var dollarConvert = function(dollarValue, currentPrice, callback) {
//   if (currency==="Euro"){
//   callback(dollarValue, currentPrice);
//   $("p3").empty().append("<small style=color:gray>€" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
//   }
  
//   else if (currency==="Złoty"){
//   callback(dollarValue, currentPrice);
//   $("p3").empty().append("<small style=color:gray>" + dollarValue + "zł</small>" + " = " + "B⃦" + bitcoinValue);
//   }

//   else {
//   callback(dollarValue,currentPrice);
//   $("p3").empty().append("<small style=color:gray>$" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
//   }
// };


// Converts bitcoins to currency
// The result from calcDollarValue is stored in dollarValue
// Appends the converted value and the appropriate curreny symbol using jQuery
var btcConvert = function(bitcoinValue, currentPrice) {
 if (currency==="Euro") {
  dollarValue = calcDollarValue(bitcoinValue, currentPrice);
  $("p3").empty().append("€" + dollarValue + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
  }

  else if (currency==="Złoty") {
  dollarValue = calcDollarValue(bitcoinValue, currentPrice);
   $("p3").empty().append(dollarValue + "zł" + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
  }

  else {
  dollarValue = calcDollarValue(bitcoinValue, currentPrice);
   $("p3").empty().append("$" + dollarValue + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
  }
};

$(document).ready(function()
   {
      // bitcoinDisplay is passed as the callback function in getCurrentPrice
      getCurrentPrice(bitcoinDisplay);

      // Stores user input values (either $ or BTC)
      $("button").click(function() {
        var dollarValue = 0, bitcoinValue = 0;

        dollarValue = $("#dollarInput").val();
        bitcoinValue = $("#btcInput").val();

        if (dollarValue>0){
          dollarConvert(dollarValue, currentPrice);
          $("#dollarInput").val("");
        }
        else if (bitcoinValue>0){
          btcConvert(bitcoinValue, currentPrice);
          $("#btcInput").val("");
        }
      });

      $("#dd-menu a").click(function(){
        currency = $(this).text();
        $(".tagged").empty();
        getCurrentPrice(bitcoinDisplay);
      });
});
