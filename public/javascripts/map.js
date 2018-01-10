var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 0, lng: 150.644},
        zoom: 1
	});
}