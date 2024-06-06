let hrs, hrs_raw, min, sec, result, output, bonk, temp, interim, arr, timeStampsMapSortedArray, newTranscript, styledScript;
let timeStampsMap = new Map(JSON.parse(localStorage.getItem('AGB_timeStamps')));
let H, W = document.documentElement.clientWidth - 16;
let player = document.getElementById("player");
let proceed = document.getElementById("proceed");
let fullWidthNum = document.documentElement.clientWidth, fullHeightNum = document.documentElement.clientHeight;
let settings = localStorage.getItem("AGB_settings") ??
	{stampsWidth: 45, playerHeight: 50, playerWidth: W, videoId: 'lQSEvjYqPtQ'};
let settingsMap = {};
window.addEventListener("resize", adjustWidth);
function onYouTubeIframeAPIReady() {}
async function launch() {
	w3.includeHTML();
	w3.hide("#toc"); w3.hide("#descr"); 
	howTo();
	let a = [['13:09','проблемах финансовой государства решили'],['13:11','зачем она на него скидываться дешевле'],['13:13','будет его скинуть Ну и вот так и'],['13:15','началась эта революция']];
	let b = JSON.stringify(a);
	newTranscript = localStorage.getItem("AGB_transcript") ?? b;
	subtitles.innerHTML = styleScript(newTranscript);
	displayTimeStampsMap(); 
	aside.style.width = settings.stampsWidth + "%";
	section.style.width = 99 - settings.stampsWidth + "%";
	H = (document.documentElement.clientHeight - 55 - settings.playerHeight) / (document.documentElement.clientHeight) * 100 + 'vh';
	main.style.height = H;
	newPlayer(settings.videoId);
}
function howTo() {
	w3.toggleShow("#tab"); w3.toggleShow("#subtitles"); w3.toggleShow("#toc"); w3.toggleShow("#descr"); 
	(proceed.value == "how to") ? proceed.value = "proceed" : proceed.value = "how to"
/* 	if (proceed.value == "proceed") {		w3.hide("#tab"); w3.hide("#subtitles"); w3.show("#toc"); w3.show("#descr"); proceed.value = "proceed";
	} else {
		w3.show("#tab"); w3.show("#subtitles"); w3.hide("#toc"); w3.hide("#descr"); proceed.value = "how to";
	} */
}
function adjustWidth() {
	player.setSize(document.documentElement.clientWidth - 16,settingsMap.playerHeight)
}
function newPlayer(x) {
	player = new YT.Player('player', {
		height: settings.playerHeight,
		width: settings.playerWidth,
		videoId: x,
 		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
		}
	});
	}
function sortTimeStampsMap() {
	timeStampsMapSortedArray = Array.from(timeStampsMap).sort();
	timeStampsMap = new Map(timeStampsMapSortedArray);
}
function secondsToStamp(seconds) {
	temp = Math.floor(seconds);
	hrs_raw = Math.floor(temp/3600);
	hrs = prefixizeNumeral(hrs_raw) + ":";
	if (temp >= 3600) temp -= (3600 * hrs_raw);
	min = prefixizeNumeral(Math.floor(temp/60)) + ":";
	sec = prefixizeNumeral(Math.floor(temp%60));
	return hrs + min + sec;
}
function prefixizeNumeral(numeral) {
	result = numeral.toString();
	if (numeral < 10) result = "0" + result;
	return result;
	}
