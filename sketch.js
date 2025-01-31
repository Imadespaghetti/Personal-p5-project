let song; 
let angle =0;
let fft; // frequency
let amp ;
let num = 8; //number of boxes
let size = 15; // size of the boxes
let store = [];
let specs = [];
let farFromCent = []; // map location of frequency to the center of the cube 
let min = 180;

function preload() {
 song = loadSound("Prelude - bo en (1).mp3");
}

function setup(){
  createCanvas (800,800,WEBGL)
  song.play();
  amp = new p5.Amplitude();
  fft = new p5.FFT(); // analyzes the frquency of the sound and returns the result to waveform
  
   //stroke("white")
  for (let i=0; i<num; i++){
    store[i] = [];
    for (let j=0; j<num; j++){
      store[i][j] = []
      for(let k=0; k<num; k++){
       store[i][j][k] = floor(random(2));
        
        let offset = size/2 - num/2*size
        let x = i*size + offset;
        let y = j*size + offset;
        let z = k*size + offset;
        let distance = dist(x, y, z, 0, 0, 0)
        
        farFromCent.push({i, j, k, distance});
      }
 
    }
 
  }
  
  farFromCent.sort(compareDistance);
  
}

function compareDistance(a, b){ 
  return a.distance - b.distance; 
}

function draw(){
  background(0);
  orbitControl();
  
  specs = fft.analyze(); // Returns the frequency spectrum of the input signal
  let vol = fft.getEnergy(20, 140);
  if (vol> 40){
    stroke(255,255,0,20)
  } else {
    stroke(0,20)
  }
  
  
  let total = num*num*num;
  for (let i=0; i<total; i++){
    let pos = farFromCent[i];
    let c = map (specs[i], 0, 255, min, 255);
   store[pos.i][pos.j][pos.k] = c;
  }
  
  let ampLevel = amp.getLevel();
  let offset= size/2-num/2*size
  translate(offset,offset,offset,0,0);
  noFill();
  for (let i=0; i<num; i++){
    for (let j=0; j<num; j++){
      for(let k=0; k<num; k++){
        if (store[i][j][k]>min){
           fill(store[i][j][k], 0, 200);
        } else {
          noFill();
        }
      
        
        
        push()
        translate(i*size,j*size,k*size);
         rotateX (frameCount*0.1); // more visually intersting but causes it to lag
        rotateY (frameCount*0.1);  // more visually intersting but causes it to lag
        box(ampLevel*80,ampLevel*80,ampLevel*80);
        angle+=ampLevel*0.1
        pop()
      }
 
    }
 
  }

  
}