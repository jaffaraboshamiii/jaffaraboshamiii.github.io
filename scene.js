import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const MT = window.MT;
const MODEL_URL = 'dragon.glb';
const isMobile = () => innerWidth < 900;
const targetMaxDim = () => (isMobile() ? 2.1 : 2.5);   // dragon size: lower this number if it looks too big
const maxPixelRatio = () => (isMobile() ? 1.5 : 2);

const canvas = document.querySelector('#webgl');
let scene, camera, renderer, gltfModel, modelPivot, skinned, mixer, floorMesh;
let modelReady = false, modelAlpha = 0, floorY = -1.2;
const modelMats = [];
const clock = new THREE.Clock();
let bgMaterial;
const shaderUniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
  uMouse: { value: new THREE.Vector2(0, 0) },
  uScroll: { value: 0 }
};
let sparkParticles;
const sparkCount = 450;
const sparkData = [];
const sizes = { width: innerWidth, height: innerHeight };

function createSparkTexture() {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.3)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 16, 16);
  return new THREE.CanvasTexture(c);
}

function createSparks() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(sparkCount * 3);
  const colors = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 6.5;
    positions[i*3+1] = (Math.random() - 0.5) * 5.0 - 0.5;
    positions[i*3+2] = (Math.random() - 0.5) * 6.5;
    if (Math.random() < 0.6) {
      colors[i*3] = 0.62 + Math.random() * 0.12; colors[i*3+1] = 0.30 + Math.random() * 0.1; colors[i*3+2] = 0.88 + Math.random() * 0.1;
    } else {
      colors[i*3] = 1.0; colors[i*3+1] = 0.10 + Math.random() * 0.1; colors[i*3+2] = 0.05 + Math.random() * 0.08;
    }
    sparkData.push({
      speedX: (Math.random() - 0.5) * 0.4, speedY: 0.15 + Math.random() * 0.3, speedZ: (Math.random() - 0.5) * 0.4,
      swaySpeed: 0.5 + Math.random() * 1.5, swayRadius: 0.05 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2
    });
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, map: createSparkTexture() });
  sparkParticles = new THREE.Points(geometry, material);
  scene.add(sparkParticles);
}

