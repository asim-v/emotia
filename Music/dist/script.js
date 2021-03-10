/* Generative ambient music thing */
var ratios = [ 9/8, 6/5, 4/3, 3/2 ];

var ac = new (AudioContext||webkitAudioContext)();
var master = ac.createGain();
var chords = [];
master.connect(ac.destination);
master.gain.value = 0.001;

var reverbIR = (function(){
  var decay = 7;
  var duration = 9;
  var len = ac.sampleRate * duration;
  var buffer = ac.createBuffer(2, len, ac.sampleRate );
  var ch1 = buffer.getChannelData(0);
  var ch2 = buffer.getChannelData(1);
  for (var i = 0; i < len; i++) {
    ch1[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    ch2[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buffer;
}());

var getRMS = (function(){
  var analyser = ac.createAnalyser();
  analyser.fftSize = 128;
  var buffer = new Float32Array(analyser.fftSize);
  master.connect(analyser);
    
  return function(){
    analyser.getFloatTimeDomainData(buffer);
    var rms = 0;
    for (var i = 0; i < buffer.length; i++) {
      rms += buffer[i];
    }
    rms /= buffer.length;
    rms = Math.sqrt(rms);
    return rms||0;
   }
}());

var reverb = ac.createConvolver();
reverb.buffer = reverbIR;
reverb.connect(master);

function createSynthVoice(t, f, v, a,d){
  v = v || 1;
  t = t || ac.currentTime + 0.1;
  a = a || 0;
  d = d || 1;
  f = f || 220;
  
  var lfo = ac.createOscillator();
  lfo.frequency.value = 2 + Math.random() * 2;
  var lg = ac.createGain();
  lg.gain.value = 0.3 + Math.random() * 3;
  lfo.connect(lg)
  lfo.start(t);

  var o = ac.createOscillator();
  o.type = 'square';
  o.frequency.value = f;
  o.start(t);
  
  lg.connect(o.frequency);
  
  //amp
  var g = ac.createGain();
  o.connect(g);
  if ( a === 0 ){
    g.gain.setValueAtTime(v,t);    
  } else {
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(v, t+a)  
  }
  g.gain.linearRampToValueAtTime(0, t+a+d);
  //filter
  var bf = ac.createBiquadFilter();
  bf.type = "lowshelf";
  bf.frequency.setValueAtTime(100,t);
  bf.frequency.linearRampToValueAtTime(1000,t+a);
  
  bf.gain.value = 25;
  g.connect(bf);
  
  
  bf.connect(reverb);
   
}

function chord(t,rootFreq){
  var r1 = ratios[Math.round(Math.random()*(ratios.length-1))];
  var r2 = ratios[Math.round(Math.random()*(ratios.length-1))];
  
  if ( r1 === r2 ){
    r2 *= 2;
  }
  
  chords.push([t,rootFreq, rootFreq * r1, rootFreq * r2])
  createSynthVoice(t,rootFreq, 1, 9,8);
  createSynthVoice(t,rootFreq * r1, 1, 9,8);
  createSynthVoice(t,rootFreq * r2, 1, 9,8);
}

function initAudio(){

  var ct = ac.currentTime;
  for ( var i = 0; i < 20; i++ ){
    chord(ct + i * 12, 220);
  }

  createSynthVoice(ct, 55, 0.5, 0.9,20);
  createSynthVoice(ct + 12, 55 * 1.5, 0.5, 0.9,20);

  function scrambleSort(){
    return Math.random() < 0.5 ? -1 : 1;
  }

  function melomaker(){
    var lenIter = 12 * 2;

    for ( var i = 0; i < 100; i++ ){
      var nl = [2,8,12,4,1].sort(scrambleSort)[0];
      var fq = 880 * ratios.sort(scrambleSort)[0]
      createSynthVoice(ct+lenIter, fq, 0.9, 0.1,nl);
      lenIter += nl;
    }
  }

  melomaker();
  //initAnimation();
}

// <canvas id="canvas" width="500" height="500"></canvas>

function initViz(){
  var gc = canvas.getContext( '2d' );
  var onResize = function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.onresize = onResize;
  onResize();
  var w, h, cX, cY, t, i, r;
  
  (function animate(){
    requestAnimationFrame( animate );
  
    t = Date.now();
    w = canvas.width;
    h = canvas.height;
    
    cX = w / 2;
    cY = h / 2;
    r = Math.max(cX,cY);
    gc.fillStyle = 'rgba(0,0,0,1)';
    gc.fillRect(0,0,w,h);
    
    var rms = getRMS();
    var len = chords.length;
    gc.fillStyle = gc.strokeStyle = '#fff';

    for( var i = 0; i < len; i++ ){
      var c = chords[i];
 
      for ( var j = 1; j < 4; j++ ){
        gc.beginPath();
        gc.arc(30+(i/len)*w, (1-(c[j])/880) * h, h * 0.0025, 0, 2 * Math.PI, false);
        gc.fillStyle = 'rgba(255,255,255,'+Math.max(0.2,Math.max(0.2,ac.currentTime - c[0]))+')';
        gc.lineWidth = 0.4;//rms * 1 + (ac.currentTime > c[0] ? 1 : 0);
        gc.fill();
      }
 
     
    }
   

  }());
}
if ( navigator.userAgent.match(/iPhone|iPad|iPod/i) ){
  document.body.addEventListener('touchend', initAudio, false);
} else {
  initAudio();
  // initViz();
}