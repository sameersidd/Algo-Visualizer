var canvasEl = document.getElementById("chart").getContext("2d");
var buttonEl = document.getElementById("button");
var stopEl = document.getElementById("buttonStop");
let labels = [];
let values = [];

console.time("calc");
for (let i = 0; i < 99; i++) {
	labels.push(i);
	values.push(i + 1);
}
let shuffledvalues = (function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
})(values);
console.timeEnd("calc");

console.time("chart");
var chart = new Chart(canvasEl, {
	type: "bar",
	data: {
		labels: labels,
		datasets: [
			{
				data: shuffledvalues,
				backgroundColor: "red"
			}
		]
	},
	options: {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: false
		},
		scales: {
			yAxes: [
				{
					gridLines: {
						display: false,
						drawBorder: false
					},
					ticks: {
						display: false
					}
				}
			],
			xAxes: [
				{
					ticks: {
						display: false
					}
				}
			]
		},
		tooltips: {
			enabled: false
		}
	}
});
console.timeEnd("chart");
buttonEl.onclick = function() {
	this.disabled = true;
	sort(chart);
};

function sort(chartEl) {
	console.time("sort");
	let data = chartEl.data.datasets[0].data;
	let size = data.length;
	let timeouts = [];
	for (let i = 0; i < size - 1; i++)
		(function(i, data, size, timeouts, chartEl, window) {
			let num = window.setTimeout(function() {
				let min_idx = i;
				for (let j = i + 1; j < size; j++) {
					if (data[j] < data[min_idx]) {
						min_idx = j;
					}
				}
				let temp = data[min_idx];
				data[min_idx] = data[i];
				data[i] = temp;
				chartEl.data.datasets[0].data = data;
				chartEl.update();
			}, i * 1000);
			timeouts.push(num);
		})(i, data, size, timeouts, chartEl, window);
	console.log("Timeouts:", timeouts);
	console.timeEnd("sort");
}
