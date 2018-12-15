var GIPHY = {

    topics: ["Dog", "Cat", "Bear", "Lion", "Rabbit","Fox", "Elephant", "Penguin"],
    addButton: false,
    data: "",
    limits: 10,
    id_arr: [],
    
    make_buttons: function(){
        $("#buttons_display").empty();

        for(var  i=0; i<GIPHY.topics.length; i++){
            //<button type='button' class='btn btn-outline-secondary'>Secondary</button>
            var button = $("<button type='button' class='btn-data btn btn-outline-secondary'>"+GIPHY.topics[i]+"</button>");
            button.attr("data-name", GIPHY.topics[i]);
            $("#buttons_display").append(button);
        }
    },

    change_state: function(){
        //console.log(this);
        if($(this).attr("img-state")==="still"){
            $(this).attr("img-state", "active");
            $(this).attr("src", $(this).attr("img-active"));
        } else {
            $(this).attr("img-state", "still");
            $(this).attr("src", $(this).attr("img-still"));
        }
    },

    button_click: function(){
        $(".add10").removeClass("disabled");
        GIPHY.addButton = true;
        //console.log(this);
        GIPHY.limits = 10;
        GIPHY.data = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            GIPHY.data + "&api_key=dc6zaTOxFJmzC&limit=" + parseInt(GIPHY.limits);
        //console.log(queryURL);
        GIPHY.GIPHY_API(queryURL);

    },

    add_click: function(){
        if(GIPHY.addButton){
            GIPHY.limits += 10;
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            GIPHY.data + "&api_key=dc6zaTOxFJmzC&limit=" + parseInt(GIPHY.limits);
            //console.log(queryURL);
            GIPHY.GIPHY_API(queryURL);

            GIPHY.addButton = false;
            $(".add10").addClass("disabled");
        }
    },


    GIPHY_API: function(queryURL){
        $("#img_display").empty();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            //console.log(response);
            for(var i=0; i<response.data.length; i++){
                var div = $("<div>");
                div.attr("class","img_div border rounded");
                var img_tag = $("<img>");
                img_tag.attr("img-state", "still");//border border-secondary
                img_tag.attr("img-still", response.data[i].images.fixed_height_still.url);
                img_tag.attr("img-active", response.data[i].images.fixed_height.url);
                img_tag.attr("class", "rounded mx-auto d-block img-fluid");
                img_tag.attr("src", response.data[i].images.fixed_height_still.url);
                div.append(img_tag);
                div.append("<br><p>Title : "+response.data[i].title+"</p>");
                div.append("<p>Rating : "+response.data[i].rating+"</p>");
                div.append("<a href='"+response.data[i].images.fixed_height.url+"' download><button type='button' class='download btn btn-sm btn-outline-info'>Download</button></a><br>");
                div.append("<button id='"+response.data[i].id+"' type='button' class='addFavorite btn btn-outline-warning btn-sm'>Add Favorite <i class='fab fa-gratipay'></i></button>");
                
                
                $("#img_display").append(div);

            }
        

        }).catch((err) => {
            console.log("error : "+errorObject.code);
        });
    },

    add_favorite: function(){
        //console.log($(this).attr("id"));

        var add_id = $(this).attr("id");
        GIPHY.id_arr = JSON.parse(localStorage.getItem("id"));
        if(GIPHY.id_arr==null){
            GIPHY.id_arr= [];
            GIPHY.id_arr.push(add_id);
            localStorage.setItem("id", JSON.stringify(GIPHY.id_arr));
        } else{
            if(!GIPHY.id_arr.includes(add_id)){
                GIPHY.id_arr.push(add_id);
                localStorage.setItem("id", JSON.stringify(GIPHY.id_arr));
            }else {
                console.log("already added")
            }
        }
        $("#favorite_items").text(GIPHY.id_arr.length);
    },

    show_favorite: function(){
        $("#img_display").empty();
        GIPHY.id_arr = JSON.parse(localStorage.getItem("id"));
        var queryURL = "https://api.giphy.com/v1/gifs?ids=" +
        GIPHY.id_arr.join() + "&api_key=dc6zaTOxFJmzC";
            //https://api.giphy.com/v1/gifs?ids=nNxT5qXR02FOM,%20mlvseq9yvZhba&api_key=dc6zaTOxFJmzC
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            //console.log(response);
            for(var i=0; i<response.data.length; i++){
                var div = $("<div>");
                div.attr("class","img_div border rounded");
                var img_tag = $("<img>");
                img_tag.attr("img-state", "still");//border border-secondary
                img_tag.attr("img-still", response.data[i].images.fixed_height_still.url);
                img_tag.attr("img-active", response.data[i].images.fixed_height.url);
                img_tag.attr("class", "rounded mx-auto d-block img-fluid");
                img_tag.attr("src", response.data[i].images.fixed_height_still.url);
                div.append(img_tag);
                div.append("<br><p>Title : "+response.data[i].title+"</p>");
                div.append("<p>Rating : "+response.data[i].rating+"</p>");
                div.append("<a href='"+response.data[i].images.fixed_height.url+"' download><button type='button' class='download btn btn-sm btn-outline-info'>Download</button></a><br>");
                div.append("<button id='"+response.data[i].id+"' type='button' class='removeFavorite btn btn-outline-warning btn-sm'>Remove Favorite</button>");
                
                
                $("#img_display").append(div);

            }
        });
    },

    remove_favorite: function(){
        GIPHY.id_arr = JSON.parse(localStorage.getItem("id"));
        var add_id = $(this).attr("id");
        var index_number = GIPHY.id_arr.indexOf(add_id);
        
        GIPHY.id_arr.splice(index_number, 1);


        localStorage.clear();
        localStorage.setItem("id", JSON.stringify(GIPHY.id_arr));
        GIPHY.show_favorite();
        GIPHY.show_favorite_number();


    },

    show_favorite_number: function(){
        GIPHY.id_arr = JSON.parse(localStorage.getItem("id"));
        if(GIPHY.id_arr===null){
            $("#favorite_items").text(0);
        } else {
            $("#favorite_items").text(GIPHY.id_arr.length);
        }
    }
}

$(document).ready(function(){
    GIPHY.show_favorite_number();
    GIPHY.make_buttons();
    $(document).on("click", "img", GIPHY.change_state);
    $(document).on("click", ".btn-data", GIPHY.button_click);
    $(document).on("click", ".add10", GIPHY.add_click);
    $(document).on("click", ".addFavorite", GIPHY.add_favorite);
    $(document).on("click", ".favorite", GIPHY.show_favorite);
    $(document).on("click", ".removeFavorite", GIPHY.remove_favorite);

    //removeFavorite
});



$("#submit").on("click", function(){
    event.preventDefault();


    var search = $("#input_search").val().trim();
    if(!search==""){
        GIPHY.topics.push(search);
        GIPHY.make_buttons();
        $("#input_search").val("");
    }
});