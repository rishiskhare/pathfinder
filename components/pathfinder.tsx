'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Grid from '@/components/Grid'
import { generateGrid, findPath } from '@/utils/algorithms'
import { Algorithm, NodeType } from '@/utils/types'

const GRID_ROWS = 20
const GRID_COLS = 40
const ANIMATION_SPEED_MS = 20

export default function Pathfinder() {
  const [grid, setGrid] = useState(() => generateGrid(GRID_ROWS, GRID_COLS))
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar')
  const [isRunning, setIsRunning] = useState(false)
  const [isPathFound, setIsPathFound] = useState(false)
  const [isVisualizing, setIsVisualizing] = useState(false)
  const animationFrameIdRef = useRef<number | null>(null)
  const pathGeneratorRef = useRef<Generator<NodeType, { path: NodeType[] }, undefined> | null>(null)

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value as Algorithm)
  }

  const resetGridWithoutWalls = useCallback(() => {
    return grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null
      }))
    )
  }, [grid])

  const visualizePath = useCallback(() => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current)
    }

    setIsRunning(true)
    setIsVisualizing(true)  
    setIsPathFound(false)
    
    const newGrid = resetGridWithoutWalls()
    setGrid(newGrid)

    const startNode = newGrid[0][0]
    const endNode = newGrid[GRID_ROWS - 1][GRID_COLS - 1]
    pathGeneratorRef.current = findPath(newGrid, startNode, endNode, algorithm)

    animateTraversal()
  }, [algorithm, resetGridWithoutWalls])

  const animateTraversal = useCallback(() => {
    if (!pathGeneratorRef.current) return

    const result = pathGeneratorRef.current.next()

    if (!result.done) {
      const node = result.value
      setGrid(prevGrid => {
        const newGrid = prevGrid.slice()
        if (!newGrid[node.row][node.col].isWall) {
          const newNode = {
            ...newGrid[node.row][node.col],
            isVisited: true
          }
          newGrid[node.row][node.col] = newNode
        }
        return newGrid
      })

      animationFrameIdRef.current = requestAnimationFrame(() => {
        setTimeout(animateTraversal, ANIMATION_SPEED_MS)
      })
    } else {
      const { path } = result.value
      if (path.length === 0) {
        setIsRunning(false)
        setIsVisualizing(false)
        setIsPathFound(false)
      } else {
        animateShortestPath(path)
      }
    }
  }, [])

  const animateShortestPath = useCallback((path: NodeType[]) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i]
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice()
          const newNode = {
            ...newGrid[node.row][node.col],
            isPath: true
          }
          newGrid[node.row][node.col] = newNode
          return newGrid
        })

        if (i === path.length - 1) {
          setIsRunning(false)
          setIsPathFound(true)
          setIsVisualizing(false)  
        }
      }, ANIMATION_SPEED_MS * i)
    }
  }, [])

  const resetGrid = useCallback(() => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current)
    }
    setGrid(generateGrid(GRID_ROWS, GRID_COLS))
    setIsRunning(false)
    setIsPathFound(false)
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Pathfinder Visualization</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <Select onValueChange={handleAlgorithmChange} value={algorithm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="astar">A* Algorithm</SelectItem>
            <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
            <SelectItem value="bfs">Breadth-First Search</SelectItem>
            <SelectItem value="dfs">Depth-First Search</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={visualizePath} disabled={isVisualizing}>
          {isVisualizing ? 'Visualizing...' : isPathFound ? 'Visualize Again' : 'Visualize Path'}
        </Button>
        <Button onClick={resetGrid} variant="outline" disabled={isRunning}>
          Reset Grid
        </Button>
      </div>
      <div className="w-full aspect-[2/1] max-h-[70vh]">
        <Grid grid={grid} setGrid={setGrid} isRunning={isRunning} />
      </div>
    </div>
  )
}

