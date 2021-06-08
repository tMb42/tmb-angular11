export interface SubDivision {
  id: number,
  sub_division_name: string,
  sub_division_old_name?: string,
  alias_name?: string,
  division_id?: number,
  remarks?: string,
  display?: number,
  inforce?: number,
  created_at?: Date,
  updated_at?: Date,
}
