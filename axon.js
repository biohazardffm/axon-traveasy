(function() {

    //call the UI page "home"
    App.load('home');

    setInterval(function() {
        $.getJSON("http://localhost:8080/nervousnet-api/raw-sensor-data/GPS", function(data) {
            $("#sensordata").html(JSON.stringify(data));
        });
    }, 1000);

		function getBeaconData() {
			$.getJSON("http://localhost:8080/nervousnet-api/raw-sensor-data/Beacon", function(data) {
				$.post("http://localhost:8080/nervousnet-api/log", JSON.stringify(data));
				$("#beacon").html(JSON.stringify(data));
			});
		}

		setInterval(function() {
			getBeaconData();
		}, 1000);

		setTimeout(function() {
			$.getJSON("http://localhost:8080/nervousnet-api/deviceid", function(data) {
				$("#uuid").html(JSON.stringify(data));
			});
		}, 1000);

})();
