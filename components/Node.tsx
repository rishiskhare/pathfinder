import React from 'react'
import { NodeType } from '../utils/types'

interface NodeProps {
  node: NodeType
  onMouseDown: () => void
  onMouseEnter: () => void
  onMouseUp: () => void
}

const Node: React.FC<NodeProps> = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
  const { isStart, isEnd, isWall, isVisited, isPath } = node

  const baseClassName = "w-full h-full rounded-sm"

  const stateClassName = isStart
    ? 'bg-green-500'
    : isEnd
    ? 'bg-red-500'
    : isWall
    ? 'bg-gray-800'
    : isPath
    ? 'bg-green-400'
    : isVisited
    ? 'bg-yellow-300'
    : 'bg-white'

  return (
    <div
      className={`${baseClassName} ${stateClassName}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    ></div>
  )
}

export default Node

