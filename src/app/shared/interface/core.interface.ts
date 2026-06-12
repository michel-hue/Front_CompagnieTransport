export interface Params {
  search: string;
  field: string;
  sort: string;
  page: number;
  paginate: number;
  start_date?: string;
  end_date?: string;
  [key: string]: any; // Pour les propriétés supplémentaires si besoin
}

export interface IPaginateModel {
  current_page?: number;
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: ILink[];
  next_page_url?: string;
  path?: string;
  per_page?: number;
  prev_page_url?: string;
  to?: number;
  total: number;
}

export interface ILink {
  active?: number;
  label?: string;
  url?: string;
}
