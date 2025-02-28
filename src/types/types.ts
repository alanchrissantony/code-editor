import { LANGUAGE_VERSIONS } from "../constants";

export type FileNode = {
    id: string;
    name: string;
    type: "file" | "folder";
    language?: keyof typeof LANGUAGE_VERSIONS;
    content?: string;
    children?: FileNode[];
  };
  