function createBackgroundShader() {
  const vertexShader = `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `;
  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime; uniform vec2 uResolution; uniform vec2 uMouse; uniform float uScroll;
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
      float aspect = uResolution.x / uResolution.y;
      float time = uTime * 0.08;
      float scroll = uScroll;
      float angle1 = 0.6; float angle2 = -0.7; float angle3 = 1.2;
      float freq1 = 2.4; float freq2 = 3.2; float freq3 = 4.0;
      vec2 warpedUv = uv;
      float scrollDeform = scroll * 5.0;
      warpedUv.x += sin(uv.y * 2.5 + time * 0.2 + scrollDeform) * 0.35;
      warpedUv.y += cos(uv.x * 2.5 - time * 0.15 - scrollDeform * 0.8) * 0.35;
      warpedUv.x += sin(uv.y * 1.2 - time * 0.1 - scrollDeform * 1.5) * 0.25;
      warpedUv.y += cos(uv.x * 1.2 + time * 0.18 + scrollDeform * 1.2) * 0.25;
      vec2 scrollDrift = vec2(scroll * 0.04, -scroll * 0.02);
      vec2 mouseShift = vec2(uMouse.x * aspect * 0.05, uMouse.y * 0.05);
      warpedUv += scrollDrift + mouseShift;
      vec2 dir1 = vec2(cos(angle1), sin(angle1));
      vec2 dir2 = vec2(cos(angle2), sin(angle2));
      vec2 dir3 = vec2(cos(angle3), sin(angle3));
      float w1 = sin(dot(warpedUv, dir1) * freq1 + time * 1.0);
      float w2 = cos(dot(warpedUv, dir2) * freq2 - time * 1.4 + w1 * 0.4);
      float w3 = sin(dot(warpedUv, dir3) * freq3 + time * 1.8 + w2 * 0.5);
      float waveField = w1 * 0.50 + w2 * 0.35 + w3 * 0.15;
      float wideSheen = pow(max(0.0, 1.0 - abs(waveField - 0.1)), 2.5);
      float crispSpecular = pow(max(0.0, 1.0 - abs(waveField - 0.15)), 8.0);
      float crest = wideSheen * 0.5 + crispSpecular * 0.9;
      vec3 c0_shadow = vec3(0.027, 0.043, 0.141);
      vec3 c0_wave1  = vec3(0.075, 0.085, 0.250);
      vec3 c0_wave2  = vec3(0.045, 0.060, 0.190);
      vec3 c0_crest  = vec3(0.30, 0.15, 0.52);
      vec3 c1_shadow = vec3(0.027, 0.043, 0.141);
      vec3 c1_wave1  = vec3(0.110, 0.050, 0.200);
      vec3 c1_wave2  = vec3(0.070, 0.045, 0.165);
      vec3 c1_crest  = vec3(0.50, 0.09, 0.12);
      float t = smoothstep(0.0, 1.0, scroll);
      vec3 colShadow = mix(c0_shadow, c1_shadow, t);
      vec3 colWave1  = mix(c0_wave1, c1_wave1, t);
      vec3 colWave2  = mix(c0_wave2, c1_wave2, t);
      vec3 colCrest  = mix(c0_crest, c1_crest, t);
      vec3 color = colShadow;
      color = mix(color, colWave2, smoothstep(-0.6, 0.2, waveField));
      color = mix(color, colWave1, smoothstep(0.0, 0.8, waveField));
      color += colCrest * crest * 1.4;
      float vignette = 1.0 - dot(uv, uv) * 0.12;
      color *= vignette;
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  bgMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: shaderUniforms, depthWrite: false, depthTest: false });
  const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), bgMaterial);
  bgMesh.position.set(0.0, 0.0, -8.0);
  bgMesh.renderOrder = -10;
  camera.add(bgMesh);
}

function onWindowResize() {
  sizes.width = innerWidth; sizes.height = innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPixelRatio()));
  shaderUniforms.uResolution.value.set(sizes.width, sizes.height);
}

/* the clips in this file are cut from one long timeline, so shift each clip to start at 0 */
function normalizeClip(clip) {
  let t0 = Infinity;
  clip.tracks.forEach((t) => { if (t.times.length) t0 = Math.min(t0, t.times[0]); });
  if (isFinite(t0) && t0 > 0.001) {
    clip = clip.clone();
    clip.tracks.forEach((t) => { for (let i = 0; i < t.times.length; i++) t.times[i] -= t0; });
    clip.resetDuration();
  }
  return clip;
}

/* ======== dragon behaviour: it follows the scroll, never random ========
   landed (stand)  ->  scroll into a flight zone  ->  take-off (up) -> flying (wings follow the scroll speed)
   -> flight zone ends -> landing (down) -> landed again. Side phrases appear only once it has landed.
   Scroll positions below are fractions of the whole stage. */
const FLY_ZONES = [[0.09, 0.17], [0.38, 0.46], [0.67, 0.75]];
const ROARS = [[0.305, 'attack01'], [0.595, 'attack02']];
const acts = {}, wts = {};
let state = 'stand', curRoar = 'attack01', flyT = 0, prevS = 0, canFly = false;
const _v = new THREE.Vector3(), _mn = new THREE.Vector3(), _mx = new THREE.Vector3(), _inv = new THREE.Matrix4();
let anchor = new THREE.Vector3();

