import isosurface from 'isosurface'
import { parse } from 'mathjs'


self.onmessage = ({ data }) => {
  console.log(data)

   const node = parse(data.definition)
    const code = node.compile()
  console.log(data.constraints)
    let mesh = isosurface.surfaceNets(
      [data.detail / 10, data.detail / 10, data.detail / 10],
      (x, y, z) => code.evaluate({ x, y, z }),
      [
        data.lowerLimit,
        data.upperLimit,
      ]
    )
      
    mesh.triangles = []
    
    for (let cell of mesh.cells) {
    
        let point1 = mesh.positions[cell[0]]
        let point2 = mesh.positions[cell[1]]
        let point3 = mesh.positions[cell[2]]

        let p1 = { x: point1[0], y: point1[1], z: point1[2] }
        let p2 = { x: point2[0], y: point2[1], z: point2[2] }
        let p3 = { x: point3[0], y: point3[1], z: point3[2] }

        // y and z coordinates are switched since
        // for three js, y is up and z is outwards from screen
        // but we are considering z is up and y is outwards from screen
      mesh.triangles.push(new Float32Array([
      p1.x,
      p1.z,
      p1.y,
      p2.x,
      p2.z,
      p2.y,
      p3.x,
      p3.z,
      p3.y,
    ]))
    
    }

    self.postMessage(mesh)
}