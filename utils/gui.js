import * as dat from 'dat.gui'

const gui = new dat.GUI()

export default function guiMove(obj) {
  gui.add(obj.position, 'x', -1, 1, 0.01).name('位移x轴')
  gui.add(obj.position, 'y', -1, 1, 0.01).name('位移y轴')
  gui.add(obj.position, 'z', -1, 1, 0.01).name('位移z轴')

  gui.add(obj.rotation, 'x', 0, 2 * Math.PI, 0.01).name('旋转x轴')
  gui.add(obj.rotation, 'y', 0, 2 * Math.PI, 0.01).name('旋转y轴')
  gui.add(obj.rotation, 'z', 0, 2 * Math.PI, 0.01).name('旋转z轴')
}