function startOnce(st, key) {
  const a = acts[key]; if (!a) return;
  a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.timeScale = 1; a.enabled = true; a.play();
  state = st;
}
function setupAnimations(gltf) {
  mixer = new THREE.AnimationMixer(gltfModel);
  const defs = { stand: /_stand$/i, up: /_up$/i, fly: /_fly2$/i, down: /_down$/i, attack01: /_attack01$/i, attack02: /_attack02$/i };
  for (const k in defs) {
    const clip = gltf.animations.find((c) => defs[k].test(c.name));
    if (!clip) continue;
    const a = mixer.clipAction(normalizeClip(clip));
    acts[k] = a; wts[k] = k === 'stand' ? 1 : 0;
    a.setEffectiveWeight(wts[k]); a.play();
  }
  if (!acts.stand && gltf.animations[0]) {            // unknown file: just loop its first clip
    acts.stand = mixer.clipAction(normalizeClip(gltf.animations[0])); wts.stand = 1; acts.stand.play();
  }
  canFly = !!(acts.fly && acts.up && acts.down);
  if (acts.fly) acts.fly.timeScale = 0;               // flap time is driven by the scroll speed
  mixer.addEventListener('finished', (e) => {
    if (e.action === acts.up && state === 'up') state = 'fly';
    else if (e.action === acts.down && state === 'down') state = 'stand';
    else if (state === 'roar' && (e.action === acts.attack01 || e.action === acts.attack02)) state = 'stand';
  });
}
function tickAnimation(dt, s) {
  const inFly = canFly && FLY_ZONES.some(([a, b]) => s >= a && s < b);
  if (inFly && (state === 'stand' || state === 'roar' || state === 'down')) startOnce('up', 'up');
  else if (!inFly && (state === 'fly' || state === 'up')) startOnce('down', 'down');
  else if (state === 'stand') {
    for (const [at, key] of ROARS) if (acts[key] && prevS < at && s >= at) { curRoar = key; startOnce('roar', key); }
  }
  prevS = s;
  if (acts.fly) {                                      // wings flap faster while you scroll, hover slowly when you stop
    flyT += dt * (0.25 + Math.min(MT.vel / 18, 1) * 1.3);
    acts.fly.time = flyT % acts.fly.getClip().duration;
  }
  const activeKey = state === 'roar' ? curRoar : state;
  let sum = 0;
  for (const k in acts) { wts[k] += ((k === activeKey ? 1 : 0) - wts[k]) * (1 - Math.exp(-dt * 6)); sum += wts[k]; }
  for (const k in acts) acts[k].setEffectiveWeight(sum > 1e-4 ? wts[k] / sum : 0);
  MT.land = sum > 1e-4 ? ((wts.stand || 0) + (wts.attack01 || 0) + (wts.attack02 || 0) + (wts.down || 0) * 0.5) / sum : 1;
}
/* keeps the dragon centred without jitter: low-pass follow of the skeleton centre, horizontal only */
function followCentre(dt) {
  if (!skinned) return;
  modelPivot.updateMatrixWorld();
  _inv.copy(modelPivot.matrixWorld).invert();
  _mn.set(1e9, 1e9, 1e9); _mx.set(-1e9, -1e9, -1e9);
  for (const b of skinned.skeleton.bones) { _v.setFromMatrixPosition(b.matrixWorld).applyMatrix4(_inv); _mn.min(_v); _mx.max(_v); }
  const k = 1 - Math.exp(-dt / 1.1);
  gltfModel.position.x += (anchor.x - (_mn.x + _mx.x) / 2) * k;
  gltfModel.position.z += (anchor.z - (_mn.z + _mx.z) / 2) * k;
}
function bonesCentre(out) {
  modelPivot.updateMatrixWorld(true);
  _inv.copy(modelPivot.matrixWorld).invert();
  _mn.set(1e9, 1e9, 1e9); _mx.set(-1e9, -1e9, -1e9);
  for (const b of skinned.skeleton.bones) { _v.setFromMatrixPosition(b.matrixWorld).applyMatrix4(_inv); _mn.min(_v); _mx.max(_v); }
  return out.set((_mn.x + _mx.x) / 2, (_mn.y + _mx.y) / 2, (_mn.z + _mx.z) / 2);
}

