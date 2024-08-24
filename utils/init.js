// 初始化three.js基础环境
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js'
export let scene, camera, renderer, controls, css3dRenderer
;(function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 0.1
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
})()
;(function createControls() {
  controls = new OrbitControls(camera, renderer.domElement)
})()
;(function creteHelper() {
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
})()
;(function resizeRenderer() {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })
})()
;(function createCss3dRenderer() {
  css3dRenderer = new CSS3DRenderer()
  css3dRenderer.setSize(window.innerWidth, window.innerHeight)
  css3dRenderer.domElement.style.position = 'fixed'
  css3dRenderer.domElement.style.top = 0
  css3dRenderer.domElement.style.left = 0
  css3dRenderer.domElement.style.pointerEvents = 'none'
  document.body.appendChild(css3dRenderer.domElement)
})()
;(function renderLoop() {
  renderer.render(scene, camera)
  controls.update()
  css3dRenderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
})()
