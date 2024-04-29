import { OPENAI_API_KEY } from "@/env";
import OpenAI from "openai";

export const model = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
