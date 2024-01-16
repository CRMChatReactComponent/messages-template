export enum TemplateFormTypeEnum {
  CREATE,
  EDIT,
}

export type TemplateType = {
  id: string;
  title: string;
  shortCode: string;
  content: string;
  active: boolean;
  createdAt: number;
  modifiedAt: number;
};
