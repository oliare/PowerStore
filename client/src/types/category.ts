export interface CategoryDto {
  id: string;
  name: string;
  image?: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  parentId?: string;
  childrens: CategoryDto[];
}
