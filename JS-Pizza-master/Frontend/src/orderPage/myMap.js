var map;
var marker;
let renderer;

function initialize()	{
//Тут починаємо працювати з картою
    var mapProp = {
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom: 11
    };
    var html_element = document.getElementById("googleMap");
    map	= new google.maps.Map(html_element,	 mapProp);

    var point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
        position:	point,
        //map	- це змінна карти створена за допомогою new google.maps.Map(...)
        map:	map,
        icon:	"assets/images/map-icon.png"
    });

    google.maps.event.addListener(map, 'click',function(me){
        var coordinates	=	me.latLng;
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err)	{
                //Дізналися адресу
                $("#address").val(adress);
                $("#delivery-address").text(adress);
                calculateRoute(point, coordinates, function (err, time) {
                    if (!err) {
                        $("#delivery-time").text(time.duration.text);
                    } else {
                        $("#delivery-time").text("невідомий");
                    }
                })
            }	else	{
                $("#address").val("Немає адреси");
                $("#delivery-address").text("невідома")
            }
        })
    });

    var addr = document.getElementById("address");
    addr.onchange = function () {
        geocodeAddress($("#address").val(), function (err, coordinates) {
            if (!err) {
                calculateRoute(point, coordinates, function (err, time) {
                    if (!err) {
                        $("#delivery-time").text(time.duration.text);
                        // $("#delivery-address").text($("#address").val());
                        geocodeLatLng(coordinates, function (err, address) {
                            if (!err) {
                                $("#delivery-address").text(address);
                            }
                        })
                    } else {
                        $("#delivery-time").text("невідомий");
                        $("#delivery-address").text("невідома");
                        console.log("!!!")
                    }
                })
            } else {
                $("#delivery-time").text("невідомий");
                $("#delivery-address").text("невідома");
                console.log("Немає координат")
            }
        })
    };

    exports.point = point;
//Карта створена і показана
}
//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);

function	geocodeLatLng(latlng,	 callback){
//Модуль за роботу з адресою
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var adress =	results[1].formatted_address;
            callback(null,	adress);
        }	else	{
            callback(new	Error("Can't	find	adress"));
        }
    });
}

function	geocodeAddress(adress,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	adress},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can	not	find	the	address"));
        }
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(	status	===	google.maps.DirectionsStatus.OK )	{
            if (marker) {
                marker.setMap(null);
            }
            marker	=	new	google.maps.Marker({
                position:	B_latlng,
                map:	map,
                icon:	"assets/images/home-icon.png",
                zIndex: 100
            });
            if (renderer) {
                renderer.setMap(null);
            }
            renderer = new google.maps.DirectionsRenderer();
            renderer.setMap(map);
            renderer.setDirections(response);
            var leg	=	response.routes[	0	].legs[	0	];
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can	not	find	direction"));
        }
    });
}

exports.geocodeAddress = geocodeAddress;
exports.calculateRoute = calculateRoute;