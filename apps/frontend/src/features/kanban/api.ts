export interface KanbanCard {
  id: string;
  title: string;
  content: string;
  order: number;
  columnId: string;
  assigneeId?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
}

export interface KanbanFilters {
  search?: string;
  assigneeIds?: string[];
}
