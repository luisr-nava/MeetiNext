import { InferUITools, UIDataTypes, UIMessage } from "ai";
import { tools } from "../tools";

export type UITools = InferUITools<typeof tools>;

export type Message = UIMessage<
  unknown, //metadata
  UIDataTypes, //data
  UITools //tools
>;

