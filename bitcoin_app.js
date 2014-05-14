var currency = "US Dollar";
var currentPrice = [], ask = [], bid = [];
var dollarValue = 1, bitcoinValue = 1;

// Displays last BTC price (plus ask and bid prices)
var bitcoinDisplay = function(currentPrice, ask, bid){
  if (currency==="Euro") {
    $('h1').append("€" + currentPrice);
    $('p').append("€" + ask + "<small style=color:gray> Ask </small>" + " | " + "€" + bid + "<small style=color:gray> Bid </small>");
    //Replace $ symbol with € symbol
    $(".sr-only-center").first().empty().append("€");
    //Replace dollar placeholder with euro
    $("#dollarInput[placeholder]").attr("placeholder", "euro");
    return currentPrice;
  }

  else if (currency==="Złoty") {
    $('h1').append(currentPrice + "zł");
    $('p').append(ask + "zł" + "<small style=color:gray> Ask </small>" + " | " + bid + "zł" + "<small style=color:gray> Bid </small>");
    // Replace $ symbol with zł
    $(".sr-only-center").first().empty().append("zł");
    // Replace dollar placeholder with złoty
    $("#dollarInput[placeholder]").attr("placeholder", "złoty");
    return currentPrice;
  }

  // US currency
  else {
    $('h1').append("$" + currentPrice);
    $('p').append("$" + ask + "<small style=color:gray> Ask </small>" + " | " + "$" + bid + "<small style=color:gray> Bid </small>");
    // Restore $ symbol if currency was changed
    $(".sr-only-center").first().empty().append("$");
    // Restore dollar placeholder if currency was changed
    $("#dollarInput[placeholder]").attr("placeholder", "dollars");
    return currentPrice;
  }
};

// Gets BTC prices from api and pushes values to variables
var getCurrentPrice = function(callback) {
  var url = "";
  if (currency==="Euro")
    url = "https://api.bitcoinaverage.com/ticker/EUR/";
  else if (currency==="Złoty")
    url = "https://api.bitcoinaverage.com/ticker/PLN/";
  // US currency
  else
    url = "https://api.bitcoinaverage.com/ticker/USD/";

  $.getJSON(url, function (bcInfo) {
    currentPrice.splice(0,1,bcInfo.last);
    ask.splice(0,1,bcInfo.ask);
    bid.splice(0,1,bcInfo.bid);
    callback(currentPrice, ask, bid);
  });
};

// Converts $ to BTC
var dollarConvert = function (dollarValue, currentPrice) {
  // Bitcoins are divisible to 8 decimal places

  if (currency==="Euro"){
  bitcoinValue=(dollarValue/currentPrice).toFixed(8);
  $('p2').empty().append("<small style=color:gray>€" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
    return bitcoinValue;
  }
  
  else if (currency==="Złoty"){
  bitcoinValue=(dollarValue/currentPrice).toFixed(8);
  $('p2').empty().append("<small style=color:gray>" + dollarValue + "zł</small>" + " = " + "B⃦" + bitcoinValue);
    return bitcoinValue;
  }

  else {
  bitcoinValue=(dollarValue/currentPrice).toFixed(8);
  $('p2').empty().append("<small style=color:gray>$" + dollarValue + "</small>" + " = " + "B⃦" + bitcoinValue);
    return bitcoinValue;
  }
};

// Converts BTC to $
var btcConvert = function(bitcoinValue, currentPrice) {
 if (currency==="Euro") {
  dollarValue=(bitcoinValue*currentPrice).toFixed(2);
  $('p2').empty().append("€" + dollarValue + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
   return dollarValue;
  }

  else if (currency==="Złoty") {
   dollarValue=(bitcoinValue*currentPrice).toFixed(2);
   $('p2').empty().append(dollarValue + "zł" + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
     return dollarValue;
  }

  else {
   dollarValue=(bitcoinValue*currentPrice).toFixed(2);
   $('p2').empty().append("$" + dollarValue + " = " + "<small style=color:gray>B⃦" + bitcoinValue + "</small>");
     return dollarValue;
  }
};

$(document).ready(function()
   {
      getCurrentPrice(bitcoinDisplay);

      // Stores user input values (either $ or BTC)
      $('button').click(function() {
        var dollarValue = 0, bitcoinValue = 0;

        dollarValue = $("#dollarInput").val();
        bitcoinValue = $("#btcInput").val();

        if (dollarValue>0){
          dollarConvert(dollarValue,currentPrice);
          $("#dollarInput").val("");
        }
        else if (bitcoinValue>0){
          btcConvert(bitcoinValue, currentPrice);
          $("#btcInput").val("");
        }
      });

      $("#dd-menu a").click(function(){
        currency=$(this).text();
        $("h1").empty();
        $("p").empty();
        $("p2").empty();
        getCurrentPrice(bitcoinDisplay);
      });
});