function addTimeStamp(stamp) {
	if (stamp.length > 0) timeStampsMap.set(document.getElementById("paused").value,"");
	sortTimeStampsMap();
	displayTimeStampsMap();
}
function deleteTimeStamp(stamp) {
	timeStampsMap.delete(stamp);
	displayTimeStampsMap();
}
function updateTimeStamp(stamp,descr) {
	timeStampsMap.set(stamp,descr);
	displayTimeStampsMap();
}
function exportToLocalStorage() {
	timeStampsMap.set("","");
	localStorage.setItem("AGB_timeStamps",JSON.stringify(Array.from(timeStampsMap)));
	localStorage.setItem("AGB_settings",JSON.stringify(Array.from(timeStampsMap)));
}
function copyToClipBoard() {
	result = '';
	timeStampsMap.forEach((descr, stamp) => {
		(stamp.startsWith("00:")) ? temp = stamp.substr(3, 5) : temp = stamp;
		result += `${temp} – ${descr}\r`;
	})
	navigator.clipboard.writeText(result);
}
function clearTimeStampsMap() {
	timeStampsMap.clear();
	displayTimeStampsMap();
}
function stampToTime(stamp) {
	arr = stamp.split(":")
	return Number.parseInt(arr[0])*3600+Number.parseInt(arr[1])*60+Number.parseInt(arr[2]);
}
function setTimeStamp(stamp) {
	bonk = prefixizeString(stamp);
	//player.getCurrentTime() = stampToTime(bonk);
	player.seekTo(stampToTime(bonk));
	document.getElementById("paused").value = bonk;
}
function prefixizeString(str) {
	if (str.length == 5) output = '00:' + str;
	else if (str.length == 4) output = '00:0' + str;
	else output = str;
	return output;
}
function pasteFromClipBoard() {
	navigator.clipboard.readText().then(clipboardText => {
		localStorage.setItem("AGB_transcript",clipboardText);
		script.innerHTML = styleScript(clipboardText);
		
		})
}
function displayTimeStampsMap() {
	tab.innerHTML = "";
	timeStampsMap.forEach((descr, stamp) => {
		if (stamp.length > 0) {
		tab.innerHTML += 
 		`<p><span class="w3-blue w3-badge w3-hover-green" onclick="deleteTimeStamp('${stamp}')">del</span>&nbsp;&nbsp;
		<span onclick="player.getCurrentTime()=stampToTime(this.value);
			document.getElementById('paused').value=this.value">${stamp}</span>&nbsp;—&nbsp;
		<span onblur="updateTimeStamp('${stamp}',this.innerText)" contenteditable>${descr}</span></p>
		`; 
		}
	});
}
function styleScript(x) {
	//let subtitlesArray = JSON.parse(x);
	//x.forEach();
	return x.replace(/([0-9]+)(:)([0-9:]+)/g,
		`</span><input type="button" onclick="setTimeStamp('$1$2$3')" value="$1$2$3" class="w3-green w3-badge w3-hover-blue" style="border:0"><span id="_$1_$3">`);
}
/*function pasteFromClipBoard() {
	navigator.clipboard.readText().then(clipboardText => {
			styledScript = 
				clipboardText.replace(/([0-9]+:[0-9:]+)/g,
				`<span onclick="setTimeStamp('$1')" title="$1" class="w3-green w3-badge">&nbsp;</span>`);
				script.innerHTML = styledScript;
				localStorage.setItem("AGB_transcript",styledScript);
		})
} */
function px2percent(px) {
	return Math.round(px*100/fullWidthNum)-1;
}
function px2percent_(px) {
	return 100 - Math.round(px*100/fullWidthNum)-1;
}
function dragVert() {
	window.event.preventDefault();
	document.onmousemove = elementDragVert;
	document.onmouseup = closeDragElementV;
	function elementDragVert() {
		section.style.width = px2percent_(window.event.clientX) + '%';
		aside.style.width = px2percent(window.event.clientX) + '%';
}
	function closeDragElementV() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
function dragHor() {
	window.event.preventDefault();
	document.onmousemove = elementDragHor;
	document.onmouseup = closeDragElementH;
	function elementDragHor() {
		interim = window.event.clientY - 18;
		player.setSize(W, interim)
		settingsMap.playerHeight = interim;
		main.style.height = (document.documentElement.clientHeight - 55 - interim) / 
			(document.documentElement.clientHeight) * 100 + 'vh';
	}
		function closeDragElementH() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
function onPlayerReady(event) {
	play_pause.removeAttribute('disabled')
	showTime();
}
function onPlayerStateChange(event) {
	setInterval(showTime, 1000);
	if (player.getPlayerState() == 1) { play_pause.value = "pause";  } else {play_pause.value = "play"};
}
function showTime() {
	x0 = Math.floor(player.getCurrentTime());
	x1 = secondsToStamp(x0);
	paused.value = x1;
	if (follow.value == "⇒") {
		let x2 = x1.replace(/0{0,1}0:0{0,1}/,'');
		let x3 = '_' + x2.replace(/:/g,'_');
		let x4 = document.getElementById(x3);	
		if (x4 != null) x4.scrollIntoView();
	}
}
/*
function running(x0) {
	let x1 = secondsToStamp(x0);
	document.getElementById('paused').value = x1;
	if (follow.value == "⇒") {
		let x2 = x1.replace(/0{0,1}0:0{0,1}/,'');
		let x3 = '_' + x2.replace(/:/g,'_');
		let x4 = document.getElementById(x3);	
		if (x4 != null) x4.scrollIntoView();
	}
}

function parseMe() {
	player.videoId = url.value.split(/[=&]/)[1];
}
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: settings[1],
		width: W,
		videoId: 'I7z6a6axg-c',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
		}
	});
}

function getPlayerSrc(x) {
	return `http://www.youtube.com/embed/${x}?enablejsapi=1`;
}

function pasteFromClipBoard() {
	navigator.clipboard.readText().then(clipboardText => {
		script.innerHTML = styleScript(clipboardText);
		localStorage.setItem("AGB_transcript",clipboardText);
		})
}

function styleScript(script) {
	return script.replace(/([0-9]+)(:)([0-9:]+)/g,
		`</span><input type="button" onclick="setTimeStamp('$1$2$3')" value="$1$2$3" class="w3-green w3-badge w3-hover-blue" style="border:0"><span id="_$1_$3">`);
}



*/