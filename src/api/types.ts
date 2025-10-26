export interface Item {
  id: string;
  time: {
    created: string;
    updated: string;
  };
}

export interface Category extends Item {
  title: string;
  services: string[];
}

export interface Service extends Item {
  title: string;
  category: string;
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

export type FormService = Required<
  Pick<UpdateService, 'id' | 'title' | 'category'>
>;

export interface Model extends Item {
  name: string;
  title: string;
}

export interface Prompt extends Item {
  title: string;
  content?: string;
  service: string;
  model: Model;
  enabled: boolean;
  archived: boolean;
}

export interface ServiceWithPrompts extends Item {
  title: string;
  prompts: Prompt[];
}
export interface NewPrompt {
  title: string;
  service: string;
  model: string;
}

export interface UpdatePrompt {
  id: string;
  title?: string;
  content?: string;
  service?: string;
  model?: string;
  enabled?: boolean;
  archived?: boolean;
}

export type FormPrompt = Required<
  Pick<UpdatePrompt, 'id' | 'title' | 'service' | 'model'>
>;
