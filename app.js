const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

/**
 * the server which listens to the specified port
 */
app.listen(port, function(){
    console.log("Server is running on port:" + port);
});

/**
 * use the body parser to deal with the received value by users
 */
app.use(bodyParser.urlencoded({extended: true}));

/**
 * when server routes to the root, send the index.html to the client
 */
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");

});

/**
 * when client post the text value, will search the result for users
 */
app.post("/", function(req, res){
    //url comes from the Postman app
    //https://openweathermap.org/
    const cityName = req.body.cityName;
    const appid = "7d525412812c801aa11d64c4b335d53f";
    const units = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +"&appid=" + appid + "&units=" + units;

    https.get(url, function(response){
        //each time connect to the server, show the status code on the server side
        console.log("Status code: " + response.statusCode);

        response.on("data", function(data){
            //parse the data into JSON format
            const weatherData = JSON.parse(data);
            const temp = parseFloat(weatherData.main.temp);
            //use postman to check the format first, then grab the data
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon; 
            //check the source website to see its usage
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            // for the purpose to show the image instead of URL
            res.set("content-type", "text/html");
            //directly write the html code shown to clients
            res.write("<h1>Description: " + description +"</h1>");
            res.write("<br>");
            res.write("The temperature in "+ cityName +" is " + temp + " degree Celcius");
            res.write("<br>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
});



