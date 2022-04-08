var map = L.map('map').setView([19.284076,-99.1355524], 17);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1IjoibHVpc2pvc2U1IiwiYSI6ImNsMDc0dDVtMjAza3gzanM4d3J0ZnMzbzgifQ.NfkxFbGmErrf6AayBjmuXg'
}).addTo(map);

//Adding a marker
//L.marker([19.284076,-99.1355524], title='test').addTo(map);
console.log("a")
//AJAX solicitud 
$.ajax({
    dataType: 'json',
    url: 'api/bicicletas',
    success: function(res){
        console.log(res)
        res.bicicletas.forEach(function(bici){
            console.log(bici)

            /*
            GeoJSON Objects
            To calculate geometry over an Earth-like sphere, store your location data as GeoJSON objects.

            To specify GeoJSON data, use an embedded document with:

            a field named type that specifies the GeoJSON object type and
            a field named coordinates that specifies the object's coordinates.

            If specifying latitude and longitude coordinates, list the longitude first and then latitude:

            Valid longitude values are between -180 and 180, both inclusive.
            Valid latitude values are between -90 and 90, both inclusive.
            */

            L.marker([bici.ubicacion[1],bici.ubicacion[0]], title=bici.code).addTo(map);
        })
    }
})

