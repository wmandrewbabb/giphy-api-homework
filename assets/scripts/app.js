$(document).ready(function() {

    var colorOptions = ['red','orange','yellow','green','blue','purple','pink'];
    var selectedColor = '';

    function colorSelectOnLoad() {

        selectedColor = colorOptions[Math.floor(Math.random()*colorOptions.length)]
        $('body').css('--keycolor', randomColor({hue: selectedColor, luminosity: 'light'}),);

    }

    //pull our user's buttons or create them if they're not already here
    var favoritesShowing = false;
    var offset = 0;

    var favorites = JSON.parse(localStorage.getItem("favorites"));
    if (!Array.isArray(favorites)) {
        favorites = [];
    }
    
    var topics = JSON.parse(localStorage.getItem("topicButtons"));
    if (!Array.isArray(topics)) {
        topics = [
            { 
                title:"Godzilla",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            },
            { 
                title:"Doggos",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            }, 
            { 
                title:"Birbs",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            }, 
        ];
    }

    // found a randomColor.js CDN that is way smarter about pretty colors than the simple one I have here, so I'm using that
    // an example of that CDN is at https://randomcolor.lllllllllllllllll.com/

    // function randomColor() {
    //     var letters = '0123456789ABCDEF';
    //     var color = '#';

    //     for (var i = 0; i < 6; i++) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }

    //     return color;
    // }

    //add our topic pill buttons
    
    $("#add-topic").on("click", function(event) {
  
        event.preventDefault();

        var topicUserInput = $("#topic-input").val().trim();

        if (topicUserInput === "") {

            console.log("empty error")

        } else {

            var topicObj = {};
            topicObj['title'] = topicUserInput;
            topicObj['color'] = randomColor({hue: selectedColor, luminosity: 'dark'});
            topics.push(topicObj);
        
        }

        $('#topic-form').children('#topic-input').val('')

        localStorage.setItem("topicButtons", JSON.stringify(topics));


        renderButtons();

    });

    //easter egg for color - change color without page reload 

    $("#colorEasterEgg").on("click", function(event) {

        selectedColor = colorOptions[Math.floor(Math.random()*colorOptions.length)]
        $('body').css('--keycolor', randomColor({hue: selectedColor, luminosity: 'light'}),);

    });

    //show our favorites

    $("#show-favorites").on("click", function(event) {

        $("#gifs-appear-here").empty();
        event.preventDefault();
        favoritesShowing = true;
        $("#more-results-button").css('display','none');

        displayFavorites();
    
    });

    function displayFavorites() {
        if (favoritesShowing == true) {

            $("#gifs-appear-here").empty();
            for (i=0; i < favorites.length; i++){

                var favDiv = $("<div class='imageOutput'>");
                var rating = favorites[i].rating;
                var animatedSrc = favorites[i].animatedSrc;
                var staticSrc = favorites[i].stillSrc;
                var dataIn = i;

                var p = $("<div id='ratingText'>").text(rating);
                var favThinger = $("<div class='favTriangle favorited' rating='"+rating+"' animatedSrc='"+animatedSrc+"' staticSrc='"+staticSrc+"' dataIndex='"+dataIn+"'>");
                var magGlass = $("<img src='assets/images/magglass.png' class='magGlass' animatedSrc="+animatedSrc+">")
                var downloadButton = $("<img src='assets/images/downloadicon.png' class='downloadIco' fileSrc="+animatedSrc+">")

                var favImage = $("<img class='resultsImg'>");

                favImage.attr("src", staticSrc);
                favImage.addClass("giphyResults");
                favImage.attr("data-state", "still");
                favImage.attr("data-still", staticSrc);
                favImage.attr("data-animate", animatedSrc);
                favDiv.append(p);
                favDiv.append(favThinger);
                favDiv.append(magGlass);
                favDiv.append(downloadButton);
                favDiv.append(favImage);
                favDiv.append("<div></div>\n\r");


                $("#gifs-appear-here").prepend(favDiv);
            }
        }
    }

    //return our buttons to default values (might be nice to take the todolist bit and just allow the users to remove them themselves?)

    $("#clear-buttons").on("click", function(event) {

        event.preventDefault();            
        topics = [
            { 
                title:"Godzilla",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            },
            { 
                title:"Funny",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            }, 
            { 
                title:"Cats",
                color: randomColor({hue: selectedColor, luminosity: 'dark'}),
            }, 
        ];

        localStorage.setItem("topicButtons", JSON.stringify(topics));

        renderButtons();

    });

    //actually draw our buttons

    function renderButtons() {

        $('button').remove();

        for (var i=0; i<topics.length; i++)
        {
            var a =$("<button>");
            a.addClass("topic");
            a.attr("data-name", topics[i].title),
            a.text(topics[i].title);
            a.css("background-color", topics[i].color)
            $('#buttons-cache').append(a);
        }
    }

    //JQUERY YOU HAVE FAILED ME /angryfist
    //Get API call on pill button push

    $(document).on("click", "button", function(){

        $("#gifs-appear-here").empty();
        event.preventDefault();
        $("#more-results-button").css('display','block');
        $("#more-results-button").attr("data-name", $(this).attr("data-name"));
        offset = 0;
        favoritesShowing = false;

        var topic = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&rating=r&api_key=dc6zaTOxFJmzC&limit=10"; //currently set to r-rated gifs because they're funnier

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                var topicDiv = $("<div class='imageOutput'>");
                var rating = results[i].rating;
                var animatedSrc = results[i].images.fixed_height.url;
                var staticSrc = results[i].images.fixed_height_still.url;

                var p = $("<div id='ratingText'>").text(rating);
                var favThinger = $("<div class='favTriangle' rating='"+rating+"' animatedSrc='"+animatedSrc+"' staticSrc='"+staticSrc+"'>");
                var magGlass = $("<img src='assets/images/magglass.png' class='magGlass' animatedSrc="+animatedSrc+">")
                var downloadButton = $("<img src='assets/images/downloadicon.png' class='downloadIco' fileSrc="+animatedSrc+">")


                for (x=0; x<favorites.length; x++){
                    if (animatedSrc == favorites[x].animatedSrc) {
                        var favThinger = $("<div class='favTriangle favorited' dataIndex="+favorites[x].dataIndex+" rating='"+rating+"' animatedSrc='"+animatedSrc+"' staticSrc='"+staticSrc+"'>");
                    }
                }

                var topicImage = $("<img class='resultsImg'>");

                topicImage.attr("src", staticSrc);
                topicImage.addClass("giphyResults");
                topicImage.attr("data-state", "still");
                topicImage.attr("data-still", staticSrc);
                topicImage.attr("data-animate", animatedSrc);
                topicDiv.append(p);
                topicDiv.append(favThinger);
                topicDiv.append(magGlass);
                topicDiv.append(downloadButton);
                topicDiv.append(topicImage);
                topicDiv.append("<div></div>\n\r");

                $("#gifs-appear-here").prepend(topicDiv);

            }
        });
    });

    //could probably make this into a single function, but for some reason that's messing with the API timing?!
    //But seriously, I've essentially used this same block three times, this should really be a function here

    $(document).on("click", "#more-results-button", function(){

        event.preventDefault();
        offset = offset + 10;
        favoritesShowing = false;

        var topic = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&rating=r&api_key=dc6zaTOxFJmzC&offset="+ offset + "&limit=10"; //currently set to r-rated gifs because they're funnier

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                var topicDiv = $("<div class='imageOutput'>");
                var rating = results[i].rating;
                var animatedSrc = results[i].images.fixed_height.url;
                var staticSrc = results[i].images.fixed_height_still.url;

                var p = $("<div id='ratingText'>").text(rating);
                var favThinger = $("<div class='favTriangle' rating='"+rating+"' animatedSrc='"+animatedSrc+"' staticSrc='"+staticSrc+"'>");
                var magGlass = $("<img src='assets/images/magglass.png' class='magGlass' animatedSrc="+animatedSrc+">")
                var downloadButton = $("<img src='assets/images/downloadicon.png' class='downloadIco' fileSrc="+animatedSrc+">")

                for (x=0; x<favorites.length; x++){
                    if (animatedSrc == favorites[x].animatedSrc) {
                        var favThinger = $("<div class='favTriangle favorited' dataIndex="+favorites[x].dataIndex+" rating='"+rating+"' animatedSrc='"+animatedSrc+"' staticSrc='"+staticSrc+"'>");
                    }
                }

                var topicImage = $("<img class='resultsImg'>");

                topicImage.attr("src", staticSrc);
                topicImage.addClass("giphyResults");
                topicImage.attr("data-state", "still");
                topicImage.attr("data-still", staticSrc);
                topicImage.attr("data-animate", animatedSrc);
                topicDiv.append(p);
                topicDiv.append(favThinger);
                topicDiv.append(magGlass);
                topicDiv.append(downloadButton);
                topicDiv.append(topicImage);
                topicDiv.append("<div></div>\n\r");

                $("#gifs-appear-here").append(topicDiv);

            }
        });




    });

    //toggle our animation states

    $(document).on("click", ".giphyResults", function() {
       
        var isAnimated = $(this).attr("data-state");

        if (isAnimated === "still") {

            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");

        } else {

            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");

        }

    });

     $(document).on("click", ".favTriangle", function() {

        if (!$(this).hasClass("favorited")) {
            
            $(this).addClass("favorited");
            var favRating =  $(this).attr("rating");
            var favAnimated = $(this).attr("animatedSrc");
            var favStill = $(this).attr("staticSrc");
            var favIndex = favorites.length;
            

            
            var favoritesObj = {};

            favoritesObj['rating'] = favRating;
            favoritesObj['animatedSrc'] = favAnimated;
            favoritesObj['stillSrc'] = favStill;
            favoritesObj['dataIndex'] = favIndex;
            favorites.push(favoritesObj);
            
            localStorage.setItem("favorites", JSON.stringify(favorites));
            $(this).attr("dataIndex", favIndex);

        } else {

            var deleteFavorites = JSON.parse(localStorage.getItem("favorites"));
            var currentIndex = $(this).attr("dataIndex");

            // Deletes the item marked for deletion
            deleteFavorites.splice(currentIndex, 1);
            favorites = deleteFavorites;

            localStorage.setItem("favorites", JSON.stringify(deleteFavorites));
            $(this).removeClass("favorited").removeAttr("dataIndex");

            displayFavorites();

        }

    });




// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
   $('#myModal').css('display','none');
}

$(document).on("click",".magGlass", function() {
    
    var img = $(this).attr('animatedSrc');
    $('#giphyImage').attr('src', img);
    $('#myModal').css('display','block');

});

$(document).on("click",".downloadIco", function(e) {

    e.preventDefault();
    console.log($(this).attr('fileSrc'));
    // window.location.href = $(this).attr('fileSrc');  

    // var a = document.createElement('a');
    // a.href = $(this).attr('fileSrc');
    // a.download = $(this).attr('fileSrc');
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

});



    colorSelectOnLoad();
    renderButtons();

});