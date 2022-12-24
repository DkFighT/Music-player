var adapt_height = document.getElementById('image');
adapt_height.style.minHeight = `${adapt_height.clientWidth}px`;
adapt_height.style.maxHeight = `${adapt_height.clientWidth}px`;

window.addEventListener('resize', (e) => {
	let adapt_height = document.getElementById('image');
	adapt_height.style.minHeight = `${adapt_height.clientWidth}px`;
	adapt_height.style.maxHeight = `${adapt_height.clientWidth}px`;
});

const rangeInputs = document.querySelectorAll('input[type="range"]')

function handleInputChange(e) {
  let target = document.getElementById('time_line');
  const min = target.min;
  const max = target.max;
  const val = target.value;
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
}

var flag = false;
var audio = document.getElementsByTagName('audio')[0];
var video = document.getElementsByTagName('video')[0];
var track_time = 0;
let st;
var second = 0;
var songs;
var pl_ps = document.getElementById('play_pause').style;

var counter = 0;
var jsmediatags = window.jsmediatags;

var visual = false;
var context, analizer, source, array;
var circl = document.getElementById('circle').style;

rangeInputs.forEach(input => {
  input.addEventListener('input', (e) => {
	let target = document.getElementById('time_line');
  	const min = target.min;
  	const max = target.max;
  	const val = target.value;
  	target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
	audio.currentTime = val / 10;
	second = audio.currentTime * 10;
  })
})
rangeInputs.forEach(input => {
	input.addEventListener('input', (e) => {
	  let target = document.getElementById('volume');
		const min = target.min;
		const max = target.max;
		const val = target.value;
		target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
		audio.volume = parseFloat(target.value, 10) / 100;
	})
  })

// 
async function getFiles() {
	return new Promise((resolve, reject) => {
	eel.imp_files()((ret)=>{
	resolve(ret);
	});
	})
}
async function getSongs(){
	return new Promise((resolve, reject) => {
	eel.imp_names()((ret)=>{
	resolve(ret);
	});
	})
}
// Следующая песня
async function next_song(){
	songs = await getFiles();
	counter += 1;
	if(counter >= songs.length){
		counter = 0;
		audio.src = 'http://localhost:8000/'+songs[0];
		console.log(counter)
	}
	else{
		audio.src = 'http://localhost:8000/'+songs[counter];
	}
	title_();
	second = 0;
	deg = 0;
	flag = false;
	clearInterval(st);
	start_play();
	audio.play();
}
audio.addEventListener("ended", async function() {
	next_song();
});
// Предыдущая песня
async function pre_song(){
	songs = await getFiles()

	counter -= 1;
	if(counter < 0){
		counter = 0;
		audio.src = 'http://localhost:8000/'+songs[0];
	}
	else{
		audio.src = 'http://localhost:8000/'+songs[counter];
	}
	title_();
	second = 0;
	deg = 0;
	flag = false;
	clearInterval(st);
	start_play();
	audio.play();
}
// Первая песня
async function first_song(){
	songs = await getFiles()
	audio.src = 'http://localhost:8000/'+songs[0];
	title_();
	second = 0;
	flag = false;
	clearInterval(st);
}
function open_folder(){
	alert('После добавления музыки обновите плеер(F5) или перезагрузите его');
	eel.open_dir()();
	close_right_menu();
}

// 

