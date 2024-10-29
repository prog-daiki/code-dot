import { Category } from "../../category/types/category";
import { Chapter } from "../../chapter/types/chapter";
import { Course } from "./course";

export type PublishCourse = {
  course: Course;
  category: Category | null;
  chapters: Chapter[];
  purchased: boolean;
};
