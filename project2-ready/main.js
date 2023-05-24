//globel variables and arrays
let dataModel = new Array();
let resultModel = new Array();
let tempArray = new Array();
let mainGraphArray = new Array();
let interval;
//first ajax call , geting the main api from server
(function () {
    $(function () {
        loader("#dynamicDiv");
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins",
            success: function (data) {
                console.log("Connected successfuly");
                dataModel = data;
                setOnLocalStorage();
                $("#dynamicDiv").empty();
                displayCoins(dataModel);
            },
            error: function () {
                console.log("error");
            }
        });
    })
})();
//create function , display only 50 coins
//create the card and put the api in the cards
//working with local storage
function displayCoins() {
    $("#dynamicDiv").empty()
    let fiveCoinsArray = getFromLocalStorage("fiveCoinsArray");
    $.each(dataModel, function (index, item) {
        if (index < 50) {

            let coinsMainArea = $("<div>");
            coinsMainArea.attr("id", "coinsMainArea")

            let cardDiv = $("<div>");
            cardDiv.attr("id", index);
            cardDiv.attr("class", "card col-sm-3");

            cardDiv.css("width", "18rem");
            cardDiv.css("height", "19rem");
            cardDiv.css("display", "inline-block");
            cardDiv.css("background-color", "goldenrod");
            cardDiv.attr("id", "cardDiv")

            let symbolPara = $("<p>");
            symbolPara.html(dataModel[index].symbol);

            let namePara = $("<p>");
            namePara.html(dataModel[index].name);

            let moreInfobtn = $("<button>");
            moreInfobtn.html("More info");
            moreInfobtn.attr("id", index);
            moreInfobtn.attr("class", "btn btn-dark");
            moreInfobtn.css("margin-top", "30px");
            moreInfobtn.click(moreInfo);

            let switchBtn = $("<label>");
            switchBtn.attr("class", "switch");
            switchBtn.attr("id", index);

            let switchInput = $("<input>");
            switchInput.attr("class", "switchInput");
            switchInput.attr("type", "checkbox");
            switchInput.attr("value", dataModel[index].symbol);

            for (let index=0;index<fiveCoinsArray.length; index++) {
                if (item.symbol == fiveCoinsArray[index]) {
                    switchInput.attr("checked", "checked");
                }
            }
            switchBtn.append(switchInput);
            switchBtn.append("<span class='slider round'</span>");
            switchBtn.change(markingCoins);

            let moreInfoDiv = $("<div>");
            moreInfoDiv.attr("id", "moreInfoDiv" + index);
            moreInfoDiv.css("display", "none");
            moreInfoDiv.css("position", "absolute");
            moreInfoDiv.css("width", "100%");
            moreInfoDiv.css("height", "50%");

            $("#dynamicDiv").append(coinsMainArea);
            $("#coinsMainArea").append(cardDiv);
            $(cardDiv).append(symbolPara);
            $(cardDiv).append(namePara);
            $(cardDiv).append(switchBtn);
            $(cardDiv).append(moreInfobtn);
            $(cardDiv).append(moreInfoDiv);
            
        }
    })
}