function title_(){
	jsmediatags.read(audio.src, {
		onSuccess: function(tag) {
			document.getElementById('song').innerHTML = tag.tags.title;
			document.getElementById('artist').innerHTML = tag.tags.artist;

			let el1 = document.getElementById('image1').style;
			let el2 = document.getElementById('pos').style;
			var image = tag.tags.picture;
			if (image) {
				var base64String = "";
				for (var i = 0; i < image.data.length; i++) {
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," +
						window.btoa(base64String);
				el1.background = `url(${base64})`;
				el1.backgroundSize = 'cover';
				el1.backgroundPosition = 'center'
				el2.background = `url(${base64})`;
				el2.backgroundSize = 'cover';
				el2.backgroundPosition = 'center'
			} else {
				el1.background = `url(../resources/audio-cassette-minimalist-ec-2048x1152.jpg)`;
				el1.backgroundSize = 'cover';
				el1.backgroundPosition = 'center'
				el2.background = `url(../resources/audio-cassette-minimalist-ec-2048x1152.jpg)`;
				el2.backgroundSize = 'cover';
				el2.backgroundPosition = 'center'
			}
		},
		onError: function(error) {
		console.log(error);
		}
	});
}

audio.addEventListener('loadedmetadata', function() {
	if(Math.floor(audio.duration % 60) < 10){
		document.getElementById('end').innerHTML = Math.floor(audio.duration / 60) + ':0' + Math.floor(audio.duration % 60);
	}
	else{
		document.getElementById('end').innerHTML = Math.floor(audio.duration / 60) + ':' + Math.floor(audio.duration % 60);
	}
	document.getElementById('time_line').max = Math.floor(audio.duration) * 10;
});
function t(){
    if(Math.floor(audio.currentTime % 60) < 10){
		document.getElementById('start').innerHTML = Math.floor(audio.currentTime / 60) + ':0' + Math.floor(audio.currentTime % 60);
	}
	else{
		document.getElementById('start').innerHTML = Math.floor(audio.currentTime / 60) + ':' + Math.floor(audio.currentTime % 60);
	}
	document.getElementById('time_line').value = second;
	handleInputChange();
	second += 10;
}
var rotate = 0;
function pl_pause(ur){
	pl_ps.background = `url(${ur})`;
	pl_ps.backgroundColor = '#ddd';
    pl_ps.backgroundRepeat = 'no-repeat';
    pl_ps.backgroundSize = '80%';
    pl_ps.backgroundPosition = 'center';
	rotate += 360;
	pl_ps.transform = `rotate(${rotate}deg)`;
}
function start_play(){
	if(!flag){
		audio.play();
		pl_pause('../resources/pause-button.png');
		video.play();
		st = setInterval(t, 1000);
		flag = true;
		loop();
	}
	else{
		audio.pause();
		pl_pause('../resources/play.png');
		video.pause();
		clearInterval(st);
		flag = false;
		loop();
	}
}

function open_right_menu(){
	let right_menu = document.getElementById('right_menu');
	right_menu.style.left = '0';
}
function close_right_menu(){
	let right_menu = document.getElementById('right_menu');
	right_menu.style.left = '-100%';
}

function open_visual(){
	if(!visual){
		document.getElementById('visualiser').style.display = 'flex';
		if(!context){
			preparetion();
		}
		visual = true;
	}
	else{
		document.getElementById('visualiser').style.display = 'none';
		visual = false;
	}
	close_right_menu();
}

function preparetion(){
	context = new AudioContext();
	analizer = context.createAnalyser();
	source = context.createMediaElementSource(audio);
	source.connect(analizer);
	analizer.connect(context.destination);
	loop()
}
function loop(){
	if(!audio.paused)
	{
		window.requestAnimationFrame(loop);
	}
	array = new Uint8Array(analizer.frequencyBinCount);
	analizer.getByteFrequencyData(array)
	circl.height = (array[40])+'px';
	circl.width = (array[40])+'px';
}

// open playlist
var down_menu = false;
function open_playlist(){
	if(!down_menu){
		document.getElementById('down_menu').style.top = '0';
		load_playlist();
		down_menu = true;
	}
	else{
		document.getElementById('down_menu').style.top = '100%';
		delete_playlist();
		down_menu = false;
	}
}

function delete_playlist(){
	document.getElementById('down_menu').innerHTML = '';
}
var songs_mass = [];
async function load_playlist(){
	document.getElementById('down_menu').insertAdjacentHTML('afterbegin', `<button onclick="open_playlist()" class="x_btn2"></button>`);
	songs_mass = await getFiles();
	var count = 0;
	for(let i = 0; i < songs_mass.length; i++){
		jsmediatags.read('http://localhost:8000/'+songs_mass[i], {
			onSuccess: async function(tag) {
				count++;
				document.getElementById('down_menu').insertAdjacentHTML('beforeend', `<span id="${count}" class="playlist_list" onclick="play_this(this);">
					<div class="playlist_song_img" id="playlist_song_img${count}"></div>
					<div class="playlist_song_meta">
						<div class="playlist_song_title" id="playlist_song_title">${tag.tags.title}</div>
						<div class="playlist_song_artist" id="playlist_song_artist">${tag.tags.artist}</div>
					</div>
				</span>`);

				let el1 = document.getElementById(`playlist_song_img${count}`).style;
				let image = tag.tags.picture;
				if (image) {
					var base64String = "";
					for (var j = 0; j < image.data.length; j++) {
						base64String += String.fromCharCode(image.data[j]);
					}
					var base64 = "data:" + image.format + ";base64," +
							window.btoa(base64String);
					el1.background = `url(${base64})`;
					el1.backgroundSize = 'cover';
					el1.backgroundPosition = 'center';
				} else {
					el1.background = `url(../resources/audio-cassette-minimalist-ec-2048x1152.jpg)`;
					el1.backgroundSize = 'cover';
					el1.backgroundPosition = 'center';
				}
				var names_songs = await getSongs();
				var reso = audio.src;
				var split = reso.split('/');
				var file = split[split.length - 1];
				console.log(file)
				for(let j = 0; j < names_songs.length; j++){
					if(file === `${names_songs[j]}`){
						document.getElementById(`playlist_song_img${j + 1}`).innerHTML = `<div class='isplay'><div class="play_img"></div><div class="play_img"></div><div class="play_img"></div><div class="play_img"></div></div>`;
					}
				}
			},
			onError: function(error) {
				console.log(error);
			}
		});
	}
	count = 0;
	console.log(count);
}
async function play_this(song){
	let id_song = song.id;
	let songs_classes = document.querySelectorAll('.playlist_list');
	songs = await getFiles();
	audio.src = 'http://localhost:8000/'+songs[parseInt(id_song, 10) - 1];
	for(let i = 0; i < songs.length; i++){
		if(songs_classes[i].id != id_song){
			document.getElementById(`playlist_song_img${i + 1}`).innerHTML = ``;
		}
		else{
			document.getElementById(`playlist_song_img${id_song}`).innerHTML = `<div class='isplay'><div class="play_img"></div><div class="play_img"></div><div class="play_img"></div><div class="play_img"></div></div>`;
		}
	}
	title_();
	second = 0;
	deg = 0;
	flag = false;
	clearInterval(st);
	start_play();
	audio.play();
}
var volume_flag = false;
function show_volume(){
	if(!volume_flag){
		document.getElementById('volume').style.display = 'flex';
		volume_flag = true;
	}
	else{
		document.getElementById('volume').style.display = 'none';
		volume_flag = false;
	}
}