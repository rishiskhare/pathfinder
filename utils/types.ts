export interface NodeType {
  row: number
  col: number
  isStart: boolean
  isEnd: boolean
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: NodeType | null
}

export type Algorithm = 'astar' | 'dijkstra' | 'bfs' | 'dfs'

