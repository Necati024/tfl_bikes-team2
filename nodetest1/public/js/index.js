(function($){



var BikeStation = (function(){
 
    var coordinates = [];
    var vanRouteCoordinates = [];

 return {

    getBikeInformation: function(){

        var jsonResult = $.parseJSON($.ajax({
        url:  'http://bikes.generictestdomain.net/v1/station/all',
        dataType: "json", 
        async: false
    }).responseText);

            var markers = [];

       $.each(jsonResult.stations, function(index,smtg){
            coordinates.push([this.latitude, this.longitude, this.name, this.capacity, this.id]);
        });

       $.each(coordinates, function(index, val){

            var marker = Map.createMarker(val[0], val[1]);
            markers.push(marker);
            var info = Map.createInfoWindow([val[2], val[3]]);

            marker.setTitle(val[2]);


            google.maps.event.addListener(marker, 'click', function() {
            
            if(Map.isInfoWindowOpen(info))
            {
                info.close();
            }
            else{
                info.open(marker.get('map'), marker);
 
                }
            });
       });

       return markers;
        
    },

    getVanRoutes: function(id){


        var data = $.parseJSON($.ajax({
        url:  'http://bikes.generictestdomain.net/v1/route?date=1416934085&n=3&c=20',
        dataType: "json", 
        async: false
    }).responseText); // This will wait until you get a response from the ajax request.

    switch(id){
        case '0': return data.routes[0];break;
        case '1': return data.routes[1];break;
        case '2': return data.routes[2];break;
        }
    }

  };
}());


var Map = (function(){
 
 var map;

var image;

  return {

    setMarkerImage: function(){

       image  = new google.maps.MarkerImage("images/bike6.png", null, null, null, new google.maps.Size(32,32));

    },
    createMap: function(){


          var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map TFL&UCL"});


    map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(51.507399, -0.127755),
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    zoom: 15,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
   
  }); 

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

    return map;
},

  createMarker: function(lat, longit){

    var latLong = new google.maps.LatLng(lat, longit);

    var marker=new google.maps.Marker({
    position: latLong,
    map: map,
    flat: true,
    optimized: false,
    icon: image
        });

    return marker;

    },


  createInfoWindow: function(bikeInformation){
         

        if(bikeInformation.length == 2){
           
        var boxText = document.createElement("div");
        boxText.style.cssText = "border: 0px solid black; margin-top: 8px; background: linear-gradient(#4A4A4A, #2B2B2B); padding: 5px;";
        boxText.innerHTML = "<h5>Station: " + bikeInformation[0] +"</h5>  <style>h5{color:white}</style> <h5>Capacity: "+ bikeInformation[1]+"</h5>  <style>h5{color:white}";
        }
        else{
        var boxText = document.createElement("div");
        boxText.style.cssText = "border: 0px solid black; margin-top: 8px; background: linear-gradient(#4A4A4A, #2B2B2B); padding: 5px;";
         boxText.innerHTML = "<h5>Station: " + bikeInformation[0] +
                "</h5>  <style>h5{color:white} </style> <h5>Capacity: " + bikeInformation[1] +
                "</h5>  <style>h5{color:white} </style>"  + '<h5> Bikes here: ' + bikeInformation[2] +
                "</h5>  <style>h5{color:white} </style>" + '<h5> Arrival Time: ' + bikeInformation[3] +
                "</h5>  <style>h5{color:white} </style>";
        }
        
        var myOptions = {
         content: boxText
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-140, 0)
        ,zIndex: null
        ,boxStyle: 
        { 
           opacity: 0.90
          ,width: "280px"
         }
        ,closeBoxMargin: "10px 2px 2px 2px"
        ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: false
    };
        var infowindow = new InfoBox(myOptions);

        return infowindow;
    },

      isInfoWindowOpen: function(infoWindow){
    
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
},

      splitRoute: function(allStations){

        var arrays = [];
        var nb_arrays = Math.ceil((allStations.length)/9);


        for(var index = 0; index < nb_arrays; index++){
            arrays[index] = [];
            for(var i=index*9; i< (index*9)+9; i++)
            {
                if(allStations[i] != null){
                    arrays[index].push(allStations[i]);
                }
            }
        }

        return arrays;


},
    drawSubRoutes: function(stations){


        var directionsService = new google.maps.DirectionsService();

        var renderOptions = {
                preserveViewport: true,         
                suppressMarkers:true       
                };

        var directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

        directionDisplay.setMap(map);


       if(stations.length == 2){

        //set the starting address and destination address
        var originAddress = stations[0];
        var destinationAddress = stations[1];

        //build directions request
        var request = {
                    origin: originAddress,
                    destination: destinationAddress,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

        //get the route from the directions service
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionDisplay.setDirections(response);
            }
            else {
                console.log('some error');
            }
        });

       }
       else{
            
        var waypoints = [];

        var len = stations.length;

        for(var i =1; i< len-1; i++){

             var address = stations[i];

            if (address !== "") {
                waypoints.push({
                    location: address,
                    stopover: true
                });
            }
        }

        //set the starting address and destination address
        var originAddress = stations[0];
        var destinationAddress = stations[stations.length -1];

        //build directions request
        var request = {
                    origin: originAddress,
                    destination: destinationAddress,
                    waypoints: waypoints, //an array of waypoints
                    optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

        //get the route from the directions service
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionDisplay.setDirections(response);
            }
            else {
                console.log('some error');
            }
        });
       }




},

    drawVanRoute: function(routeCoordinates){

        var vanRoutes = [];
        var vanRoute = {};
        var lat_lng = new Array();

        var directionsDisplay;
        var directionsService;
        var stepDisplay;
        var markerArray = [];


        Object.keys(routeCoordinates).forEach(function(key){
            var value = routeCoordinates[key];

            vanRoute = {};
            
            vanRoute.capacity = value.capacity;
            vanRoute.latitude = value.latitude;
            vanRoute.longitude = value.longitude;
            vanRoute.key = key;
            vanRoute.usage = value.usage;
            vanRoute.name = value.station_name;
            vanRoutes.push(vanRoute);
        });

        var latlngbounds = new google.maps.LatLngBounds();

        for (i = 0; i < vanRoutes.length; i++) {
            var data = vanRoutes[i];
            var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);

            lat_lng.push(myLatlng);

            var marker = Map.createMarker(data.latitude, data.longitude);
            marker.setTitle(data.name);

            if(i==0){ 
                marker.setIcon(new google.maps.MarkerImage('images/start.png', null, null, null, new google.maps.Size(32,32)));   
            }
            if(i==vanRoutes.length -1){
                 marker.setIcon(new google.maps.MarkerImage('images/finish.png', null, null, null, new google.maps.Size(32,32)));   
            }

            var info = Map.createInfoWindow([data.name, data.capacity, data.usage]);

            var boxText = document.createElement("div");
            boxText.style.cssText = "border: 0px solid black; margin-top: 8px; background: linear-gradient(#4A4A4A, #2B2B2B); padding: 5px;";
            boxText.innerHTML = "<h5>Station: " + data.name+
                "</h5>  <style>h5{color:white} </style> <h5>Capacity: " + data.capacity+
                "</h5>  <style>h5{color:white} </style>"  + '<h5> Bikes here: ' + data.usage +
                "</h5>  <style>h5{color:white} </style>" + '<h5> Arrival Time: ' + data.key +
                "</h5>  <style>h5{color:white} </style>";

            marker.content = boxText;

            google.maps.event.addListener(marker, 'click', function() {

               info.setContent(this.content);
            
            if(Map.isInfoWindowOpen(info))
            {
                info.close();
            }
            else{
                info.open(this.get('map'), this);
 
                }
            });

            latlngbounds.extend(marker.position);

        }

        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);


        var splittedRoutes = Map.splitRoute(lat_lng);

        for(var j=0; j<splittedRoutes.length; j++){
            Map.drawSubRoutes(splittedRoutes[j]); 

        }


        Map.drawSubRoutes([splittedRoutes[0][8], splittedRoutes[1][0]]);
        Map.drawSubRoutes([splittedRoutes[1][8], splittedRoutes[2][0]]);
   
    }
};  
  
}());


    
    // Preloader     
    $(window).load(function() { 
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow'); 
        $('body').delay(350).css({'overflow':'visible'});
    }); 




    $(document).ready(function() {

    var routes1;
    var routes2;
    var routes3;
    var markers = [];


    Map.setMarkerImage();
    Map.map = Map.createMap();
    var markers = BikeStation.getBikeInformation();


        $("#myModal").on("hide", function() {    // remove the event listeners when the dialog is dismissed
            $("#myModal a.btn").off("click");
        });
        
        $("#myModal").on("hidden", function() {  // remove the actual elements from the DOM when fully hidden
            $("#myModal").remove();
        });
        
        $("#myModal").modal({                    // wire up the actual modal functionality and show the dialog
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true                     // ensure the modal is shown immediately
        });



    $("#firstContainer").load("searchBike.html");

    $(document).on('click','#searchbtn',function(){
            var something = $('input[type="text"]').val();
            var found = false;

            for(var i=0;i<markers.length; i++)
            {
                if(markers[i].title.indexOf(something) > -1){
                 // code for showing your object, associated with markers[i]

             Map.map.setCenter(markers[i].getPosition());
             Map.map.setZoom(15); 
             console.log(markers[i]);
            
             markers[i].setAnimation(null);
             markers[i].setAnimation(google.maps.Animation.BOUNCE);

             stopAnimation(markers[i]);
             found = true;
                    }
            }

            if(found==false){
                $('#myModal').modal('show');    
            }

    });

        function stopAnimation(marker) {
        setTimeout(function () {
            marker.setAnimation(null);
        }, 3000);
    }

        var countdown =  $('.countdown-time');

        // Open modal window on click
        $('#info').on('click', function(e) {
            var mainInner = $('.overlay'),
                modal = $('#' + $(this).attr('data-modal'));
                    
            mainInner.animate({opacity: 0}, 400, function(){
                $('html,body').scrollTop(0);
                modal.addClass('active').fadeIn(400);
                
            });
            e.preventDefault();

            $('.modal-close').on('click', function(e) {
                modal.removeClass('active').fadeOut(400, function(){
                    mainInner.animate({opacity: 1}, 400);
                    
                    countdown.on('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
                        countdown.removeClass('animated bounceIn');
                    });
                });
                e.preventDefault();
            });
        });

        // Tooltips
        $('.more-links a, .social a').tooltip();
    
        $('.more-links a, .social a').on('click', function () {
            $(this).tooltip('hide')
        });


        $(document).on('mouseover', '.routeButton span',  function (element) {       
         $(this).addClass('routeButtonHover');
        }).on('mouseout', '.routeButton span',  function () {       
         $(this).removeClass('routeButtonHover');
        });;


        $("#search").click(function() {

            $("#firstContainer").load("searchBike.html");
            $('html, body').animate({
        scrollTop: $("#firstContainer").offset().top
    }, 1500);
});

            $("#vanroute").click(function() {

            $("#firstContainer").load("routeChoice.html");
            $('html, body').animate({
        scrollTop: $("#firstContainer").offset().top
    }, 1500);
});


              $(document).on('click','#route0, #route1, #route2', function(){

                var id = $(this).attr('id');
                id = id.slice(-1);

                $('.routeButton span').removeClass('routeButtonActive');
                $(this).addClass('routeButtonActive');

                // make all the markers invisible
                 for(i=0;i<markers.length; i++){
                         markers[i].setVisible(false);
                                    }

                switch(id){
                    case '0': if(routes1 !== undefined) {Map.drawVanRoute(routes1);} 
                                else{   
                                    routes1 = BikeStation.getVanRoutes(id);
                                    Map.drawVanRoute(routes1);
                                }  break; 
                    case '1': if(routes2 !== undefined) {Map.drawVanRoute(routes2);} 
                                else{ 
                                    routes2 = BikeStation.getVanRoutes(id);
                                    Map.drawVanRoute(routes2);
                                }  break; 
                    case '2': if(routes3 !== undefined) {Map.drawVanRoute(routes3);} 
                                else{ 
                                    routes3 = BikeStation.getVanRoutes(id);
                                    Map.drawVanRoute(routes3); 
                                } break; 
                }
        });

     });

})(jQuery);