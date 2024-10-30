import { Category } from "../../category/types/category";
import { Chapter } from "../../chapter/types/chapter";
import { Course } from "./course";

export type PurchaseCourse = {
  course: Course;
  category: Category | null;
  chapters: Chapter[];
};