function setOnLocalStorage() {
    localStorage.setItem("coinsArray", JSON.stringify(dataModel));
}
function getFromLocalStorage(storageName) {
    let dataModel = JSON.parse(localStorage.getItem(storageName));
    if (dataModel == null) {
        dataModel = [];
    }
    return dataModel;
}
// Navigte div , return to the main page.
function comingHome() {
    loader("#dynamicDiv");
    $("#dynamicDiv").empty();
    $("#aboutDiv").empty();
    clearInterval(interval);
    dataModel = getFromLocalStorage("coinsArray");
    displayCoins();
}
//Getting new info from api with new ajax call with id
//
function moreInfo() {
    for (let index = 0; index < 100; index++) {
        if (index == this.id) {
            let id = dataModel[index].id;
            loader(`#moreInfoDiv${index}`);
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                type: "GET",
                success: function (data) {
                    $(`#moreInfoDiv${index}`).slideToggle("active", function () {
                        $(`#moreInfoDiv${index}`).empty();
                        console.log("connecion sucsses");

                        let img = $("<img>")
                        img.attr("src", data.image.small)
                        $(`#moreInfoDiv${index}`).html(
                            "1"+dataModel[index].symbol+"="+
                            "<br>" + "USD: " + data.market_data.current_price.usd +" $"+
                            "<br>" + "EUR: " + data.market_data.current_price.eur +" €"+
                            "<br>" + "ILS: " + data.market_data.current_price.ils +" ₪"+
                            "<br>"
                        );
                        $(`#moreInfoDiv${index}`).append(img)
                    });
                },
                error: function () {
                console.log("error ");
                }
            });
            return;
        };
    };
};
//Modal maintain function , decide in which array the value will be pushed
function markingCoins() {
    loader("#dynamicDiv");
    let fiveCoinsArray = getFromLocalStorage("fiveCoinsArray");
    let value = this.control.value;
    if (fiveCoinsArray.length <= 5) {
        for (let index = 0; index < fiveCoinsArray.length; index++) {
            if (value == fiveCoinsArray[index]) {
                fiveCoinsArray.splice(index, 1);
                return localStorage.setItem("fiveCoinsArray", JSON.stringify(fiveCoinsArray));
            }
        }
        if (fiveCoinsArray.length < 5) {
            fiveCoinsArray.push(value);
            return localStorage.setItem("fiveCoinsArray", JSON.stringify(fiveCoinsArray))
        }
    }
    tempArray.push(value)
    console.log(tempArray);
    modalAlert();
}
//Create the modal , the modal src is in the html.
function modalAlert() {
    loader("#dynamicDiv");
    let fiveCoinsArray = getFromLocalStorage("fiveCoinsArray");
    for (let index = 0; index < fiveCoinsArray.length; index++) {

        let switchModalInput = $("<input type=checkbox class=custom-control-input>");
        switchModalInput.attr("class", "switchInput");
        switchModalInput.attr("type", "checkbox");
        switchModalInput.attr("value", fiveCoinsArray[index]);
        switchModalInput.attr("id", "modalInput" + index);
        switchModalInput.addClass("switchModalInput");
        switchModalInput.attr("checked", "checked");

        let switchModalBtn = $("<label>");
        switchModalBtn.attr("class", "switch");
        switchModalBtn.attr("id", index);
        switchModalBtn.append(switchModalInput);
        switchModalBtn.append("<span class='slider round'</span>");
        switchModalBtn.css("margin-top", "3px");

        let modalDiv = $("<div>");
        modalDiv.html(fiveCoinsArray[index]);
        modalDiv.attr("class", "custom-control");

        modalDiv.css("display", "inline-block");
        modalDiv.css("height", "100%");
        modalDiv.css("width", "100%");
        modalDiv.css("margin-bottom", "5px");

        modalDiv.css("padding", "20");
        modalDiv.css("text-align", "left");
        modalDiv.css("border-radius", "2px");
        modalDiv.css("border", "solid black 2px");

        modalDiv.append(switchModalBtn);
        $(".modal-body").append(modalDiv);
        tempArray.push(fiveCoinsArray[index]);
    }
    $(`#exampleModal`).modal("show");
}
//save modal function , delete the coin you choose in the modal
//and push the last value (last coin click) to the main array.
$(document).on("change",".switchModalInput",function(){
    if((this).checked==false){
        for(let index=0;index<tempArray.length;index++){
            if(this.value==tempArray[index]){
                tempArray.splice(index,1);
            };
        };
    };
    if((this).checked==true){
        tempArray.push(this.value);
    };
});
$(document).on("click","#saveBtnModal",function(){
    if(tempArray.length<=5){
       localStorage.setItem("fiveCoinsArray",JSON.stringify( tempArray))
       tempArray=[];
        $(".modal-body").empty()
        return displayCoins();
    }
displayCoins();
tempArray=[];
$(".modal-body").empty()

});
//modal cancel function , if you press cancel btn on modal 
// you will get only the first 5 chooses.
function cancel() {
    displayCoins();
    tempArray = [];
    console.log(tempArray);
    $(".modal-body").empty()
}
//About description
function about() {
    clearInterval(interval);
    $("#dynamicDiv").empty();
    let aboutDiv = $("<div>");
    aboutDiv.attr("id", "aboutDiv");
    aboutDiv.css("font-size", "20px");
    aboutDiv.attr("class", "alert alert-warning");
    aboutDiv.attr("role", "alert");
    aboutDiv.html("Hello customer my name is Adar Saban and i am 24 years old from Raanana. " +
        "<br>" + " I built this site as part of my college studies , this is my second project. " +
        "<br>" + "This project make me use what i have learned until know . i used HTML,CSS" +
        "<br>" + "Java script and Jquery, this project focus on dynmaic DOM  changes , ajax call,bootstrap " +
        "<br>" + "one page app,and more." +
        "<br>" + "I hope you enjoyed visting my website!" + "<br>" + "<br>"
    );
    let aboutImg = $("<img>");
    aboutImg.attr("src", "assets/20232110_10207420626592349_3462147650157470881_o.jpg");
    aboutImg.css("height", "50%");
    aboutImg.css("width", "50%");
    aboutDiv.append(aboutImg);
    $("#dynamicDiv").append(aboutDiv);

}
// Check if the coin symbol you search exict in the server resource. 
function search() {
    clearInterval(interval);
    let userSearch = $("#searchInput").val();
    $("#searchInput").val("");
    let searchDivResult = $("<div>");
    $.each(dataModel, function (index, item) {
        if (userSearch == item.symbol) {
            $("#dynamicDiv").empty();
            $("#dynamicDiv").append(searchDivResult);
            dataModel = new Array();
            dataModel[0] = item;
            return displayCoins();
        }
    })
};
//Graph main function, execution
//The function happed every 2 sec with interval function
function graphRequest() {
    $("#dynamicDiv").empty();
    loader("#dynamicDiv");
     let fiveCoinsArray = getFromLocalStorage("fiveCoinsArray");
    for (let index = 0; index < fiveCoinsArray.length; index++) {
        mainGraphArray.push([])
    }
    interval = setInterval(displayGraph, 2000)
}
//graph ajax call , the call assigne to the coins we choose im the main page.
//create object that run 5 time most with for loop with the data fron server
//
function displayGraph() {
    fiveCoinsArray = getFromLocalStorage("fiveCoinsArray");
    $.ajax({
        type: "GET",
        url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + fiveCoinsArray + "&tsyms=USD",
        success: function (result) {
            console.log("Connected successfuly");
            let resultModel;
            resultModel = result;
            localStorage.setItem("graphArray", JSON.stringify(resultModel));
            for (let index = 0; index < fiveCoinsArray.length; index++) {
                let coin = {
                    x: new Date(),
                    y: resultModel[fiveCoinsArray[index].toUpperCase()].USD
                }
                mainGraphArray[index].push(coin);
            }
        },
        error: function () {
            console.log("error");
        },
    });

    var options = {
        exportEnabled: true,
        animationEnabled: false,
        title: {
            text: ""
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Timeline"
        },
        axisY: {
            title: "Crpyto value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        axisY2: {
            title: "Profit in USD",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: []
    };
    for (let index = 0; index < fiveCoinsArray.length; index++) {
        let drawObject = {
            type: "spline",
            name: fiveCoinsArray[index],
            showInLegend: true,
            xValueFormatString: "MMM YYYY",
            yValueFormatString: mainGraphArray[index].x,
            dataPoints: mainGraphArray[index]
        };
        options.data.push(drawObject);

    };
    $("#dynamicDiv").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}
//init storage
(function () {
    localStorage.clear();
})();
//gif dispaly function
function loader(component) {
    let gif = '<img  src=./assets/21.gif>';
    let loaderDiv = `<div class="loader" col-12">${gif}</div>`;
    $(loaderDiv).append(gif);
    $(component).append(loaderDiv);
};