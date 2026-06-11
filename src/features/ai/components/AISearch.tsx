"use client";

import {
  Form,
  FormLabel,
  FormSubmit,
  FormTextArea,
} from "@/src/shared/components/forms";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Message } from "../types/ai.types";
import CommunityCard from "../../comminities/components/CommunityCard";
import MeetiCard from "../../meetis/components/MeetiCard";

export default function AISearch() {
  const [input, setInput] = useState("");
  const { messages, status, sendMessage } = useChat<Message>();

  return (
    <>
      {messages.map((message) => (
        <div
          className="whitespace-pre-wrap mt-5 p-5 border-b border-gray-300 last-of-type:border-none"
          key={message.id}>
          <p
            className={`${message.role === "user" ? "text-right" : "text-left"} font-black`}>
            {message.role === "user" ? "Usuario" : "Meeti AI"}
          </p>
          {message.parts.map((part, i) => {
            const key = `${message.id}-${i}`;
            // Texto
            if (part.type === "text") {
              return (
                <div
                  key={key}
                  className={`${message.role === "user" ? "text-right" : "text-left"}`}
                  dangerouslySetInnerHTML={{ __html: part.text }}
                />
              );
            }

            // Comunidades
            if (part.type === "tool-getRecommendedCommunities") {
              if (part.state !== "output-available") return null;
              const { communities } = part.output;
              if (!communities.length)
                return <p key={key}>{part.output.message}</p>;

              return (
                <div className="space-y-4" key={key}>
                  <p className="text-gray-700 font-medium">
                    Encontré{" "}
                    {communities.length === 1
                      ? "Esta communidad"
                      : `${communities.length} Comunidades`}{" "}
                    sobre {""}
                    <span className="text-orange-600 font-bold">
                      {part.input.query}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                    {communities.map((c) => (
                      <CommunityCard key={c.id} community={c} target={true} />
                    ))}
                  </div>
                </div>
              );
            }

            if (
              part.type === "tool-getMeetiBySubject" ||
              part.type === "tool-getVirtualMeetis" ||
              part.type === "tool-getInPersonMeetis"
            ) {
              if (part.state !== "output-available") return null;
              const { meetis } = part.output;
              if (!meetis.length) return <p key={key}>{part.output.message}</p>;

              const typeText =
                part.type === "tool-getVirtualMeetis"
                  ? { singular: "Meeti virtual", plural: "Meetis virtuales" }
                  : part.type === "tool-getInPersonMeetis"
                    ? {
                        singular: "Meeti en esta ubicacion",
                        plural: "Meetis en esta ubicacion",
                      }
                    : { singular: "Meeti", plural: "Meetis" };

              return (
                <div className="space-y-4" key={key}>
                  <p className="text-gray-700 font-medium">
                    Encontre{" "}
                    {meetis.length === 1 ? (
                      <>
                        este{" "}
                        <span className="text-orange-600 font-bold">
                          {typeText.singular}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-orange-600 font-bold">
                          {meetis.length}
                        </span>
                        {typeText.plural}
                      </>
                    )}
                    {part.input.query && (
                      <>
                        {" sobre: "}
                        <span className="text-orange-600 font-bold">
                          {part.input.query}
                        </span>
                      </>
                    )}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                    {meetis.map((m) => (
                      <MeetiCard
                        key={m.id}
                        meeti={m}
                        //  target={true}
                      />
                    ))}
                  </div>
                </div>
              );
            }
          })}
        </div>
      ))}

      {status === "submitted" && (
        <div className="flex items-center justify-center py-5 gap-2 text-gray-400">
          <div className="animate-spin size-5 border-2 border-t-transparent border-gray-400 rounded-full" />
          Pensando...
        </div>
      )}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}>
        <FormLabel htmlFor="prompt">
          Busca Meetis y Comunidades utilizando IA
        </FormLabel>
        <FormTextArea
          id="prompt"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <FormSubmit
          value={"Consultar"}
          disabled={input.trim() === "" || status === "submitted"}
        />
      </Form>
    </>
  );
}

