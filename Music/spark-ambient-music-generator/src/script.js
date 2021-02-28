const DURATION = 2.5;

let init = Math.floor(Math.random() * scales.length);
var scale = scales[init];
var display = document.getElementById("scale");

var interval = 700 + Math.random()*300;
var period = Math.random();
var period2 = Math.random();
var period3 = Math.random();

var widenessLFOspeed = Math.random() * 0.001;
var filterLFOspeed = Math.random() * 0.001;

const offsets = [ 0, 3, 4, 7];
var offset = offsets[0];

var oscTypes = ["sine", "square", "sawtooth"];

display.innerText = scale.name.split("").reduce((a, b)=>{ return Math.random() > 0.5 ? a + b : a }, "Track: ");
function generateNotes(scalemap) {
	period = Math.random();
	period2 = Math.random();
  var rootNote = Math.floor(42 + Math.random()*12);
  var range = 12 + Math.random()*18;
  let notes = [];
  for(let i = 0; i<range; i++) {
    notes.push(rootNote)
    const inc = scalemap[i%scalemap.length];
    rootNote += inc;
  }   
  return notes;
}

var notes = generateNotes(scale.semitones);

function reset() {
  m.panic();
	vincent.attack = 0.2 + Math.random() * 2;
	vincent.decay = Math.random() * 2;
  vincent.sustain = 0.3 + (Math.random() *0.2);
	vincent.release = 1 + Math.random() * 2;
	vincent.oscillatorType = oscTypes[Math.floor(Math.random()*oscTypes.length)];
	interval = 800 + Math.random()*300;
  scale = scales[Math.floor(Math.random()*scales.length)];
  display.innerText = scale.name.split("").reduce((a, b)=>{ return Math.random() > 0.5 ? a + b : a }, "Track: ");
  notes = generateNotes(scale.semitones);
  index = 0;
  widenessLFOspeed = Math.random() * 0.001;
  filterLFOspeed = Math.random() * 0.001;
  vincent.effects[1].effect.delayTime.value = Math.random()*8;
  vincent.effects[1].feedback.gain.value = Math.random()*0.8;
	vincent.effects[1].wet.value = Math.random();
}

window.addEventListener("click", ()=>{
	reset();
})

function procTick (note, index) {
  console.log(vincent.voices[note])
	if(note && !vincent.voices[note]) {
		const vel = Math.floor(70+((Math.sin(index*period3))*30));
    const note_on = Mizzy.Generate.NoteEvent(Mizzy.NOTE_ON, note, vel);
    m.sendMidiMessage(note_on, 1);
    const note_off = Mizzy.Generate.NoteEvent(Mizzy.NOTE_OFF, note, 0);
    setTimeout(()=> m.sendMidiMessage(note_off, 1), interval - 50)
	} else {
    const note_off = Mizzy.Generate.NoteEvent(Mizzy.NOTE_OFF, note, 0);
    m.sendMidiMessage(note_off, 1);
            //vincent.voices[note].ampEnvelope.gain.value = 0;
    delete vincent.voices[note];
  }
}

var index = 0;

setInterval(()=>{
	reset();
}, 1000*(60*DURATION));



setTimeout(()=>{
	play();
}, interval);

	function play() {
		setTimeout(()=>{
				play();
			}, interval);
			if(Math.random()>Math.cos(index*period)) {
					var selection = Math.floor(0.5*(1+Math.sin(index*period2))*(notes.length));
  				procTick(notes[selection], index);
          if(offset>0){ 
            
            procTick(notes[(selection+offset)%notes.length]-12, index);
                       }  
				} else {
          if(Math.random() > 0.7) {
            var selection = Math.floor(Math.random()*(notes.length));
  				procTick(notes[selection], index);  
          } else if (Math.random() < 0.1) {
            console.log("fat")
            var selection = Math.floor(Math.random()*(notes.length));
            procTick(notes[(selection+3)%notes.length]-24, index);
            procTick(notes[(selection+5)%notes.length]-24, index);
            procTick(notes[(selection+7)%notes.length]-24, index);
          }
          
          
        }
  		index = (index+1)%notes.length;
	}


	var Audio = new (window.AudioContext || window.webkitAudioContext)();
	var vincent = new Scream.Synths.Vincent(Audio, 2, "sawtooth", 0.1);
	vincent.addEffect(Scream.Effects.Filter);
	vincent.addEffect(Scream.Effects.Delay);
	vincent.addEffect(Scream.Effects.Reverb);
	vincent.attack = 1
	vincent.decay = 1
  vincent.sustain = 1
	vincent.release = 1
	vincent.output.gain.value = 0.08;
	vincent.connectEffects();

	vincent.effects[1].feedback.gain.value = 0.4;
	vincent.effects[1].wet.value = 0.3;
  
	var fft = new Scream.Effects.FFT(Audio);
		fft.mode = 1;
	fft.connect(Audio.destination);
	fft.draw();
	vincent.connect(fft.input)

// window.addEventListener("mousemove", (e)=>{
//   vincent.wideness = 1+(e.pageX / window.innerWidth) * 100;
//   vincent.effects[0].effect.frequency.value = 1000 + (e.pageY / window.innerHeight * 7600);
// })

setInterval(()=>{
  vincent.wideness = 1+Math.sin(performance.now()*widenessLFOspeed) * 50;
  vincent.effects[0].effect.frequency.value = 1000 + ((1+Math.cos(performance.now()*filterLFOspeed)) * 7600);
}, 60)


var m = new Mizzy(); 
	m.initialize().then(() => {
	//m.bindToAllInputs();
	m.bindToAllOutputs();
	m.bindKeyboard();
	m.keyToggleRange(0,127,(e) => {
		vincent.NoteOn(e);
	}, (e) => {
		vincent.NoteOff(e);
	}, 1);
});

function recalcTranspose () {
  console.log(offset);
  offset = offsets[Math.floor(Math.random()*offsets.length)];
  setTimeout(()=>recalcTranspose(), interval*16);
}


recalcTranspose();


var CanvasContainer = document.createElement("div");
document.getElementsByTagName("body")[0].appendChild(CanvasContainer);
fft.addToElement(CanvasContainer);
