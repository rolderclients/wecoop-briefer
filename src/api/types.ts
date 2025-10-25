export interface Item {
  id: string;
  time: {
    created: string;
    updated: string;
  };
}

export interface Service extends Item {
  title: string;
  categoryTitle: string;
  archived: boolean;
}

export interface NewService {
  title: string;
  category: string;
}

export interface UpdateService {
  id: string;
  title?: string;
  category?: string;
  archived?: boolean;
}
