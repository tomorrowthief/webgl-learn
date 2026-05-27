// Sandbox HTML template — blob URL, loads Three.js from CDN (blob URL origin is "null", can't use relative paths)
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0';

export function getSandboxHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#1a1a2e}
canvas{display:block}
#err{display:none;position:fixed;top:0;left:0;right:0;background:rgba(239,68,68,.95);color:#fff;padding:12px 16px;font:13px Menlo,Monaco,monospace;line-height:1.5;z-index:1000;white-space:pre-wrap}
</style>
</head><body>
<div id="err"></div>
<script type="importmap">
{
  "imports": {
    "three": "${CDN}/build/three.module.js",
    "three/addons/": "${CDN}/examples/jsm/"
  }
}
</` + `script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

var scene, camera, renderer, controls, animId = null;
var c = document.body, err = document.getElementById('err');
var M = Math;

function mkR() {
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); }
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(M.min(window.devicePixelRatio,2));
  renderer.setSize(c.clientWidth, c.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  c.appendChild(renderer.domElement);
}

function clean() {
  if (animId!==null) { cancelAnimationFrame(animId); animId=null; }
  if (controls) { controls.dispose(); controls=null; }
  if (scene) {
    scene.traverse(function(o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { if (Array.isArray(o.material)) o.material.forEach(function(m){m.dispose()}); else o.material.dispose(); }
    });
    scene.clear(); scene=null;
  }
  camera=null;
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer=null; }
}

function setup() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#1a1a2e');
  camera = new THREE.PerspectiveCamera(60, c.clientWidth/M.max(c.clientHeight,1), 0.1, 100);
  camera.position.set(3,2,5); camera.lookAt(0,0,0);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping=true; controls.dampingFactor=0.08;
  scene.add(new THREE.AmbientLight('#fff',0.5));
  var dl=new THREE.DirectionalLight('#fff',1); dl.position.set(5,10,7); scene.add(dl);
  var pl=new THREE.PointLight('#6366F1',0.5); pl.position.set(-3,2,3); scene.add(pl);
}

function anim() {
  animId=requestAnimationFrame(anim);
  if (typeof window.animate==='function') window.animate();
  if (controls) controls.update();
  if (renderer&&scene&&camera) renderer.render(scene,camera);
}

window.addEventListener('resize',function() {
  if (camera) { camera.aspect=c.clientWidth/M.max(c.clientHeight,1); camera.updateProjectionMatrix(); }
  if (renderer) renderer.setSize(c.clientWidth,c.clientHeight);
});

window.addEventListener('message',function(e) {
  var d=e.data;
  if (!d||typeof d!=='object') return;
  if (d.type==='run') {
    try {
      err.style.display='none'; clean(); mkR(); setup(); anim();
      new Function(
        'THREE','OrbitControls','scene','camera','renderer',
        'EffectComposer','RenderPass','UnrealBloomPass',
        'GLTFLoader','DRACOLoader',
        'Line2','LineGeometry','LineMaterial',
        'SSAOPass','OutputPass','ShaderPass','FXAAShader','RenderPixelatedPass',
        'InstancedMesh','Sprite','SpriteMaterial',
        'AnimationMixer','AnimationClip',
        d.code
      )(
        THREE,OrbitControls,scene,camera,renderer,
        EffectComposer,RenderPass,UnrealBloomPass,
        GLTFLoader,DRACOLoader,
        Line2,LineGeometry,LineMaterial,
        SSAOPass,OutputPass,ShaderPass,FXAAShader,RenderPixelatedPass,
        THREE.InstancedMesh,THREE.Sprite,THREE.SpriteMaterial,
        THREE.AnimationMixer,THREE.AnimationClip
      );
      window.parent.postMessage({type:'result',success:true},'*');
    } catch(ex) {
      err.style.display='block'; err.textContent=ex.name+': '+ex.message;
      window.parent.postMessage({type:'result',success:false,error:{type:ex.name||'Error',message:ex.message||'Unknown'}},'*');
    }
  }
});

window.parent.postMessage({type:'ready'},'*');
</` + `script>
</body></html>`;
}

let blobUrl: string | null = null;

export function getSandboxBlobUrl(): string {
  if (!blobUrl) {
    const html = getSandboxHtml();
    const blob = new Blob([html], { type: 'text/html' });
    blobUrl = URL.createObjectURL(blob);
  }
  return blobUrl;
}

export function revokeSandboxBlobUrl(): void {
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  }
}