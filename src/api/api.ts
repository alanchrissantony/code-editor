import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (
  language: keyof typeof LANGUAGE_VERSIONS,
  version: string,
  code: string
) => {
  const response = await API.post("/execute", {
    language,
    version,
    files: [{ content: code }],
  });
  return response.data;
};
