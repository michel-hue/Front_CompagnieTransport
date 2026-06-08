export interface ITableConfig<T extends IBaseRow = IBaseRow> {
  columns?: ITableColumn[];
  rowActions?: ITableAction[];
  data?: T[];
  total?: number;
  permission?: string | string[];
  actionsDropdown?: boolean; // Si true, affiche les actions dans un dropdown au lieu d'icônes
}
export interface IBaseRow {
  id: number;
}

export interface ITableColumn {
  title?: string | undefined;
  dataField?: string;
  key?: string;
  sortable?: boolean;
  sort_direction?: string;
  type?: string;
  canAllow?: string[];
  date_format?: string;
  class?: string;
  placeholder?: string;
  maxLength?: number; // Longueur maximale pour la troncature de texte
  colorField?: string; // Champ contenant la couleur pour les badges colorés
}

export interface ITableAction {
  label: string;
  actionToPerform: string;
  icon: string;
  permission?: string | string[];
  hideWhen?: (data: any) => boolean; // Fonction pour cacher l'action selon les données de la ligne
}

export interface ITableClickedAction {
  actionToPerform?: string;
  data?: any;
  value?: any;
}
