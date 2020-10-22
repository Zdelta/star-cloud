// console.clear();
	let canvas = document.querySelector('canvas');
	let context = canvas.getContext('2d');

	function rgba(triplet, opacity) {
		let args = triplet.map(a => Math.round(Math.max(0, Math.min(a, 255))));
		return `rgba(${args.join()},${opacity})`;
	}

	function gradient(opts) {
		let gradient = context.createRadialGradient(opts.x, opts.y, opts.r, opts.x, opts.y, 0);
		gradient.addColorStop(0, rgba(opts.color, 0));
		gradient.addColorStop(1, rgba(opts.color, opts.opacity || 1));
		context.fillStyle = gradient;
		context.fillRect(opts.x - opts.r, opts.y - opts.r, opts.r * 2, opts.r * 2);
	}
	let points = [];

	function drawLine() {
		for (let i = 0; i < points.length - 1; i++) {
			context.beginPath();
			context.moveTo(points[i].x, points[i].y);
			context.lineTo(points[i + 1].x, points[i + 1].y);
			context.strokeStyle = '#168bcf';
			context.stroke();
		}
	}

	function drawText() {
		context.font = "22px";
		context.textBaseline = "top";
		context.fillStyle = "white";
		for (let i = 0; i < points.length; i++) {
			context.fillText(points[i].name, points[i].x - 30, points[i].y - 5);
		}
	}

	function drawStar() {
		for (var i = 0; i < points.length; i++) {
			star(points[i]);
		}
	}

	function star(opts) {
		gradient({
			x: opts.x,
			y: opts.y,
			r: opts.r * 8 * Math.random(),
			color: opts.color,
			opacity: opts.opacity * 0.1,
		});
		gradient({
			x: opts.x,
			y: opts.y,
			r: opts.r * 4,
			color: opts.color,
			opacity: opts.opacity * 0.25,
		});
		gradient({
			x: opts.x,
			y: opts.y,
			r: opts.r,
			color: opts.color,
			opacity: opts.opacity,
		});
	}

	let pointsBackup;

	function canvasClick(event) {
		let clickX = event.pageX - canvas.getBoundingClientRect().left;
		let clickY = event.pageY - canvas.getBoundingClientRect().top;
		console.log(clickX, clickY);
		for (let i = points.length - 1; i >= 0; i--) {
			let circle = points[i];
			let distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2) + Math.pow(circle.y - clickY, 2));

			if (distanceFromCenter <= circle.r) {
				console.log(circle.r)
				alert(circle.name);
				return;
			}
		}

	}

	function mousemoveCircle(event) {
		let clickX = event.pageX - canvas.getBoundingClientRect().left;
		let clickY = event.pageY - canvas.getBoundingClientRect().top;

		for (let i = 0; i < points.length; i++) {
			let point = points[i];
			let distanceFromCenter = Math.sqrt(Math.pow(point.x - clickX, 2) + Math.pow(point.y - clickY, 2));
			if (distanceFromCenter <= point.r) {
				point.r = pointsBackup[i].r + 5;
				point.opacity = 0.9;
				point.color = [255, 255, 255];
				updateCanvas(point, i);
				break;
			} else {
				updateCanvas();
			}
		}
	}

	function updateCanvas(point, index) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawLine(point, index);
		drawText();
		for (let i = 0; i < pointsBackup.length; i++) {
			if (index === i) {
				star(point);
			} else {
				star(pointsBackup[i]);
			}
		}
	}

	canvas.onmousedown = canvasClick;
	canvas.onmousemove = mousemoveCircle;
