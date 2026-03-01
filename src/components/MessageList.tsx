import type { MessageListItem } from "@/types";
import { useEffect, useRef } from "react";

type MessageListProps = {
  messages: MessageListItem[];
};

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  const reactions = ["💯", "👍", "👎", "😂", "😮", "😢", "🙏"];

  return (
    <div className="flex-1 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-white/20 dark:scrollbar-track-transparent">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-pink-500/80" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">farhanbantulm1</span>
            <span className="text-xs text-slate-500 dark:text-white/50">
              farhanbantulm1
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            This is the beginning of your direct message history with
            farhanbantulm1.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span>No servers in common</span>
            <button className="rounded bg-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20">
              Remove Friend
            </button>
            <button className="rounded bg-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20">
              Block
            </button>
          </div>
        </div>
      </div>

      {messages.map((item) => {
        if (item.type === "date") {
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-xs uppercase text-slate-500 dark:text-white/50">
                {item.label}
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>
          );
        }

        if (item.type === "call") {
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/60"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.text}</span>
              <span className="ml-auto text-xs">{item.time}</span>
            </div>
          );
        }

        return (
          <div key={item.id} className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-pink-500/80" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{item.author}</span>
                <span className="text-xs text-slate-500 dark:text-white/50">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700 dark:text-white/80">
                {item.content}
              </p>
              {item.embed ? (
                <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-white/80">
                    {item.embed.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-white/60">
                    {item.embed.subtitle}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-white/60">
                    {item.embed.note}
                  </div>
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {reactions.map((reaction) => (
                  <button
                    key={`${item.id}-${reaction}`}
                    className="rounded-full bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
