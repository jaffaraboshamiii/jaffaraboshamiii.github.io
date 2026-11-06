import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const MT = window.MT;
const MODEL_URL = 'dragon.glb';
const isMobile = () => innerWidth < 900;
const targetMaxDim = () => (isMobile() ? 2.1 : 2.6);   // dragon size: lower this number if it looks too big
const maxPixelRatio = () => (isMobile() ? 1.5 : 2);

const canvas = document.querySelector('#webgl');
let scene, camera, renderer;
let gltfModel, modelPivot, spinGroup, skinned, mixer;
let modelReady = false, modelAlpha = 0, frameCount = 0;
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

/* the clips in this file are cut from one long timeline, so shift a clip to start at 0 */
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

const _v = new THREE.Vector3(), _mn = new THREE.Vector3(), _mx = new THREE.Vector3();
function recenter(f) {
  if (!skinned || !spinGroup) return;
  _mn.set(1e9, 1e9, 1e9); _mx.set(-1e9, -1e9, -1e9);
  for (const b of skinned.skeleton.bones) { b.getWorldPosition(_v); spinGroup.worldToLocal(_v); _mn.min(_v); _mx.max(_v); }
  _mn.add(_mx).multiplyScalar(0.5);
  gltfModel.position.x -= _mn.x * f;
  gltfModel.position.y -= _mn.y * f;
  gltfModel.position.z -= _mn.z * f;
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(MODEL_URL, (gltf) => {
    gltfModel = gltf.scene;
    modelPivot = new THREE.Group();
    spinGroup = new THREE.Group();
    scene.add(modelPivot); modelPivot.add(spinGroup); spinGroup.add(gltfModel);

    gltfModel.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true; child.receiveShadow = true; child.frustumCulled = false;
      if (child.isSkinnedMesh && !skinned) skinned = child;
      (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => {
        if (!m || modelMats.includes(m)) return;
        modelMats.push(m);
        if (m.map) {                       // keep the painted textures, only soften the metal
          m.metalness = Math.min(m.metalness, 0.6);
          m.roughness = Math.max(m.roughness, 0.35);
          m.map.anisotropy = 16;
        } else { m.roughness = 0.42; m.metalness = 0.9; }
        m.transparent = true; m.opacity = 0;   // fades in once ready
      });
    });

    if (gltf.animations && gltf.animations.length) {
      const pick = (re) => gltf.animations.find((c) => re.test(c.name));
      const clip = pick(/fly2/i) || pick(/fly/i) || pick(/stand|idle/i) || gltf.animations[0];
      mixer = new THREE.AnimationMixer(gltfModel);
      mixer.clipAction(normalizeClip(clip)).play();
      mixer.update(0);
    }
    gltfModel.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(gltfModel).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    gltfModel.scale.setScalar(isFinite(maxDim) && maxDim > 1e-4 ? targetMaxDim() / maxDim : 1);
    gltfModel.updateMatrixWorld(true);
    recenter(1);
    modelPivot.position.y = -0.2;
    modelReady = true;
    MT.status('');
  }, undefined, (e) => { console.error('Error loading model:', e); MT.status('The 3D dragon could not load. Refresh the page, or check that dragon.glb was uploaded next to index.html.', true); });
}


/* ---------- main loop ---------- */
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();
  if (mixer) mixer.update(dt);
  const currentScroll = MT.scroll, targetScroll = MT.target;

  if (modelReady) {
    spinGroup.rotation.y += dt * 0.08;                          // slow idle spin
    modelPivot.rotation.y = MT.mx * 0.25;                       // mouse tilt
    modelPivot.rotation.x = MT.my * 0.15;
    modelPivot.position.y = -0.2 + Math.sin(time * 0.8) * 0.03; // breathing float
    if (++frameCount % 6 === 0) recenter(0.12);                 // keeps the flapping dragon centered
    if (modelAlpha < 1) {
      modelAlpha = Math.min(1, modelAlpha + dt / 1.2);
      modelMats.forEach((m) => { m.opacity = modelAlpha; if (modelAlpha >= 1) { m.transparent = false; m.needsUpdate = true; } });
    }
  }

  if (sparkParticles) {
    const pos = sparkParticles.geometry.attributes.position.array;
    const vel = Math.abs(targetScroll - currentScroll);
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

  const phi = currentScroll * Math.PI * 2.0;
  const y = 0.3 + Math.sin(currentScroll * Math.PI) * 0.7;
  const radius = 5.0 - Math.sin(currentScroll * Math.PI) * 0.6;
  const tp = Math.min(1.0, currentScroll / 0.28);
  const ease = (Math.cos(tp * Math.PI) + 1.0) * 0.5;
  camera.position.lerp(new THREE.Vector3(radius * Math.sin(phi), y, radius * Math.cos(phi)), 0.025);
  camera.lookAt(new THREE.Vector3(isMobile() ? 0 : -0.9 * ease, isMobile() ? -0.7 : -0.15, 0));

  shaderUniforms.uTime.value = time;
  shaderUniforms.uMouse.value.set(MT.mx, -MT.my);
  shaderUniforms.uScroll.value = currentScroll;
  renderer.render(scene, camera);
}
window.addEventListener('resize', () => { if (renderer) onWindowResize(); });

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#070b24');
  scene.fog = new THREE.FogExp2('#070b24', 0.01);
  camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(0, 0.2, 3.0);
  scene.add(camera);
  createBackgroundShader();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile(), alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPixelRatio()));
  renderer.shadowMap.enabled = !isMobile();
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2;

  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  const keyLight = new THREE.SpotLight('#ffffff', 18.0);
  keyLight.position.set(4, 6, 3);
  keyLight.angle = Math.PI / 4; keyLight.penumbra = 0.9; keyLight.castShadow = !isMobile();
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1.0; keyLight.shadow.camera.far = 15; keyLight.shadow.bias = -0.001;
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
