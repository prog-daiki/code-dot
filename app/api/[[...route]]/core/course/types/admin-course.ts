import { Category } from "../../category/types/category";
import { Course } from "./course";

export type AdminCourse = {
  course: Course;
  category: Category | null;
  chapterLength: number;
  purchasedNumber: number;
};
