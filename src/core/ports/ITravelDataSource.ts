// src/core/ports/ITravelDataSource.ts

import type { Travel } from '../domain/Travel'

export interface ITravelDataSource {
  getAll(): Travel[]
  getById(id: string): Travel | undefined
}
