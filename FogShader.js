let img, canvas, sh, fogAmountSlider;

let fogColor = [0.8, 0.9, 1, 1];
let fogNear = 0.0;
let fogFar = 40.0;

function preload(){
  img = loadImage("textura.png");
}

function setup() {

  createCanvas(600, 400, WEBGL);
  fogNearLabel = createP('Fog Near');
  fogNearLabel.position(150, -5); 
  fogNearSlider = createSlider(0, 1, fogNear, 0.001); 
  fogNearSlider.position(10, 10); 
  
  createCanvas(600, 400, WEBGL);
  fogNearLabel = createP('Fog Far');
  fogNearLabel.position(150, 25); 
  fogFarSlider = createSlider(0, 1, fogFar, 0.001); 
  fogFarSlider.position(10, 40); 

  sh = createShader(vert, frag);

  shader(sh);

  sh.setUniform('uTexture', img);
  sh.setUniform('uFogColor', fogColor);

  noStroke();
}

function draw() {

  background(204, 229.5, 255, 1);

  fogNear = fogNearSlider.value(); // Obtener el valor actual del slider
  fogFar = fogFarSlider.value(); // Obtener el valor actual del slider

  sh.setUniform('uFogNear', fogNear);
  sh.setUniform('uFogFar', fogFar);

  for (let i = 0; i < 40; i++) {
    push();
    translate(-120 + i * 51, 0, 200 - i * 55); // Ajusta las coordenadas x y z según lo necesites
    rotateY(frameCount * 0.01+i*0.1);
    rotateX(frameCount * 0.01+i*0.1);
    box(50);
    pop();
  }

  if(fogNear > fogFar){
    fogNearSlider.attribute('disabled', ''); // Desactivar fogFarSlider si fogNear no es inferior
    fogNearSlider.value(fogFarSlider.value());
    fogNearSlider.removeAttribute('disabled'); // Activar fogFarSlider si fogNear es inferior

  }

}

const vert = `
  precision mediump float;

  attribute vec4 aPosition;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec2 vTexCoord;
  varying float vFogDepth;

  void main() {
    vec4 position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition);

    vFogDepth = position.z / position.w;

    vTexCoord = aTexCoord;
    
    gl_Position = position;
  }
`;

const frag = `
  precision mediump float;

  
  varying vec2 vTexCoord;
  varying float vFogDepth;
  
  uniform sampler2D uTexture;
  uniform vec4 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  void main() {
    vec4 col = texture2D(uTexture, vTexCoord);

    float fogAmount = smoothstep(uFogNear, uFogFar, vFogDepth);

    gl_FragColor = mix(col, uFogColor, fogAmount); 
  }
`;