function makeFloorGlow() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(190,120,255,.85)'); gr.addColorStop(0.45, 'rgba(165,82,226,.35)'); gr.addColorStop(1, 'rgba(165,82,226,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.rotation.x = -Math.PI / 2; scene.add(m); return m;
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(MODEL_URL, (gltf) => {
    gltfModel = gltf.scene;
    modelPivot = new THREE.Group();
    scene.add(modelPivot); modelPivot.add(gltfModel);
    gltfModel.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = false;
      if (child.isSkinnedMesh && !skinned) skinned = child;
      (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => {
        if (!m || modelMats.includes(m)) return;
        modelMats.push(m);
        if (m.map) { m.metalness = Math.min(m.metalness, 0.6); m.roughness = Math.max(m.roughness, 0.35); m.map.anisotropy = 8; }
        else { m.roughness = 0.42; m.metalness = 0.9; }
        m.transparent = true; m.opacity = 0;
      });
    });
    setupAnimations(gltf);
    if (mixer) mixer.update(0);
    scene.updateMatrixWorld(true);
    /* size and centre are measured on the landed (stand) pose */
    const box = new THREE.Box3().setFromObject(gltfModel);
    const size = box.getSize(new THREE.Vector3()), maxDim = Math.max(size.x, size.y, size.z);
    gltfModel.scale.setScalar(isFinite(maxDim) && maxDim > 1e-4 ? targetMaxDim() / maxDim : 1);
    scene.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(gltfModel);
    gltfModel.position.sub(box2.getCenter(new THREE.Vector3()));
    scene.updateMatrixWorld(true);
    floorY = new THREE.Box3().setFromObject(gltfModel).min.y - 0.2;
    modelPivot.position.y = -0.2;
    if (skinned) { scene.updateMatrixWorld(true); anchor.copy(bonesCentre(new THREE.Vector3())); }
    floorMesh = makeFloorGlow(); floorMesh.position.y = floorY + 0.03;
    modelReady = true;
    MT.status('');
  }, undefined, (e) => { console.error('Error loading model:', e); MT.status('The 3D dragon could not load. Refresh the page, or check that dragon.glb was uploaded next to index.html.', true); });
}

/* ---------- camera path: a different viewpoint for every chapter ---------- */
/* scroll, azimuth (rad), radius, height, look-x */
const KF = [[0, 0.0, 5.2, 0.35, -0.9], [0.09, 0.3, 5.0, 0.30, -0.5], [0.17, 1.3, 5.8, 1.55, 0], [0.22, 1.9, 4.0, 0.15, 0],
  [0.28, 2.4, 4.4, 0.35, 0], [0.38, 2.9, 4.7, 0.40, 0], [0.46, 3.9, 6.0, 1.65, 0], [0.52, 4.5, 4.0, 0.15, 0],
  [0.57, 4.9, 4.4, 0.40, 0], [0.67, 5.4, 4.9, 0.50, 0], [0.75, 6.0, 6.0, 1.75, 0], [0.80, 6.6, 4.0, 0.20, 0],
  [0.85, 6.9, 4.5, 0.40, 0], [1, 7.6, 4.9, 0.45, 0]];
