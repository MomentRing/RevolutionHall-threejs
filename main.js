// import './utils/init'
import * as THREE from 'three'
import { scene, camera, renderer, controls } from './utils/init'
import guiMove from './utils/gui'
import { CSS3DObject } from 'three/examples/jsm/Addons.js'

const group = new THREE.Group() //当前空间中所有标记
// 定义场景信息对象
const sceneInfoObj = {
  one: {
    //第一个场景信息
    publicPath: 'technology/1/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      //当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //平面宽高
        position: [-0.46, -0.11, -0.11],
        rotation: [1.42, 0.68, 1.63],
        targetAttr: 'two' //下一个场景数据对象的属性名
      }
    ]
  },
  two: {
    publicPath: 'technology/2/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      //当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //平面宽高
        position: [0.47, -0.2, 0],
        rotation: [1.48, 0.26, -1.78],
        targetAttr: 'one' //下一个场景数据对象的属性名
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //平面宽高
        position: [-0.46, -0.16, -0.3],
        rotation: [1.21, 0.78, 0],
        targetAttr: 'three' //下一个场景数据对象的属性名
      }
    ]
  },
  three: {
    publicPath: 'technology/3/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      //当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //平面宽高
        position: [0.4, -0.18, 0.32],
        rotation: [-1.53, -0.04, -1.26],
        targetAttr: 'two' //下一个场景数据对象的属性名
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //平面宽高
        position: [0.32, -0.16, -0.33],
        rotation: [1.46, 0.1, -0.17],
        targetAttr: 'four' //下一个场景数据对象的属性名
      }
    ]
  },
  four: {
    publicPath: 'technology/4/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      //当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.35, -0.22, 0.4],
        rotation: [-0.85, -0.45, -1.8],
        targetAttr: 'three' // 目标场景信息对象属性
      },
      {
        name: 'dom',
        position: [0.49, 0, 0],
        rotation: [0, -0.5 * Math.PI, 0],
        targetAttr: 'five' // 目标场景信息对象属性
      }
    ]
  }
}
function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
  })
  const cube = new THREE.Mesh(geometry, material)
  //   z轴镜像翻转
  cube.scale.set(1, 1, -1)
  scene.add(cube)

  return cube
}
function clear() {
  const list = [...group.children]
  list.forEach((obj) => {
    console.log(obj)
    if (!obj.isCSS3DObject) {
      obj.geometry.dispose()
      obj.material.dispose()
    }
    group.remove(obj)
  })
}
// 常见纹理贴图函数
function setMaterialCube(infoObj) {
  // 清除之前的标记
  clear()
  const { publicPath, imgUrlArr, markList } = infoObj
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setPath(publicPath)
  const materialArr = imgUrlArr.map((imgStr) => {
    const texture = textureLoader.load(imgStr)
    texture.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  })
  cubeObj.material = materialArr

  markList.forEach((markObj) => {
    if (markObj.name === 'landMark') createLandMark(markObj)
    // 原生dom标记
    else if (markObj.name === 'dom') createDomMark(markObj)
  })
  // 循环结束，group加入到场景中
  scene.add(group)
}

function createLandMark(infoObj) {
  const { imgUrl, wh, position, rotation, targetAttr } = infoObj
  const geometry = new THREE.PlaneGeometry(...wh)
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true //开启透明度透明纹理，展示镂空图
  })
  const texture = new THREE.TextureLoader().load(imgUrl)
  material.map = texture
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  // 添加名字，方便后续点击区分
  mesh.name = 'mark'
  // 绑定地上热点标记，切换到哪个场景
  mesh.userData.attr = targetAttr
  group.add(mesh)

  // guiMove(mesh)
}

function bindClick() {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  window.addEventListener('click', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const list = raycaster.intersectObjects(scene.children)
    // 查找点击的物体
    const obj = list.find((item) => item.object.name === 'mark')
    console.log(obj)
    if (obj) {
      const infoObj = sceneInfoObj[obj.object.userData.attr]
      setMaterialCube(infoObj)
    }
  })
}

function createDomMark(infoObj) {
  const { position, rotation } = infoObj
  const tag = document.createElement('span')
  tag.className = 'mark-style'
  tag.innerHTML = '前进'
  tag.style.pointerEvents = 'all'
  // dom=>3d物体
  const tag3d = new CSS3DObject(tag)
  tag3d.scale.set(1 / 800, 1 / 800, 1 / 800)
  tag3d.position.set(...position)
  tag3d.rotation.set(...rotation)
  group.add(tag3d)
}

const cubeObj = createCube()
setMaterialCube(sceneInfoObj.one)
bindClick()
