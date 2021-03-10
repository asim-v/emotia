function load_view(index){
	views = document.getElementsByClassName('view');

	for (var i = views.length - 1; i >= 0; i--) {
		if(i!=index){
			views[i].style.opacity="0";
			views[i].style.zIndex="-1";
		}else{
			views[i].style.opacity="1";
			views[i].style.zIndex="1";
		}
	}
}

function load_slide(index){
	views = document.getElementsByClassName('slide');

	for (var i = views.length - 1; i >= 0; i--) {
		if(i!=index){
			views[i].style.opacity="0";
			views[i].style.zIndex="-1";
		}else{
			views[i].style.opacity="1";
			views[i].style.zIndex="1";
		}
	}
}

var slide = 0;
function next_slide(){
	views = document.getElementsByClassName('slide');
	if(views.length > slide+1){
		slide += 1;
		load_slide(slide);
	}
	
}
function past_slide(){
	views = document.getElementsByClassName('slide');
	if(slide-1 >= 0){
		console.log(views.length);
		slide -= 1;
		load_slide(slide);
	}
}

function compress_menu(){
	var m = document.getElementById('menu');
	m.style.width = "33%";
	m.style.left = "10%";
}
function expand_menu(){
	var m = document.getElementById('menu');
	m.style.left = "50%";
	m.style.width="100%";
}
function blur_bg(){
	var d = document.getElementById('webgl');
	d.classList.add('blur-filter');
}
function  clear_bg(){
	var d = document.getElementById('webgl');
	d.classList.remove('blur-filter');
}

function test_game(){
	console.log('testing!');
	load_view(1);
	load_slide(0);
	clear_bg();

}
function start_game(){
	load_view(0);
	
	console.log('gamin!');
	expand_menu();
	blur_bg();
}

load_view(0);