function camAt(s) {
  let i = 0; while (i < KF.length - 2 && s > KF[i + 1][0]) i++;
  const a = KF[i], b = KF[i + 1];
  const t = Math.min(1, Math.max(0, (s - a[0]) / (b[0] - a[0])));
  return [1, 2, 3, 4].map((j) => a[j] + (b[j] - a[j]) * t);
}
const _target = new THREE.Vector3(), _look = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();
  const s = MT.scroll;

  if (modelReady) {
    tickAnimation(dt, s);
    if (mixer) mixer.update(dt);
    followCentre(dt);
    modelPivot.rotation.y = MT.mx * 0.12;                                  // gentle mouse tilt
    modelPivot.rotation.x = MT.my * 0.06;
    modelPivot.position.y = -0.2 + Math.sin(time * 0.8) * 0.015 * (1 - (MT.land || 0));
    if (floorMesh) floorMesh.material.opacity = Math.max(0, ((MT.land || 0) - 0.4) / 0.6) * 0.9;
    if (modelAlpha < 1) {
      modelAlpha = Math.min(1, modelAlpha + dt / 1.2);
      modelMats.forEach((m) => { m.opacity = modelAlpha; if (modelAlpha >= 1) { m.transparent = false; m.needsUpdate = true; } });
    }
  }

  if (sparkParticles) {
    const pos = sparkParticles.geometry.attributes.position.array;
    const vel = Math.abs(MT.target - MT.scroll);
    const mult = 1.0 + vel * 9.0, turb = vel * 0.8;
    for (let i = 0; i < sparkCount; i++) {
      const k = i * 3, d = sparkData[i];
      pos[k] += d.speedX * dt * mult; pos[k+1] += d.speedY * dt * mult; pos[k+2] += d.speedZ * dt * mult;
      const sway = d.swayRadius * (1.0 + turb * 4.0);
      pos[k] += Math.sin(time * d.swaySpeed + d.phase) * sway * dt;
      pos[k+2] += Math.cos(time * d.swaySpeed + d.phase) * sway * dt;
      if (pos[k+1] > 3.0 || Math.abs(pos[k]) > 3.5 || Math.abs(pos[k+2]) > 3.5) {
        pos[k+1] = -2.5; pos[k] = (Math.random() - 0.5) * 3.0; pos[k+2] = (Math.random() - 0.5) * 3.0;
      }
    }
    sparkParticles.geometry.attributes.position.needsUpdate = true;
  }

  const [az, r, h, lx] = camAt(s);
  const m = isMobile();
  const rr = r + (m ? 0.5 : 0);
  _target.set(rr * Math.sin(az), h, rr * Math.cos(az));
  camera.position.lerp(_target, 1 - Math.exp(-dt * 3));
  _look.set(m ? 0 : lx, (m ? -0.7 : -0.15) + (1 - (MT.land === undefined ? 1 : MT.land)) * 0.3, 0);
  camera.lookAt(_look);

  shaderUniforms.uTime.value = time;
  shaderUniforms.uMouse.value.set(MT.mx, -MT.my);
  shaderUniforms.uScroll.value = s;
  renderer.render(scene, camera);
}
window.addEventListener('resize', () => { if (renderer) onWindowResize(); });

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#070b24');
  scene.fog = new THREE.FogExp2('#070b24', 0.01);
  camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(0, 0.2, 5.5);
  scene.add(camera);
  createBackgroundShader();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile(), alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPixelRatio()));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;   // no shadow maps: they only caused shimmering on the animated dragon
  renderer.toneMappingExposure = 2.2;

  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  const keyLight = new THREE.SpotLight('#ffffff', 18.0);
  keyLight.position.set(4, 6, 3); keyLight.angle = Math.PI / 4; keyLight.penumbra = 0.9;
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight('#b996ff', 10.0);
  rimLight.position.set(-5, 3, -4); scene.add(rimLight);
  const fillLight = new THREE.DirectionalLight('#fff3e6', 0.8);
  fillLight.position.set(-2, -4, 2); scene.add(fillLight);
  const headlight = new THREE.DirectionalLight('#f3e9ff', 1.6);   // rides with the camera so the dragon is always readable
  headlight.position.set(1.5, 1, 2); camera.add(headlight);

  createSparks();
  MT.status('Loading the 3D dragon…');
  loadModel();
  onWindowResize();
  animate();
}
try { init(); } catch (e) { console.error(e); MT.status('The 3D scene could not start on this device. The rest of the site works.', true); }
