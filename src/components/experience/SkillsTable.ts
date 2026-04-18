export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface SkillsTableProps {
  groups: SkillGroup[];
}
