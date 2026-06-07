import { categoryRepository, ICategoryRepository } from "./CategoryRepository";
import { category } from "../../../db/schema/category";
import { notFound } from "next/navigation";

class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAll() {
    return await this.categoryRepository.findAll();
  }
  async getCategoryById(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) notFound();

    return category;
  }
}

export const categoryService = new CategoryService(categoryRepository);

