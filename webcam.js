var bla;
(function() {
	var width = 400;
	var height = width / (4 / 3);
	var streaming = false;
	var video;
	var canvas;
	var context;
	var photo;
	var button;
	var mask;

	function start() {
		video = document.getElementById("video");
		video.width = width;
		video.height = height;
		video.style.backgroundColor = "#000";

		canvas = document.getElementById("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.backgroundColor = "#000";
		
		photo = document.getElementById("photo");
		photo.width = width;
		photo.height = height;
		photo.style.backgroundColor = "#000";

		mask = document.createElement("img");
		mask.src = "scary.png";

		frame = document.createElement("img");
		frame.src = "frame.png";

		button = document.getElementById("button");

		context = canvas.getContext("2d");

		streaming = true;

		function error() {
			console.log("ERROR: " + error);
		}

		function handleVideo(stream) {
			console.log("streaming...");
			video.src = window.URL.createObjectURL(stream);
		}

		function takePicture() {
			clear();
			context.drawImage(video, 0, 0, width, height);
			context.globalCompositeOperation = "lighter";
			context.drawImage(mask, 40, height/4, width/3, height/2);
			context.globalCompositeOperation = "multiply";
			context.drawImage(frame, 0, 0, width, height);

			var data = canvas.toDataURL('image/png');
			var img = data.replace(/^data:image\/(png|jpg);base64,/, "");
			photo.setAttribute('src', data);

			saveAndShare(img);

			video.style.display = "none";
			photo.style.display = "block";
			button.style.display = "none";
			button2.style.display = "block";
		}

		function tryAgain() {
			video.style.display = "block";
			photo.style.display = "none";
			button.style.display = "block";
			button2.style.display = "none";
			fb.style.display = "none";
		}

		function saveAndShare(img) {
			console.log("posting...");

			$.ajax({
				url: 'https://api.imgur.com/3/image',
				type: 'POST',
				headers: {
					Authorization: 'Client-ID ae206337920ab8c'
				},
				data: {
					type: 'base64',
					name: 'scary-test.jpg',
					title: 'Scary Test',
					description: 'Booohh!!!',
					image: img
				},
				dataType: 'json'
			}).success(function(result) {
				console.log("hey! " + JSON.stringify(result));

				//// Using the Sharer link
				// window.open("https://www.facebook.com/sharer/sharer.php?u=" + result.data.link, "facebook", "toolbar=no", "width=500", "height=350");
				
				//// Using the API
				var fb = document.getElementById("fb");
				bla = result;
				fb.setAttribute("data-href", result.data.link);
				FB.XFBML.parse(document.getElementById('fb-share-button'));
				console.log(result.data.link);
				console.log(fb);
				fb.style.display = "block";
			}).error(function(error) {
				console.log("vish... " + JSON.stringify(error));
			});
		}

		function clear() {
			context.globalCompositeOperation = "source-over";
			context.fillStyle = "#000";
			context.fillRect(0, 0, width, height);
		}

		button.addEventListener("click", takePicture);
		button2.addEventListener("click", tryAgain);

		navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		navigator.getUserMedia({ video: true }, handleVideo, error);
	};

	window.addEventListener("DOMContentLoaded", start);
})();