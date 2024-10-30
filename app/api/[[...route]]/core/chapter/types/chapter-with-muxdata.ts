import { MuxData } from "../../muxdata/types/muxdata";
import { Chapter } from "./chapter";

export type ChapterWithMuxData = {
  chapter: Chapter;
  mux_data: MuxData | null;
};
