import { Category } from "../../category/types/category";
import { Chapter } from "../../chapter/types/chapter";
import { MuxData } from "../../muxdata/types/muxdata";
import { Course } from "./course";

export type PublishCourseWithMuxData = {
  course: Course;
  category: Category | null;
  chapters: (Chapter & { muxData: MuxData | null })[];
  purchased: boolean;
};
