(function() {

    //call the UI page "home"
    App.load('home');

		function getBeaconData() {
			$.getJSON("http://localhost:8080/nervousnet-api/raw-sensor-data/Beacon", function(data) {
				// $.post("http://localhost:8080/nervousnet-api/log", JSON.stringify(data));
				$("#beacon").html(JSON.stringify(data));
				processBeacons(data);
			});
		}

		// setInterval(function() {
		// 	getBeaconData();
		// }, 1000);

		setTimeout(function() {
			getBeaconData();
		}, 1000);

		var deviceid = "";

		setTimeout(function() {
			$.getJSON("http://localhost:8080/nervousnet-api/deviceid", function(data) {
				$("#uuid").html(JSON.stringify(data));
				deviceid = data["uuid"];
			});
		}, 900);

		// find the closest beacon and send for processing
		function processBeacons(beacons) {
			var dist = 99;
			var cb = {};
			for(var i = 0; i < beacons.length; ++i) {
				var b = beacons[i];
				if(b.accuracy > 0 && b.accuracy < dist) {
					dist = b.accuracy;
					cb = b
				}
			}
			var folder = "outside";
			if(dist < 1) {
				folder = "inside";
			}
			var url = "http://192.168.43.78.xip.io:3000/"+ folder +"/"+ cb.uuid +"/"+ deviceid;
				// $.getJSON(url, function(response) {
				// 	$.post("http://localhost:8080/nervousnet-api/log", JSON.stringify(response));
				// 	$("#response").html(JSON.stringify(response));
				// });

				if(cb.uuid && dist < 10) {
					$.ajax({
						url: url,
						async : false
					})
					.done(function(data) {
						$("#response").html(JSON.stringify(data));
						Object.keys(data).forEach(function(key) {
							var bb = data[key];
							if(bb.used === "") {
								$("#"+ key).css("background-color", "green");
							} else if(bb.used === deviceid) {
								$("#"+ key).css("background-color", "yellow");
							} else {
								$("#"+ key).css("background-color", "red");
							}
						});
					})
					.fail(function( jqXHR, textStatus, errorThrown ) {
						$("#response").html(textStatus);
					});
				}

				setTimeout(function() {
					getBeaconData();
				}, 1000);
		}

})();
