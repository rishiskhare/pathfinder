import React from 'react'
import Node from './Node'
import { NodeType } from '../utils/types'

interface GridProps {
  grid: NodeType[][]
  setGrid: React.Dispatch<React.SetStateAction<NodeType[][]>>
  isRunning: boolean
}

const Grid: React.FC<GridProps> = ({ grid, setGrid, isRunning }) => {
  const [isMousePressed, setIsMousePressed] = React.useState(false)

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return
    setIsMousePressed(true)
    setGrid(prevGrid => {
      const newGrid = prevGrid.slice()
      const node = newGrid[row][col]
      const newNode = {
        ...node,
        isWall: !node.isWall,
      }
      newGrid[row][col] = newNode
      return newGrid
    })
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isRunning) return
    if (!isMousePressed) return
    setGrid(prevGrid => {
      const newGrid = prevGrid.slice()
      const node = newGrid[row][col]
      const newNode = {
        ...node,
        isWall: !node.isWall,
      }
      newGrid[row][col] = newNode
      return newGrid
    })
  }

  const handleMouseUp = () => {
    setIsMousePressed(false)
  }

  return (
    <div 
      className="grid gap-px bg-gray-200 p-px rounded-lg shadow-inner"
      style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
        aspectRatio: `${grid[0].length} / ${grid.length}`
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((node, nodeIdx) => (
          <Node
            key={`${rowIdx}-${nodeIdx}`}
            node={node}
            onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
            onMouseEnter={() => handleMouseEnter(rowIdx, nodeIdx)}
            onMouseUp={handleMouseUp}
          />
        ))
      )}
    </div>
  )
}

export default Grid

