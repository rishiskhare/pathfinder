import { NodeType, Algorithm } from './types'
import { PriorityQueue } from './helpers'

export function generateGrid(rows: number, cols: number, wallProbability: number = 0.3): NodeType[][] {
  const grid: NodeType[][] = []

  for (let row = 0; row < rows; row++) {
    const currentRow: NodeType[] = []
    for (let col = 0; col < cols; col++) {
      const isStart = row === 0 && col === 0
      const isEnd = row === rows - 1 && col === cols - 1
      currentRow.push({
        row,
        col,
        isStart,
        isEnd,
        isWall: !isStart && !isEnd && Math.random() < wallProbability,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
      })
    }
    grid.push(currentRow)
  }

  return grid
}

export function* findPath(
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType,
  algorithm: Algorithm
): Generator<NodeType, { path: NodeType[] }, undefined> {
  switch (algorithm) {
    case 'astar':
      return yield* astar(grid, startNode, endNode)
    case 'dijkstra':
      return yield* dijkstra(grid, startNode, endNode)
    case 'bfs':
      return yield* bfs(grid, startNode, endNode)
    case 'dfs':
      return yield* dfs(grid, startNode, endNode)
    default:
      return { path: [] }
  }
}

function* astar(
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): Generator<NodeType, { path: NodeType[] }, undefined> {
  const openSet = new PriorityQueue<NodeType>((a, b) => 
    (a.distance + manhattan(a, endNode)) - (b.distance + manhattan(b, endNode))
  )
  startNode.distance = 0
  openSet.enqueue(startNode)

  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue()!
    if (currentNode.isWall) continue
    yield currentNode

    if (currentNode === endNode) {
      return { path: getNodesInShortestPathOrder(endNode) }
    }

    const neighbors = getNeighbors(grid, currentNode)
    for (const neighbor of neighbors) {
      const tentativeDistance = currentNode.distance + 1

      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = currentNode
        neighbor.distance = tentativeDistance
        if (!openSet.includes(neighbor)) {
          openSet.enqueue(neighbor)
        }
      }
    }
  }

  return { path: [] }
}

function* dijkstra(
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): Generator<NodeType, { path: NodeType[] }, undefined> {
  const unvisitedNodes = getAllNodes(grid)
  startNode.distance = 0
  
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes)
    const closestNode = unvisitedNodes.shift()!
    if (closestNode.isWall) continue
    if (closestNode.distance === Infinity) return { path: [] }
    closestNode.isVisited = true
    yield closestNode
    if (closestNode === endNode) return { path: getNodesInShortestPathOrder(endNode) }
    updateUnvisitedNeighbors(closestNode, grid)
  }

  return { path: [] }
}

function* bfs(
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): Generator<NodeType, { path: NodeType[] }, undefined> {
  const queue: NodeType[] = [startNode]
  startNode.isVisited = true

  while (queue.length) {
    const currentNode = queue.shift()!
    if (currentNode.isWall) continue
    yield currentNode

    if (currentNode === endNode) return { path: getNodesInShortestPathOrder(endNode) }

    const neighbors = getNeighbors(grid, currentNode)
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true
        neighbor.previousNode = currentNode
        queue.push(neighbor)
      }
    }
  }

  return { path: [] }
}

function* dfs(
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): Generator<NodeType, { path: NodeType[] }, undefined> {
  const stack: NodeType[] = [startNode]
  startNode.isVisited = true

  while (stack.length) {
    const currentNode = stack.pop()!
    if (currentNode.isWall) continue
    yield currentNode

    if (currentNode === endNode) return { path: getNodesInShortestPathOrder(endNode) }

    const neighbors = getNeighbors(grid, currentNode)
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true
        neighbor.previousNode = currentNode
        stack.push(neighbor)
      }
    }
  }

  return { path: [] }
}

function getNeighbors(grid: NodeType[][], node: NodeType): NodeType[] {
  const neighbors: NodeType[] = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  return neighbors.filter(neighbor => !neighbor.isWall)
}

function manhattan(nodeA: NodeType, nodeB: NodeType): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
}

function getAllNodes(grid: NodeType[][]): NodeType[] {
  return grid.flat()
}

function sortNodesByDistance(unvisitedNodes: NodeType[]): void {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node: NodeType, grid: NodeType[][]): void {
  const unvisitedNeighbors = getNeighbors(grid, node)
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1
    neighbor.previousNode = node
  }
}

function getNodesInShortestPathOrder(finishNode: NodeType): NodeType[] {
  const nodesInShortestPathOrder = []
  let currentNode: NodeType | null = finishNode
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode)
    currentNode = currentNode.previousNode
  }
  return nodesInShortestPathOrder
}

