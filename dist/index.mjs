// src/components/team-chat-interface.tsx
import { useState as useState2, useRef, useEffect, useCallback } from "react";

// src/components/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e)
    n += e;
  else if ("object" == typeof e)
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++)
        e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else
      for (f in e)
        e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
    (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// src/utils/utils.ts
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var getAccentColor = (seed) => {
  if (!seed || seed === "undefined") {
    return "from-violet-400 to-green-400";
  }
  if (seed === "login" || seed === "brand" || seed === "default") {
    return "from-violet-400 to-green-400";
  }
  const colors = [
    "from-violet-400 to-green-400",
    // Our new primary gradient
    "from-blue-500 to-purple-600",
    "from-green-500 to-emerald-700",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-indigo-800",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-teal-600",
    "from-red-500 to-pink-600",
    "from-yellow-500 to-amber-600",
    "from-emerald-500 to-green-600",
    "from-purple-500 to-violet-600",
    "from-sky-500 to-blue-600",
    "from-orange-500 to-red-600",
    "from-teal-500 to-cyan-600",
    "from-lime-500 to-green-600",
    "from-fuchsia-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-slate-500 to-gray-600",
    "from-zinc-500 to-stone-600",
    "from-neutral-500 to-gray-600"
  ];
  try {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  } catch {
    return "from-violet-400 to-green-400";
  }
};

// src/components/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-yellow-500 text-zinc-900 hover:bg-yellow-400",
        destructive: "bg-red-500 text-foreground hover:bg-red-600",
        outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-200",
        secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
        ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100",
        link: "text-yellow-500 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";

// src/components/team-chat-interface.tsx
import ReactMarkdown3 from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { Loader2 as Loader22, AlertCircle, Users as Users2, ChevronDown as ChevronDown2, ChevronUp, Paperclip, CheckCircle as CheckCircle2, XCircle as XCircle2, Send, ArrowRight, Copy } from "lucide-react";
import { format as format2 } from "date-fns";

// src/components/avatar.tsx
import * as React2 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Avatar = React2.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
    "div",
    {
      ref,
      className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
      ...props
    }
  )
);
Avatar.displayName = "Avatar";
var AvatarImage = React2.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2("img", { ref, className: cn("aspect-square h-full w-full", className), ...props })
);
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = React2.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
    "div",
    {
      ref,
      className: cn("flex h-full w-full items-center justify-center rounded-full", className),
      ...props
    }
  )
);
AvatarFallback.displayName = "AvatarFallback";

// src/components/team-chat-interface.tsx
import { Link } from "react-router-dom";

// src/components/alert-dialog.tsx
import * as React3 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx3(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx3(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-zinc-800/90 backdrop-blur-md border border-border p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl md:w-full",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx3("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx3(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-xl font-bold text-foreground", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-gray-300 mt-2", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(
      buttonVariants(),
      "bg-yellow-500 hover:bg-yellow-600 text-foreground font-medium px-4 rounded-lg hover:shadow-md transition-all",
      className
    ),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0 border-zinc-600 text-foreground hover:bg-zinc-700 hover:text-foreground rounded-lg",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/utils/normalize-events.ts
var normalizeEvents = (events, currentStreamingContent, getMemberDisplayName) => {
  const normalized = [];
  const toolRuns = {};
  const pendingToolOutputs = {};
  for (const event of events) {
    if (event.type === "RunStarted") {
      normalized.push({ type: "RunStarted" });
    }
    if (event.type === "ToolCallStarted") {
      const tools = event.data?.tools || [];
      tools.forEach((tool) => {
        const existing = toolRuns[tool.tool_call_id] || {};
        toolRuns[tool.tool_call_id] = {
          ...existing,
          type: "ToolRun",
          tool_name: tool.tool_name || tool.name || "Unknown Tool",
          tool_args: tool.tool_args || tool.arguments || {},
          started_at: tool.created_at || event.timestamp || Date.now()
        };
      });
    }
    if (event.type === "ToolCallCompleted") {
      const tools = event.data?.tools || [event.data];
      tools.forEach((tool) => {
        const existing = toolRuns[tool.tool_call_id] || {};
        const memberId = tool.tool_args?.member_id || tool.arguments?.member_id;
        const matchedFormattedCalls = event.data?.formatted_tool_calls?.filter(
          (call) => memberId && call.includes(memberId)
        ) || [];
        toolRuns[tool.tool_call_id] = {
          ...existing,
          type: "ToolRun",
          tool_name: tool.tool_name || tool.name || "Unknown Tool",
          tool_args: tool.tool_args || tool.arguments || {},
          result: tool.result || tool.output || "",
          error: tool.tool_call_error,
          started_at: existing?.started_at || tool.created_at || event.timestamp,
          completed_at: Date.now(),
          formatted_calls: Array.from(/* @__PURE__ */ new Set([
            ...existing.formatted_calls || [],
            ...matchedFormattedCalls
          ]))
        };
        delete pendingToolOutputs[tool.tool_call_id];
      });
    }
    if (event.type === "RunResponse" || event.type === "MemberResponse") {
      const members = event.data?.member_responses || [event.data];
      members.forEach((m) => {
        m.tools?.forEach((tool) => {
          if (tool.status === "completed" && tool.output === "None") {
            pendingToolOutputs[tool.tool_call_id] = true;
          }
        });
        normalized.push({
          type: "MemberResponse",
          member_name: getMemberDisplayName(m.member_id, m.member_name),
          content: m.content,
          tools: m.tools,
          model: m.model,
          created_at: m.created_at
        });
      });
    }
  }
  Object.values(toolRuns).forEach((tool) => {
    if (tool.type === "ToolRun" && tool.tool_name && tool.tool_args && typeof tool.started_at === "number") {
      normalized.push({
        type: "ToolRun",
        tool_name: tool.tool_name,
        tool_args: tool.tool_args,
        result: tool.result,
        error: tool.error,
        started_at: tool.started_at,
        completed_at: tool.completed_at ?? -1,
        formatted_calls: tool.formatted_calls || []
      });
    }
  });
  if (currentStreamingContent?.trim()) {
    normalized.push({ type: "FinalResponse", content: currentStreamingContent.trim() });
  }
  return normalized;
};

// src/components/sequenced-response-box.tsx
import React4, { useState } from "react";
import { CheckCircle, ChevronDown, XCircle, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Fragment, jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var SequencedResponseBox = ({ event, isStreaming }) => {
  const [expanded, setExpanded] = useState(isStreaming);
  const hasCollapsedAutomatically = React4.useRef(false);
  React4.useEffect(() => {
    if (event.type === "ToolRun") {
      const tool = event;
      const isCompleted = tool.completed_at !== -1 && tool.result !== "None" && !tool.error;
      if (isStreaming && isCompleted && !hasCollapsedAutomatically.current) {
        setExpanded(false);
        hasCollapsedAutomatically.current = true;
      }
      if (!isStreaming && expanded && !isCompleted) {
        setExpanded(false);
        hasCollapsedAutomatically.current = true;
      }
    } else if (!isStreaming && expanded) {
      setExpanded(false);
    }
  }, [isStreaming, event]);
  const toggleExpanded = () => setExpanded((prev) => !prev);
  const renderValue = (val) => typeof val === "string" && val.startsWith("http") ? /* @__PURE__ */ jsx4("a", { href: val, className: "text-blue-400 underline", target: "_blank", children: val }) : /* @__PURE__ */ jsx4("span", { children: String(val).replace(/_/g, " ") });
  const renderToolRun = (toolEvent) => {
    const { tool_name, tool_args, result, error, completed_at } = toolEvent;
    const formattedMemberId = typeof tool_args.member_id === "string" ? tool_args.member_id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "member";
    const formattedToolName = tool_name.replace("atransfer", "transfer").replace(/_/g, " ").replace(/\bmember\b/, formattedMemberId);
    return /* @__PURE__ */ jsxs2("div", { className: "bg-card rounded mb-2 border border-border relative", children: [
      /* @__PURE__ */ jsxs2("div", { className: "sticky top-0 bg-card z-10 border-b border-border px-4 py-3 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 font-semibold text-sm text-foreground", children: [
          error ? /* @__PURE__ */ jsx4(XCircle, { className: "w-4 h-4 text-red-500" }) : completed_at && completed_at !== -1 && result !== "None" ? /* @__PURE__ */ jsx4(CheckCircle, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsx4(Loader2, { className: "w-4 h-4 text-blue-400 animate-spin" }),
          formattedToolName
        ] }),
        /* @__PURE__ */ jsxs2("button", { onClick: toggleExpanded, className: "text-xs text-blue-400 flex items-center gap-1", children: [
          expanded ? "Hide" : "Show",
          " ",
          /* @__PURE__ */ jsx4(ChevronDown, { className: `w-3 h-3 ${expanded ? "rotate-180" : ""}` })
        ] })
      ] }),
      expanded && /* @__PURE__ */ jsxs2("div", { className: "max-h-[360px] overflow-y-auto px-4 pt-4 pb-4 text-xs space-y-1", children: [
        /* @__PURE__ */ jsxs2("div", { className: "font-medium", children: [
          "Time:",
          completed_at && completed_at !== -1 ? ` ${format(new Date(completed_at), "HH:mm:ss")}` : " In progress"
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "text-xs mt-2", children: [
          /* @__PURE__ */ jsx4("div", { className: "font-medium mb-1", children: "Parameters:" }),
          /* @__PURE__ */ jsx4("ul", { className: "space-y-1 ml-4 list-disc", children: Object.entries(tool_args).map(([key, value]) => /* @__PURE__ */ jsxs2("li", { children: [
            /* @__PURE__ */ jsxs2("span", { className: "font-semibold", children: [
              key.replace(/_/g, " "),
              ":"
            ] }),
            " ",
            typeof value === "string" ? value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : renderValue(value)
          ] }, key)) })
        ] }),
        completed_at && completed_at !== -1 && tool_name.includes("transfer") && !error && result !== "None" && toolEvent.formatted_calls?.length ? /* @__PURE__ */ jsx4("div", { className: "text-xs bg-muted p-2 rounded mt-2 border border-border font-mono break-words whitespace-pre-wrap space-y-1", children: toolEvent.formatted_calls.map((call, i) => /* @__PURE__ */ jsx4("div", { children: call.replace("atransfer_task_to_member", "transfer_task_to_member") }, i)) }) : /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-1", children: [
          error ? /* @__PURE__ */ jsx4(XCircle, { className: "w-4 h-4 text-red-500" }) : completed_at && completed_at !== -1 && result !== "None" ? /* @__PURE__ */ jsx4(CheckCircle, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsx4(Loader2, { className: "w-4 h-4 text-blue-400 animate-spin" }),
          /* @__PURE__ */ jsx4("span", { className: "text-muted-foreground", children: error ? "Error" : completed_at && completed_at !== -1 && result !== "None" ? "Completed" : "Running" })
        ] }),
        result && result !== "None" ? /* @__PURE__ */ jsx4("div", { className: "mt-2 text-sm space-y-3", children: (() => {
          try {
            const trimmed = result.trim();
            const jsonEndIndex = (() => {
              let stack = [];
              for (let i = 0; i < trimmed.length; i++) {
                const char = trimmed[i];
                if (char === "{" || char === "[")
                  stack.push(char);
                if (char === "}" || char === "]")
                  stack.pop();
                if (stack.length === 0 && (char === "}" || char === "]")) {
                  return i + 1;
                }
              }
              return -1;
            })();
            const jsonPart = trimmed.slice(0, jsonEndIndex).trim();
            const markdownPart = trimmed.slice(jsonEndIndex).trim();
            const parsedJson = JSON.parse(jsonPart);
            return /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx4("pre", { className: "bg-muted p-3 rounded text-xs whitespace-pre-wrap break-words border border-border overflow-x-auto", children: /* @__PURE__ */ jsx4("code", { children: JSON.stringify(parsedJson, null, 2) }) }),
              markdownPart && /* @__PURE__ */ jsx4("div", { className: "bg-muted p-4 rounded border border-border", children: /* @__PURE__ */ jsx4(
                ReactMarkdown,
                {
                  children: markdownPart,
                  components: {
                    p: ({ children }) => /* @__PURE__ */ jsx4("p", { className: "prose prose-invert max-w-none whitespace-pre-wrap break-words", children }),
                    code: ({ children }) => /* @__PURE__ */ jsx4("code", { className: "bg-card text-purple-300 px-1 rounded", children }),
                    li: ({ children }) => /* @__PURE__ */ jsx4("li", { className: "ml-4 list-disc", children }),
                    h2: ({ children }) => /* @__PURE__ */ jsx4("h2", { className: "text-foreground text-xl mt-4 mb-2", children }),
                    h3: ({ children }) => /* @__PURE__ */ jsx4("h3", { className: "text-foreground text-lg mt-3 mb-1", children })
                  }
                }
              ) })
            ] });
          } catch (err) {
            if (/Step \d+:/.test(result)) {
              return Array.from(
                new Set(
                  result.split(/(?=Step \d+:)/g).map((s) => s.trim().replace(/,+$/, ""))
                )
              ).filter((s) => s).map((step, i) => /* @__PURE__ */ jsx4(
                "div",
                {
                  className: "bg-muted p-3 rounded border border-border space-y-1",
                  children: step.split("\n").map((line, j) => {
                    const match = line.match(/^(Title|Reasoning|Action|Confidence):\s*(.*)$/);
                    if (match) {
                      return /* @__PURE__ */ jsxs2("div", { children: [
                        /* @__PURE__ */ jsxs2("span", { className: "font-semibold", children: [
                          match[1],
                          ":"
                        ] }),
                        " ",
                        /* @__PURE__ */ jsx4(
                          ReactMarkdown,
                          {
                            children: match[2],
                            components: {
                              p: ({ children }) => /* @__PURE__ */ jsx4("span", { className: "prose prose-invert max-w-none", children })
                            }
                          }
                        )
                      ] }, j);
                    } else {
                      return /* @__PURE__ */ jsx4(
                        ReactMarkdown,
                        {
                          children: line,
                          components: {
                            p: ({ children }) => /* @__PURE__ */ jsx4("p", { className: "prose prose-invert max-w-none whitespace-pre-wrap break-words", children })
                          }
                        },
                        j
                      );
                    }
                  })
                },
                i
              ));
            } else {
              return /* @__PURE__ */ jsx4("div", { className: "bg-muted p-4 rounded border border-border", children: /* @__PURE__ */ jsx4(
                ReactMarkdown,
                {
                  children: result,
                  components: {
                    pre: ({ children }) => /* @__PURE__ */ jsx4("pre", { className: "bg-card p-3 rounded overflow-x-auto text-xs whitespace-pre-wrap break-words border border-zinc-600", children }),
                    code: ({ children }) => /* @__PURE__ */ jsx4("code", { className: "bg-card text-purple-300 px-1 rounded", children }),
                    p: ({ children }) => /* @__PURE__ */ jsx4("p", { className: "prose prose-invert max-w-none whitespace-pre-wrap break-words", children }),
                    li: ({ children }) => /* @__PURE__ */ jsx4("li", { className: "ml-4 list-disc", children }),
                    h2: ({ children }) => /* @__PURE__ */ jsx4("h2", { className: "text-foreground text-xl mt-4 mb-2", children }),
                    h3: ({ children }) => /* @__PURE__ */ jsx4("h3", { className: "text-foreground text-lg mt-3 mb-1", children })
                  }
                }
              ) });
            }
          }
        })() }) : /* @__PURE__ */ jsx4("div", { className: "bg-muted p-2 rounded text-sm text-muted-foreground", children: "Pending ..." })
      ] })
    ] });
  };
  const renderMemberResponse = (memberEvent) => {
    const { member_name, content, tools, model, created_at } = memberEvent;
    return /* @__PURE__ */ jsxs2("div", { className: "bg-card p-3 rounded mb-2 border border-border", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx4(Users, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx4("span", { className: "font-semibold text-sm text-foreground", children: member_name }),
          model && /* @__PURE__ */ jsx4("span", { className: "text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded", children: model })
        ] }),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            onClick: toggleExpanded,
            className: "text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline",
            children: [
              expanded ? "Hide" : "Show",
              " ",
              /* @__PURE__ */ jsx4(ChevronDown, { className: `w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}` })
            ]
          }
        )
      ] }),
      expanded && /* @__PURE__ */ jsxs2("div", { className: "mt-2 text-sm text-foreground", children: [
        /* @__PURE__ */ jsx4(
          ReactMarkdown,
          {
            children: content,
            components: {
              p: ({ children }) => /* @__PURE__ */ jsx4("p", { className: "prose max-w-none prose-invert dark:prose-invert", children })
            }
          }
        ),
        tools && tools.length > 0 && /* @__PURE__ */ jsxs2("div", { className: "mt-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx4("span", { className: "font-medium", children: "Tools used:" }),
          " ",
          tools.map((t) => t.tool_name || t.name || "Unknown Tool").join(", ")
        ] }),
        created_at && /* @__PURE__ */ jsxs2("div", { className: "text-xs text-muted-foreground mt-1", children: [
          "\u{1F553} ",
          format(new Date(created_at), "HH:mm:ss")
        ] })
      ] })
    ] });
  };
  const renderRunStarted = () => /* @__PURE__ */ jsx4("div", { className: "text-xs text-muted-foreground mb-2", children: "\u{1F504} Run started..." });
  if (event.type === "ToolRun")
    return renderToolRun(event);
  if (event.type === "MemberResponse")
    return renderMemberResponse(event);
  if (event.type === "RunStarted")
    return renderRunStarted();
  return null;
};

// src/utils/chat-utils.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var markdownComponents = {
  code(props) {
    const { className, children, ...rest } = props;
    return /* @__PURE__ */ jsx5("code", { className: `${className || ""} bg-card px-1 py-0.5 rounded text-sm break-words`, ...rest, children });
  },
  pre(props) {
    const { children, ...rest } = props;
    return /* @__PURE__ */ jsx5("pre", { className: "bg-zinc-800 text-white p-4 rounded-md overflow-x-auto max-w-full my-4", ...rest, children });
  },
  ul(props) {
    return /* @__PURE__ */ jsx5("ul", { className: "list-disc pl-5 my-4", ...props });
  },
  ol(props) {
    return /* @__PURE__ */ jsx5("ol", { className: "list-decimal pl-5 my-4", ...props });
  },
  li(props) {
    return /* @__PURE__ */ jsx5("li", { className: "my-1", ...props });
  },
  p(props) {
    return /* @__PURE__ */ jsx5("p", { className: "my-2", ...props });
  }
};
var cleanMessageContent = (content, memberResponses) => {
  if (!content)
    return content;
  let cleanedContent = content;
  cleanedContent = cleanedContent.replace(/^[a-f0-9-]{36}[\s\n\r]*/gi, "").replace(/(?:^|\s)[a-f0-9-]{36}(?:\s|$)/gi, " ").replace(/[\s\n\r]*[a-f0-9-]{36}[\s\n\r]*$/gi, "").trim();
  if (!memberResponses?.length)
    return cleanedContent;
  if (cleanedContent.includes("Step 1:") && cleanedContent.length > 1e3) {
    const patterns = [/Step 1:/i, /### Step 1:/i, /To create a .* Team that specializes/i, /I'll outline the team structure/i];
    for (const pattern of patterns) {
      const match = cleanedContent.search(pattern);
      if (match > 0) {
        const beforeSteps = cleanedContent.substring(0, match).trim();
        if (beforeSteps.length > 20) {
          cleanedContent = beforeSteps;
          break;
        }
      }
    }
  }
  memberResponses.forEach(({ content: content2 }) => {
    if (content2?.length > 50) {
      const trimmed = content2.trim();
      if (cleanedContent.includes(trimmed)) {
        cleanedContent = cleanedContent.replace(trimmed, "").trim();
      } else {
        const start = trimmed.substring(0, 200);
        const index = cleanedContent.indexOf(start);
        if (index !== -1) {
          cleanedContent = cleanedContent.substring(0, index).trim();
        }
      }
    }
  });
  cleanedContent = cleanedContent.replace(/[a-f0-9-]{36}/gi, "").replace(/\n\s*\n\s*\n/g, "\n\n").replace(/\s{3,}/g, " ").trim();
  if (cleanedContent.length < 10 && content.length > 50) {
    return content.replace(/^[a-f0-9-]{36}[\s\n\r]*/gi, "").replace(/[\s\n\r]*[a-f0-9-]{36}[\s\n\r]*$/gi, "").trim();
  }
  return cleanedContent || content;
};

// src/components/team-event-timeline.tsx
import ReactMarkdown2 from "react-markdown";
import { jsx as jsx6 } from "react/jsx-runtime";
var TeamEventTimeline = ({
  events,
  isStreaming = false
}) => {
  return /* @__PURE__ */ jsx6("div", { className: "space-y-2 mt-4", children: events.map((event, index) => {
    if (event.type === "FinalResponse" && isStreaming) {
      return /* @__PURE__ */ jsx6("div", { className: "mb-2", children: /* @__PURE__ */ jsx6(ReactMarkdown2, { components: markdownComponents, children: cleanMessageContent(event.content) }) }, `final-${index}`);
    }
    return /* @__PURE__ */ jsx6(
      SequencedResponseBox,
      {
        event,
        index,
        isStreaming
      },
      index
    );
  }) });
};

// src/components/team-chat-interface.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var TeamChatInterface = ({
  teamId,
  initialSessionId,
  initialMessage,
  onSessionChange,
  onMessageReceived,
  isHomeTeam,
  setVncUrl,
  setIsIframeOpen,
  teamService,
  useAuthStore,
  useCreditStore,
  useToast
}) => {
  const [messages, setMessages] = useState2([]);
  const [input, setInput] = useState2("");
  const [isLoading, setIsLoading] = useState2(false);
  const [hasStreamedResponse, setHasStreamedResponse] = useState2(false);
  const [sessionId, setSessionId] = useState2(initialSessionId);
  const [currentStreamingContent, setCurrentStreamingContent] = useState2("");
  const [isLoadingSession, setIsLoadingSession] = useState2(false);
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);
  const streamingContentRef = useRef("");
  const messagesRef = useRef([]);
  const isNewlyCreatedSession = useRef(false);
  const textareaRef = useRef(null);
  const [accentColor, setAccentColor] = useState2("from-indigo-500 to-purple-500");
  const { user } = useAuthStore();
  const [userHasScrolled, setUserHasScrolled] = useState2(false);
  const chatContainerRef = useRef(null);
  const lastUserScrollPosition = useRef(0);
  const [currentTools, setCurrentTools] = useState2([]);
  const [activeTools, setActiveTools] = useState2([]);
  const [completedTools, setCompletedTools] = useState2([]);
  const [currentEvents, setCurrentEvents] = useState2([]);
  const currentToolsRef = useRef([]);
  const streamingMessageId = useRef(null);
  const currentEventsRef = useRef([]);
  const { fetchBalance } = useCreditStore();
  const [showNoCreditDialog, setShowNoCreditDialog] = useState2(false);
  const [currentMemberResponses, setCurrentMemberResponses] = useState2([]);
  const currentMemberResponsesRef = useRef([]);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState2(false);
  const [expandedResponses, setExpandedResponses] = useState2({});
  const [streamingMemberResponsesExpanded, setStreamingMemberResponsesExpanded] = useState2(false);
  const [selectedFiles, setSelectedFiles] = useState2([]);
  const [uploadedFileIds, setUploadedFileIds] = useState2([]);
  const [uploadProgress, setUploadProgress] = useState2({});
  const { showToast } = useToast();
  const sessionIdRef = useRef(initialSessionId);
  const apiTimestampToDate = (timestamp) => {
    if (!timestamp)
      return /* @__PURE__ */ new Date();
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime()))
        return date;
      return new Date(parseInt(timestamp) * 1e3);
    }
    return new Date(timestamp * 1e3);
  };
  const getMemberDisplayName = (memberId, memberName) => {
    if (memberName && memberName !== "Unknown Member" && memberName !== "unknown") {
      return memberName;
    }
    const memberDisplayNames = {
      "pranalyst": "PR Analyst",
      "code-reviewer": "Code Reviewer",
      "security-auditor": "Security Auditor",
      "github-specialist": "GitHub Specialist",
      "tech-lead": "Tech Lead",
      "unknown": "Team Member"
    };
    return memberDisplayNames[memberId] || memberName || memberId;
  };
  const cleanDuplicateContent = (content) => {
    if (!content)
      return content;
    const lines = content.split("\n");
    const seenLines = /* @__PURE__ */ new Set();
    const cleanedLines = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 10) {
        cleanedLines.push(line);
        continue;
      }
      const normalizedLine = trimmedLine.toLowerCase();
      if (!seenLines.has(normalizedLine)) {
        seenLines.add(normalizedLine);
        cleanedLines.push(line);
      }
    }
    return cleanedLines.join("\n").trim();
  };
  const GlobalStyle = () => /* @__PURE__ */ jsx7(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      @keyframes scale {
        0%, 100% { transform: scale(0.7); opacity: 0.5; }
        50% { transform: scale(1.3); opacity: 1; }
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
      }
    }
  );
  useEffect(() => {
    if (isHomeTeam && messages.length === 0 && !sessionId) {
      const welcomeMessage = {
        id: "welcome-message",
        content: "What kind of team do you need?",
        sender: "team",
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isHomeTeam, messages.length, sessionId]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    if (sessionId) {
      sessionIdRef.current = sessionId;
    }
  }, [sessionId]);
  useEffect(() => {
    currentMemberResponsesRef.current = currentMemberResponses;
  }, [currentMemberResponses]);
  useEffect(() => {
    if (initialSessionId !== sessionId) {
      if (initialSessionId && initialSessionId !== "undefined") {
        setSessionId(initialSessionId);
      } else {
        if (!isNewlyCreatedSession.current) {
          setMessages([]);
          setSessionId(void 0);
        }
      }
      isNewlyCreatedSession.current = false;
    }
  }, [initialSessionId, sessionId]);
  useEffect(() => {
    if (teamId && teamId !== "undefined") {
      setAccentColor(getAccentColor(teamId));
    }
  }, [teamId]);
  useEffect(() => {
    currentToolsRef.current = currentTools;
  }, [currentTools]);
  useEffect(() => {
    if (initialMessage && !sessionId && !hasProcessedInitialMessage && !isLoading) {
      setInput(initialMessage);
      setHasProcessedInitialMessage(true);
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
      }, 100);
    }
  }, [initialMessage, sessionId, hasProcessedInitialMessage, isLoading]);
  const loadSessionMessages = useCallback(async (sid) => {
    if (isNewlyCreatedSession.current || !sid || sid === "undefined")
      return;
    setIsLoadingSession(true);
    try {
      const [sessionDetailsResponse, messagesResponse] = await Promise.all([
        teamService.getSessionDetails(sid),
        teamService.getSessionMessages(sid)
      ]);
      const sessionDetails = sessionDetailsResponse.data;
      const apiMessages = messagesResponse.data;
      const formattedMessages = [];
      const teamContext = sessionDetails.team_context || {};
      const sessionContext = teamContext[sid] || {};
      const memberInteractions = sessionContext.member_interactions || [];
      for (let i = 0; i < apiMessages.length; i++) {
        const msg = apiMessages[i];
        if (msg.role === "system")
          continue;
        if (msg.role === "user") {
          formattedMessages.push({
            id: `message-${msg.created_at || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            content: msg.content || "",
            sender: "user",
            timestamp: apiTimestampToDate(msg.created_at)
          });
          continue;
        }
        if (msg.role === "assistant" || msg.role === "team_response") {
          const existingMessageIndex = formattedMessages.findIndex(
            (existingMsg) => existingMsg.sender === "team" && Math.abs(apiTimestampToDate(msg.created_at).getTime() - existingMsg.timestamp.getTime()) < 1e3
          );
          if (existingMessageIndex !== -1) {
            const existingMessage = formattedMessages[existingMessageIndex];
            if (msg.role === "assistant") {
              existingMessage.timestamp = apiTimestampToDate(msg.created_at);
            }
            const newContent = msg.content || "";
            const existingContent = existingMessage.content || "";
            if (newContent.length > existingContent.length * 1.5 || newContent.length > 100 && existingContent.length < 50) {
              if (!newContent.includes(existingContent.substring(0, Math.min(100, existingContent.length)))) {
                existingMessage.content = newContent;
              }
            } else if (existingContent.length < 20 && newContent.length > 20) {
              existingMessage.content = newContent;
            } else if (msg.role === "team_response" && Math.abs(newContent.length - existingContent.length) < 100) {
              existingMessage.content = newContent;
            }
            if (msg.member_responses && Array.isArray(msg.member_responses) && msg.member_responses.length > 0) {
              const memberResponses2 = msg.member_responses.map((response) => ({
                member_id: response.agent_id || response.member_id || "unknown",
                member_name: getMemberDisplayName(response.agent_id || response.member_id || "unknown", response.member_name || response.agent_name),
                content: cleanDuplicateContent(response.content || ""),
                tools: response.tools || []
              }));
              if (!existingMessage.memberResponses || existingMessage.memberResponses.length === 0) {
                existingMessage.memberResponses = memberResponses2;
              }
            }
            if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
              const newTools = [];
              msg.tool_calls.forEach((toolCall) => {
                const functionData = toolCall.function || {};
                newTools.push({
                  role: toolCall.role || "tool",
                  content: toolCall.content || "",
                  created_at: toolCall.created_at,
                  metrics: toolCall.metrics || {},
                  tool_name: functionData.name || toolCall.tool_name || toolCall.name || "",
                  tool_call_id: toolCall.id || toolCall.tool_call_id || `tool-${toolCall.created_at || Date.now()}`,
                  tool_args: functionData.arguments || toolCall.tool_args || toolCall.arguments || {},
                  tool_call_error: toolCall.tool_call_error || false,
                  name: functionData.name || toolCall.name || "",
                  output: toolCall.output || "",
                  arguments: functionData.arguments || toolCall.arguments || {},
                  input: toolCall.input || {},
                  timestamp: toolCall.timestamp || toolCall.created_at
                });
              });
              if (newTools.length > 0 && (!existingMessage.tools || existingMessage.tools.length === 0)) {
                existingMessage.tools = newTools;
              }
            }
            continue;
          }
          const currentContent = (msg.content || "").trim();
          const isDuplicateContent = formattedMessages.some(
            (existingMsg) => existingMsg.sender === "team" && existingMsg.content.trim() === currentContent
          );
          const isSimilarContent = formattedMessages.some((existingMsg) => {
            if (existingMsg.sender !== "team")
              return false;
            const existingContent = existingMsg.content.trim();
            if (existingContent.length < 50 || currentContent.length < 50)
              return false;
            const shorterContent = existingContent.length < currentContent.length ? existingContent : currentContent;
            const longerContent = existingContent.length >= currentContent.length ? existingContent : currentContent;
            return longerContent.includes(shorterContent.substring(0, Math.min(200, shorterContent.length * 0.8)));
          });
          if (msg.role === "assistant" && (isDuplicateContent || isSimilarContent)) {
            continue;
          }
          if (msg.role === "team_response") {
            const duplicateIndex = formattedMessages.findIndex(
              (existingMsg) => existingMsg.sender === "team" && (existingMsg.content.trim() === currentContent || existingMsg.content.length > 50 && currentContent.length > 50 && currentContent.includes(existingMsg.content.substring(0, Math.min(200, existingMsg.content.length * 0.8))))
            );
            if (duplicateIndex !== -1) {
              formattedMessages.splice(duplicateIndex, 1);
            }
          }
          const tools = [];
          if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
            msg.tool_calls.forEach((toolCall) => {
              const functionData = toolCall.function || {};
              tools.push({
                role: toolCall.role || "tool",
                content: toolCall.content || "",
                created_at: toolCall.created_at,
                metrics: toolCall.metrics || {},
                tool_name: functionData.name || toolCall.tool_name || toolCall.name || "",
                tool_call_id: toolCall.id || toolCall.tool_call_id || `tool-${toolCall.created_at || Date.now()}`,
                tool_args: functionData.arguments || toolCall.tool_args || toolCall.arguments || {},
                tool_call_error: toolCall.tool_call_error || false,
                name: functionData.name || toolCall.name || "",
                output: toolCall.output || "",
                arguments: functionData.arguments || toolCall.arguments || {},
                input: toolCall.input || {},
                timestamp: toolCall.timestamp || toolCall.created_at
              });
            });
          }
          let memberResponses = [];
          let mainContent = msg.content || "";
          if (msg.member_responses && Array.isArray(msg.member_responses)) {
            memberResponses = msg.member_responses.map((response) => ({
              member_id: response.agent_id || response.member_id || "unknown",
              member_name: getMemberDisplayName(response.agent_id || response.member_id || "unknown", response.member_name || response.agent_name),
              content: cleanDuplicateContent(response.content || ""),
              tools: response.tools || []
            }));
            if (msg.role === "assistant" && memberResponses.length > 0) {
              let cleanedContent = mainContent;
              cleanedContent = cleanedContent.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}[\s\n]*/gi, "").trim();
              memberResponses.forEach((memberResponse) => {
                if (memberResponse.content && memberResponse.content.length > 50) {
                  const memberContent = memberResponse.content.trim();
                  if (cleanedContent.includes(memberContent)) {
                    cleanedContent = cleanedContent.replace(memberContent, "").trim();
                  } else {
                    const memberContentStart = memberContent.substring(0, 200);
                    if (cleanedContent.includes(memberContentStart)) {
                      const startIndex = cleanedContent.indexOf(memberContentStart);
                      cleanedContent = cleanedContent.substring(0, startIndex).trim();
                    }
                  }
                }
              });
              cleanedContent = cleanedContent.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, "").replace(/\n\s*\n\s*\n/g, "\n\n").trim();
              if (cleanedContent.length > 10 || mainContent.length < 100) {
                mainContent = cleanedContent;
              }
            }
          } else if (memberInteractions.length > 0) {
            memberResponses = memberInteractions.map((interaction) => ({
              member_id: interaction.member_name || "Unknown Member",
              content: interaction.response?.content || interaction.task || "",
              tools: interaction.response?.tools || []
            }));
          }
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          if (lastMessage && lastMessage.sender === "team") {
            const newContent = mainContent.trim();
            const existingContent = lastMessage.content.trim();
            if (newContent.length > existingContent.length * 1.5 || newContent.length > 100 && existingContent.length < 50) {
              if (!newContent.includes(existingContent.substring(0, Math.min(100, existingContent.length)))) {
                lastMessage.content = newContent;
              }
            } else if (existingContent.length < 20 && newContent.length > 20) {
              lastMessage.content = newContent;
            } else if (msg.role === "team_response" && Math.abs(newContent.length - existingContent.length) < 100) {
              lastMessage.content = newContent;
            }
            if (tools.length > 0) {
              const existingToolIds = (lastMessage.tools || []).map((t) => t.tool_call_id);
              const newTools = tools.filter((t) => !existingToolIds.includes(t.tool_call_id));
              if (newTools.length > 0) {
                lastMessage.tools = [...lastMessage.tools || [], ...newTools];
              }
            }
            if (memberResponses.length > 0) {
              const existingMemberIds = (lastMessage.memberResponses || []).map((m) => m.member_id);
              const newMemberResponses = memberResponses.filter((m) => !existingMemberIds.includes(m.member_id));
              if (newMemberResponses.length > 0) {
                lastMessage.memberResponses = [...lastMessage.memberResponses || [], ...newMemberResponses];
              }
            }
          } else {
            const teamMessage = {
              id: `message-${msg.created_at || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              content: mainContent,
              sender: "team",
              timestamp: apiTimestampToDate(msg.created_at),
              tools: tools.length > 0 ? tools : msg.tools || [],
              // Use member responses from message or context
              memberResponses: memberResponses.length > 0 ? memberResponses : void 0
            };
            formattedMessages.push(teamMessage);
          }
          continue;
        }
      }
      formattedMessages.sort((a, b) => {
        const timeA = a.timestamp.getTime();
        const timeB = b.timestamp.getTime();
        if (Math.abs(timeA - timeB) < 1e3) {
          if (a.sender === "user" && b.sender === "team")
            return -1;
          if (a.sender === "team" && b.sender === "user")
            return 1;
        }
        return timeA - timeB;
      });
      const finalMessages = [];
      let updatedMessages = formattedMessages;
      if (isHomeTeam) {
        const lastTeamMessage = [...finalMessages].reverse().find(
          (msg) => msg.sender === "team" && typeof msg.content === "string"
        );
        if (lastTeamMessage && lastTeamMessage.content) {
          const teamIdMatch = lastTeamMessage.content.match(
            /team[\s_-]*id[^a-f0-9]*([a-f0-9]{24})/i
          );
          const fallbackUrlMatch = lastTeamMessage.content.match(
            /\/teams\/([a-f0-9]{24})\/chat/i
          );
          const extractedTeamId = teamIdMatch?.[1] || fallbackUrlMatch?.[1];
          if (extractedTeamId && !finalMessages.some((msg) => msg.content === `followup::${extractedTeamId}`)) {
            const followUpMessage = {
              id: `follow-up-${Date.now()}`,
              content: `followup::${extractedTeamId}`,
              sender: "team",
              timestamp: /* @__PURE__ */ new Date()
            };
            updatedMessages = [...finalMessages, followUpMessage];
          }
        }
      }
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error loading session messages:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);
  useEffect(() => {
    if (sessionId && sessionId !== "undefined" && !isNewlyCreatedSession.current) {
      loadSessionMessages(sessionId);
    }
  }, [sessionId, loadSessionMessages]);
  const detectVncUrl = (output) => {
    if (!output)
      return;
    try {
      const jsonMatches = output.match(/({[^{}]*"vnc_url"\s*:\s*"[^"]*"[^{}]*})/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const parsed = JSON.parse(match);
            if (parsed.vnc_url && parsed.vnc_url.trim() !== "") {
              let finalUrl = parsed.vnc_url;
              if (!finalUrl.includes("view_only=true")) {
                finalUrl += (finalUrl.includes("?") ? "&" : "?") + "view_only=true";
              }
              console.log("Found VNC URL in JSON:", finalUrl);
              setVncUrl(finalUrl);
              setIsIframeOpen(true);
              return;
            }
          } catch (err) {
            console.warn("Failed to parse JSON block:", err);
          }
        }
      }
      const markdownVncMatch = output.match(/\(https:\/\/[^\s)]+\/vnc\.html[^\s)]*\)/);
      if (markdownVncMatch) {
        const url = markdownVncMatch[0].slice(1, -1);
        let finalUrl = url;
        if (!finalUrl.includes("view_only=true")) {
          finalUrl += (finalUrl.includes("?") ? "&" : "?") + "view_only=true";
        }
        console.log("Found VNC URL in markdown:", finalUrl);
        setVncUrl(finalUrl);
        setIsIframeOpen(true);
      }
    } catch (err) {
      console.warn("Error while processing output for VNC URL:", err);
    }
  };
  useEffect(() => {
    for (const msg of messages) {
      if (!msg.memberResponses)
        continue;
      for (const member of msg.memberResponses) {
        for (const tool of member.tools || []) {
          const text = tool.output || tool.result;
          if (typeof text === "string") {
            detectVncUrl(text);
          }
        }
      }
    }
  }, [messages]);
  const cleanupWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
  };
  const handleUserMessageSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading)
      return;
    const hasPendingUploads = selectedFiles.length > 0;
    if (hasPendingUploads) {
      showToast("Please wait for file uploads to complete.");
      return;
    }
    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      content: input,
      sender: "user",
      timestamp: /* @__PURE__ */ new Date(),
      fileIds: uploadedFileIds.length > 0 ? uploadedFileIds.map((f) => f.id) : void 0
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasStreamedResponse(true);
    setCurrentTools([]);
    setActiveTools([]);
    setCompletedTools([]);
    setCurrentEvents([]);
    setCurrentMemberResponses([]);
    setCurrentStreamingContent("");
    streamingContentRef.current = "";
    setTimeout(() => textareaRef.current?.focus(), 0);
    const responseId = `team-${Date.now()}`;
    streamingMessageId.current = responseId;
    try {
      const fileIds = uploadedFileIds.map((f) => f.id);
      const sessionToUse = sessionIdRef.current || sessionId;
      const connection = teamService.chatWithTeamStream(
        teamId,
        input,
        sessionToUse,
        (content) => {
          if (!content || content.trim() === "Run started" || content.includes("Run started")) {
            return;
          }
          const cleanedContent = content.replace(/^Run started\s*/, "");
          streamingContentRef.current += cleanedContent;
          setCurrentStreamingContent(streamingContentRef.current);
        },
        (toolEvent, data) => {
          console.log("Tool event received:", toolEvent, data);
          if (toolEvent === "RunCompleted") {
            console.log("Skipping RunCompleted tool event to prevent duplication");
            return;
          }
          const newEvent = {
            type: toolEvent,
            timestamp: Date.now(),
            data
          };
          setCurrentEvents((prev) => {
            const updated = [...prev, newEvent];
            currentEventsRef.current = updated;
            return updated;
          });
          if (toolEvent === "ToolCallStarted") {
            if (data.tools && Array.isArray(data.tools)) {
              const newActiveTools = data.tools.map((tool) => ({
                tool_call_id: tool.tool_call_id || `tool-${Date.now()}`,
                tool_name: tool.tool_name || tool.name || "Unknown Tool",
                tool_args: tool.tool_args || tool.arguments || {},
                started_at: tool.created_at || Date.now(),
                status: "starting"
              }));
              setActiveTools((prev) => {
                const existing = prev.filter(
                  (t) => !newActiveTools.some((nt) => nt.tool_call_id === t.tool_call_id)
                );
                return [...existing, ...newActiveTools];
              });
            }
            if (data.active_tool) {
              const activeTool = {
                tool_call_id: data.active_tool.tool_call_id || `tool-${Date.now()}`,
                tool_name: data.active_tool.tool_name || data.active_tool.name || "Unknown Tool",
                tool_args: data.active_tool.tool_args || data.active_tool.arguments || {},
                started_at: data.active_tool.created_at || Date.now(),
                status: "running"
              };
              setActiveTools((prev) => {
                const filtered = prev.filter((t) => t.tool_call_id !== activeTool.tool_call_id);
                return [...filtered, activeTool];
              });
            }
          } else if (toolEvent === "ToolCallCompleted") {
            console.log("Processing ToolCallCompleted event:", data);
            if (data.tools && Array.isArray(data.tools)) {
              const completedToolsList = data.tools.filter((tool) => tool.result !== null && tool.result !== void 0).map((tool) => ({
                tool_call_id: tool.tool_call_id || `tool-${Date.now()}`,
                tool_name: tool.tool_name || tool.name || "Unknown Tool",
                tool_args: tool.tool_args || tool.arguments || {},
                result: tool.result,
                error: tool.tool_call_error || false,
                metrics: tool.metrics || {},
                started_at: tool.created_at || Date.now(),
                completed_at: Date.now()
              }));
              setCompletedTools((prev) => {
                const existing = prev.filter(
                  (t) => !completedToolsList.some((ct) => ct.tool_call_id === t.tool_call_id)
                );
                return [...existing, ...completedToolsList];
              });
              const completedIds = completedToolsList.map((t) => t.tool_call_id);
              setActiveTools((prev) => prev.filter((t) => !completedIds.includes(t.tool_call_id)));
            } else if (data.tool_call_id && data.result) {
              const completedTool = {
                tool_call_id: data.tool_call_id,
                tool_name: data.tool_name || "Unknown Tool",
                tool_args: data.tool_args || {},
                result: data.result,
                error: data.tool_call_error || false,
                metrics: data.metrics || {},
                started_at: data.created_at || Date.now(),
                completed_at: Date.now()
              };
              setCompletedTools((prev) => {
                const existing = prev.filter((t) => t.tool_call_id !== completedTool.tool_call_id);
                return [...existing, completedTool];
              });
              setActiveTools((prev) => prev.filter((t) => t.tool_call_id !== completedTool.tool_call_id));
            }
          }
          if (toolEvent === "ToolsArray" && data.tools) {
            setCurrentTools((prev) => [...prev, ...data.tools]);
          } else if (toolEvent === "ToolCall" && data) {
            setCurrentTools((prev) => [...prev, data]);
            const text = data.output || data.result;
            if (typeof text === "string") {
              detectVncUrl(text);
            }
          } else if (data && typeof data === "object") {
            if (data.tools && Array.isArray(data.tools)) {
              console.log("Processing tools array from event:", data.tools);
              setCurrentTools((prev) => {
                const newTools = [...prev];
                data.tools.forEach((tool) => {
                  const toolExists = newTools.some(
                    (t) => t.tool_call_id === tool.tool_call_id || t.tool_name === tool.tool_name || t.tool_name === tool.name
                  );
                  if (!toolExists) {
                    newTools.push({
                      role: tool.role || "tool",
                      tool_name: tool.tool_name || tool.name || "",
                      tool_call_id: tool.tool_call_id || `tool-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                      tool_args: tool.tool_args || (typeof tool.arguments === "object" && tool.arguments !== null ? tool.arguments : {}) || {},
                      content: tool.content || tool.output || "",
                      created_at: tool.created_at || Date.now(),
                      metrics: tool.metrics || { time: 0 }
                    });
                  }
                });
                return newTools;
              });
            }
            if (data.active_tool) {
              const tool = data.active_tool;
              setCurrentTools((prev) => {
                const toolExists = prev.some(
                  (t) => t.tool_call_id === tool.tool_call_id || t.tool_name === tool.tool_name || t.tool_name === tool.name
                );
                if (!toolExists) {
                  return [
                    ...prev,
                    {
                      role: tool.role || "tool",
                      tool_name: tool.tool_name || tool.name || "",
                      tool_call_id: tool.tool_call_id || `tool-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                      tool_args: tool.tool_args || (typeof tool.arguments === "object" && tool.arguments !== null ? tool.arguments : {}) || {},
                      content: tool.content || tool.output || "",
                      created_at: tool.created_at || Date.now(),
                      metrics: tool.metrics || { time: 0 }
                    }
                  ];
                }
                return prev;
              });
            }
            if (data.member_responses && Array.isArray(data.member_responses) && data.member_responses.length > 0) {
              console.log("Processing member responses from event:", data.member_responses);
              const formattedMemberResponses = data.member_responses.map((response) => ({
                member_id: response.agent_id || response.member_id || "unknown",
                member_name: getMemberDisplayName(response.agent_id || response.member_id || "unknown", response.member_name || response.agent_name),
                content: cleanDuplicateContent(response.content || ""),
                tools: response.tools || [],
                model: response.model || "Unknown",
                created_at: response.created_at || Date.now()
              }));
              setCurrentMemberResponses(formattedMemberResponses);
            }
          }
        },
        (memberResponses) => {
          const formattedMemberResponses = memberResponses.map((response) => ({
            member_id: response.agent_id || response.member_id || "unknown",
            member_name: getMemberDisplayName(response.agent_id || response.member_id || "unknown", response.member_name || response.agent_name),
            content: cleanDuplicateContent(response.content || ""),
            tools: response.tools || [],
            model: response.model || "Unknown",
            created_at: response.created_at || Date.now()
          }));
          setCurrentMemberResponses(formattedMemberResponses);
        },
        (newSessionId) => {
          const finalContent = streamingContentRef.current;
          const teamMessage = {
            id: responseId,
            content: finalContent,
            sender: "team",
            timestamp: /* @__PURE__ */ new Date(),
            // Will be updated when we reload messages from backend
            tools: currentToolsRef.current,
            memberResponses: currentMemberResponsesRef.current,
            activeTools,
            completedTools,
            events: currentEventsRef.current
          };
          setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.id !== responseId);
            return [...filtered, teamMessage];
          });
          if (isHomeTeam) {
            const teamIdMatch = finalContent.match(
              /team[\s_-]*id[^a-f0-9]*([a-f0-9]{24})/i
            );
            const fallbackUrlMatch = finalContent.match(
              /\/teams\/([a-f0-9]{24})\/chat/i
            );
            const extractedTeamId = teamIdMatch?.[1] || fallbackUrlMatch?.[1];
            if (extractedTeamId) {
              const followUpMessage = {
                id: `follow-up-${Date.now()}`,
                content: `followup::${extractedTeamId}`,
                // special pattern
                sender: "team",
                timestamp: /* @__PURE__ */ new Date()
              };
              setMessages((prev) => [...prev, followUpMessage]);
            }
          }
          if (newSessionId && (!sessionId || sessionId !== newSessionId)) {
            setSessionId(newSessionId);
            isNewlyCreatedSession.current = true;
            if (onSessionChange) {
              onSessionChange(newSessionId);
            }
          }
          setIsLoading(false);
          setHasStreamedResponse(false);
          streamingContentRef.current = "";
          setCurrentTools([]);
          setActiveTools([]);
          setCompletedTools([]);
          setCurrentMemberResponses([]);
          setSelectedFiles([]);
          setUploadedFileIds([]);
          fetchBalance();
          if (uploadedFileIds.length > 0 && (newSessionId || sessionId)) {
            setTimeout(() => {
              const targetSessionId = newSessionId || sessionId;
              if (targetSessionId) {
                loadSessionMessages(targetSessionId);
              }
            }, 500);
          }
          if (onMessageReceived) {
            onMessageReceived();
          }
        },
        (errorMessage) => {
          console.error("Error in chat stream:", errorMessage);
          setIsLoading(false);
          let errorDetails = null;
          try {
            if (typeof errorMessage === "string" && (errorMessage.includes("{") || errorMessage.includes("error_code"))) {
              const jsonMatch = errorMessage.match(/\{.*\}/);
              if (jsonMatch) {
                errorDetails = JSON.parse(jsonMatch[0]);
              }
            } else if (typeof errorMessage === "object") {
              errorDetails = errorMessage;
            }
          } catch (e2) {
            console.warn("Could not parse error details:", e2);
          }
          if (errorDetails && errorDetails.error_code) {
            if (errorDetails.error_code.includes("credits") || errorDetails.error_code === "insufficient_credits") {
              setShowNoCreditDialog(true);
              return;
            }
            const errorContent = errorDetails.message || "An error occurred while processing your request.";
            const suggestions = errorDetails.suggestions || [];
            const recoveryOptions = errorDetails.recovery_options || [];
            const errorTeamMessage = {
              id: `error-${Date.now()}`,
              content: errorContent,
              sender: "team",
              timestamp: /* @__PURE__ */ new Date(),
              tools: [],
              memberResponses: []
            };
            setMessages((prev) => [...prev, errorTeamMessage]);
            if (suggestions.length > 0) {
              console.info("Error suggestions:", suggestions);
            }
            if (recoveryOptions.length > 0) {
              console.info("Recovery options:", recoveryOptions);
            }
            return;
          }
          if (typeof errorMessage === "string" && (errorMessage.includes("credits") || errorMessage.includes("balance"))) {
            setShowNoCreditDialog(true);
            return;
          }
          const genericErrorMessage = typeof errorMessage === "string" ? errorMessage.includes("rate limit") || errorMessage.includes("quota") ? "The AI service is currently busy. Please wait a moment and try again." : errorMessage.includes("connection") || errorMessage.includes("timeout") ? "Unable to connect to the AI service. Please check your connection and try again." : "The team encountered an issue while processing your request. Please try again." : "An unexpected error occurred. Please try again.";
          const genericErrorTeamMessage = {
            id: `error-${Date.now()}`,
            content: genericErrorMessage,
            sender: "team",
            timestamp: /* @__PURE__ */ new Date(),
            tools: [],
            memberResponses: []
          };
          setMessages((prev) => [...prev, genericErrorTeamMessage]);
        },
        fileIds
      );
      websocketRef.current = connection;
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      let errorMessage = "An unexpected error occurred. Please try again.";
      let shouldShowCreditDialog = false;
      if (error && typeof error === "object") {
        if ("response" in error && error.response && typeof error.response === "object") {
          try {
            const errorData = error.response.data;
            if (errorData && typeof errorData === "object") {
              if (errorData.error_code) {
                if (errorData.error_code.includes("credits") || errorData.error_code === "insufficient_credits") {
                  shouldShowCreditDialog = true;
                } else {
                  errorMessage = errorData.message || errorMessage;
                }
              } else if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.detail) {
                if (typeof errorData.detail === "object" && errorData.detail.message) {
                  errorMessage = errorData.detail.message;
                  if (errorData.detail.error_code && errorData.detail.error_code.includes("credits")) {
                    shouldShowCreditDialog = true;
                  }
                } else if (typeof errorData.detail === "string") {
                  errorMessage = errorData.detail;
                }
              }
            } else if (typeof errorData === "string") {
              errorMessage = errorData;
            }
          } catch (parseError) {
            console.warn("Could not parse error response:", parseError);
          }
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      if (shouldShowCreditDialog || typeof errorMessage === "string" && (errorMessage.includes("credits") || errorMessage.includes("balance"))) {
        setShowNoCreditDialog(true);
        return;
      }
      if (typeof errorMessage === "string") {
        if (errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
          errorMessage = "The AI service is currently busy. Please wait a moment and try again.";
        } else if (errorMessage.includes("connection") || errorMessage.includes("timeout") || errorMessage.includes("network")) {
          errorMessage = "Unable to connect to the AI service. Please check your connection and try again.";
        } else if (errorMessage.includes("model") && errorMessage.includes("not found")) {
          errorMessage = "The AI model is temporarily unavailable. Please try again later.";
        }
      }
      const errorTeamMessage = {
        id: `error-${Date.now()}`,
        content: errorMessage,
        sender: "team",
        timestamp: /* @__PURE__ */ new Date(),
        tools: [],
        memberResponses: []
      };
      setMessages((prev) => [...prev, errorTeamMessage]);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserMessageSubmit(e);
    }
  };
  const renderMessageContent = (message) => {
    if (message.sender === "user") {
      return /* @__PURE__ */ jsx7("div", { className: "whitespace-pre-wrap break-words", children: message.content });
    }
    if (message.content.startsWith("followup::")) {
      const teamId2 = message.content.replace("followup::", "");
      return /* @__PURE__ */ jsxs3("div", { className: "p-2 pt-4 pb-4", children: [
        /* @__PURE__ */ jsx7("h2", { className: "text-xl font-bold text-foreground mb-1", children: "What's next?" }),
        /* @__PURE__ */ jsx7("p", { className: "text-muted-foreground text-base mb-4", children: "Go to the team room and give them instructions" }),
        /* @__PURE__ */ jsxs3(
          Link,
          {
            to: `/teams/${teamId2}/chat`,
            className: "form-button text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 w-fit",
            children: [
              /* @__PURE__ */ jsx7("span", { children: "TEAM ROOM" }),
              /* @__PURE__ */ jsx7(ArrowRight, { className: "w-5 h-5" })
            ]
          }
        )
      ] });
    }
    const renderTools = () => {
      const timelineEvents = message.events || [];
      if (timelineEvents.length === 0) {
        return null;
      }
      const normalized = normalizeEvents(
        timelineEvents,
        message.content ?? "",
        getMemberDisplayName
      );
      if (normalized.length === 0)
        return null;
      return /* @__PURE__ */ jsx7("div", { className: "mt-4 mb-4", children: /* @__PURE__ */ jsx7(
        TeamEventTimeline,
        {
          events: normalized,
          isStreaming: false
        }
      ) });
    };
    const renderMemberResponses = () => {
      if (!message.memberResponses || message.memberResponses.length === 0)
        return null;
      return /* @__PURE__ */ jsxs3("div", { className: "mt-4 mb-4 pb-3 border-b border-border", children: [
        /* @__PURE__ */ jsxs3(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setExpandedResponses((prev) => ({
              ...prev,
              [message.id]: !prev[message.id]
            })),
            className: "text-xs text-muted-foreground mb-2 flex items-center gap-1 hover:bg-muted hover:text-foreground p-0 h-auto font-normal",
            children: [
              /* @__PURE__ */ jsx7(Users2, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxs3("span", { children: [
                "Team Member Responses (",
                message.memberResponses.length,
                ")"
              ] }),
              expandedResponses[message.id] ? /* @__PURE__ */ jsx7(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx7(ChevronDown2, { className: "h-3 w-3" })
            ]
          }
        ),
        expandedResponses[message.id] && /* @__PURE__ */ jsx7("div", { className: "space-y-3", children: message.memberResponses.map((member, index) => /* @__PURE__ */ jsxs3(
          "div",
          {
            className: "p-3 rounded-md bg-card border border-border",
            children: [
              /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx7("span", { className: "text-sm font-medium text-foreground", children: getMemberDisplayName(member.member_id, member.member_name) }),
                  member.model && /* @__PURE__ */ jsx7("span", { className: "text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded", children: member.model })
                ] }),
                member.created_at && /* @__PURE__ */ jsx7("span", { className: "text-xs text-muted-foreground", children: format2(new Date(member.created_at * 1e3), "HH:mm:ss") })
              ] }),
              /* @__PURE__ */ jsx7("div", { className: "text-sm text-foreground", children: /* @__PURE__ */ jsx7(ReactMarkdown3, { components: markdownComponents, children: cleanDuplicateContent(member.content) }) }),
              member.tools && member.tools.length > 0 && /* @__PURE__ */ jsxs3("div", { className: "mt-2 pt-2 border-t border-border", children: [
                /* @__PURE__ */ jsxs3("div", { className: "text-xs text-muted-foreground mb-1", children: [
                  "Tools Used (",
                  member.tools.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsx7("div", { className: "space-y-1", children: member.tools.map((tool, idx) => /* @__PURE__ */ jsxs3(
                  "div",
                  {
                    className: "text-xs bg-muted text-muted-foreground p-1.5 rounded",
                    children: [
                      /* @__PURE__ */ jsxs3("div", { className: "font-medium flex items-center gap-2", children: [
                        tool.tool_call_error ? /* @__PURE__ */ jsx7(XCircle2, { className: "w-3 h-3 text-red-500" }) : /* @__PURE__ */ jsx7(CheckCircle2, { className: "w-3 h-3 text-green-500" }),
                        String(tool.name || tool.tool_name || "Unknown Tool"),
                        typeof tool.metrics?.time === "number" && /* @__PURE__ */ jsxs3("span", { className: "text-muted-foreground", children: [
                          "(",
                          Number(tool.metrics.time).toFixed(2),
                          "s)"
                        ] })
                      ] }),
                      (tool.output || tool.result) && /* @__PURE__ */ jsx7("div", { className: "opacity-80 mt-1 max-h-20 overflow-hidden text-foreground", children: String(tool.output || tool.result) })
                    ]
                  },
                  `member-tool-${idx}`
                )) })
              ] })
            ]
          },
          `${member.member_id}-${index}`
        )) })
      ] });
    };
    if (message.fileIds && message.fileIds.length > 0) {
      const contentToRenderWithFiles = message.sender === "team" ? message.memberResponses && message.memberResponses.length > 0 && message.content.length < 1e3 ? message.content : cleanMessageContent(message.content, message.memberResponses) : message.content;
      return /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "text-xs text-foreground-60", children: [
          "\u{1F4CE} ",
          message.fileIds.length,
          " file",
          message.fileIds.length > 1 ? "s" : "",
          " attached"
        ] }),
        renderMemberResponses(),
        renderTools(),
        /* @__PURE__ */ jsx7(ReactMarkdown3, { components: markdownComponents, children: contentToRenderWithFiles })
      ] });
    }
    const contentToRender = message.sender === "team" ? message.memberResponses && message.memberResponses.length > 0 && message.content.length < 1e3 ? message.content : cleanMessageContent(message.content, message.memberResponses) : message.content;
    return /* @__PURE__ */ jsxs3("div", { children: [
      renderMemberResponses(),
      renderTools(),
      /* @__PURE__ */ jsx7(ReactMarkdown3, { components: markdownComponents, children: contentToRender })
    ] });
  };
  useEffect(() => {
    if (!userHasScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentStreamingContent]);
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer)
      return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        setUserHasScrolled(false);
      } else {
        setUserHasScrolled(true);
        lastUserScrollPosition.current = scrollTop;
      }
    };
    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);
  const formatMessageTimestamp = (timestamp, messageIndex) => {
    const now = /* @__PURE__ */ new Date();
    const timeDiff = now.getTime() - timestamp.getTime();
    const isWithinLastHour = timeDiff < 36e5;
    let showSeconds = isWithinLastHour;
    if (messageIndex !== void 0 && messages.length > 1) {
      const checkRange = 3;
      for (let i = Math.max(0, messageIndex - checkRange); i <= Math.min(messages.length - 1, messageIndex + checkRange); i++) {
        if (i !== messageIndex && messages[i]) {
          const otherTimestamp = messages[i].timestamp;
          const timeDifference = Math.abs(timestamp.getTime() - otherTimestamp.getTime());
          if (timeDifference < 3e5) {
            showSeconds = true;
            break;
          }
        }
      }
    }
    if (showSeconds) {
      return format2(timestamp, "h:mm:ss a");
    }
    return format2(timestamp, "h:mm a");
  };
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast("Copied to clipboard!");
    });
  };
  const renderStreamingMemberResponses = () => {
    if (!currentMemberResponses || currentMemberResponses.length === 0)
      return null;
    return /* @__PURE__ */ jsxs3("div", { className: "mt-4 mb-4 pb-3 border-b border-border", children: [
      /* @__PURE__ */ jsxs3(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setStreamingMemberResponsesExpanded(!streamingMemberResponsesExpanded),
          className: "text-xs text-muted-foreground mb-2 flex items-center gap-1 hover:bg-muted hover:text-foreground p-0 h-auto font-normal",
          children: [
            /* @__PURE__ */ jsx7(Users2, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxs3("span", { children: [
              "Team Member Responses (",
              currentMemberResponses.length,
              ")"
            ] }),
            streamingMemberResponsesExpanded ? /* @__PURE__ */ jsx7(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx7(ChevronDown2, { className: "h-3 w-3" })
          ]
        }
      ),
      streamingMemberResponsesExpanded && /* @__PURE__ */ jsx7("div", { className: "space-y-3", children: currentMemberResponses.map((member, index) => /* @__PURE__ */ jsxs3(
        "div",
        {
          className: "p-3 rounded-md bg-card border border-border",
          children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx7("span", { className: "text-sm font-medium text-foreground", children: getMemberDisplayName(member.member_id, member.member_name) }),
                member.model && /* @__PURE__ */ jsx7("span", { className: "text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded", children: member.model })
              ] }),
              member.created_at && /* @__PURE__ */ jsx7("span", { className: "text-xs text-muted-foreground", children: format2(new Date(member.created_at), "HH:mm:ss") })
            ] }),
            /* @__PURE__ */ jsx7("div", { className: "text-sm text-foreground", children: /* @__PURE__ */ jsx7(ReactMarkdown3, { components: markdownComponents, children: cleanDuplicateContent(member.content) }) }),
            member.tools && member.tools.length > 0 && /* @__PURE__ */ jsxs3("div", { className: "mt-2 pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsxs3("div", { className: "text-xs text-muted-foreground mb-1", children: [
                "Tools Used (",
                member.tools.length,
                ")"
              ] }),
              /* @__PURE__ */ jsx7("div", { className: "space-y-1", children: member.tools.map((tool, idx) => /* @__PURE__ */ jsxs3(
                "div",
                {
                  className: "text-xs bg-muted text-muted-foreground p-1.5 rounded",
                  children: [
                    /* @__PURE__ */ jsxs3("div", { className: "font-medium flex items-center gap-2", children: [
                      tool.tool_call_error ? /* @__PURE__ */ jsx7(XCircle2, { className: "w-3 h-3 text-red-500" }) : /* @__PURE__ */ jsx7(CheckCircle2, { className: "w-3 h-3 text-green-500" }),
                      String(tool.name || tool.tool_name || "Unknown Tool"),
                      typeof tool.metrics?.time === "number" && /* @__PURE__ */ jsxs3("span", { className: "text-muted-foreground", children: [
                        "(",
                        Number(tool.metrics.time).toFixed(2),
                        "s)"
                      ] })
                    ] }),
                    (tool.output || tool.result) && /* @__PURE__ */ jsx7("div", { className: "opacity-80 mt-1 max-h-20 overflow-hidden text-foreground", children: String(tool.output || tool.result) })
                  ]
                },
                `streaming-member-tool-${idx}`
              )) })
            ] })
          ]
        },
        `${member.member_id}-${index}`
      )) })
    ] });
  };
  return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col h-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full", children: [
    /* @__PURE__ */ jsx7("div", { className: `${isHomeTeam ? "p-2 sm:p-5" : ""} w-full h-full`, children: /* @__PURE__ */ jsxs3("div", { className: `flex flex-col h-full transition-all duration-300 w-full overflow-hidden ${isHomeTeam ? "border border-border rounded-[34px] max-w-4xl mx-auto p-4 bg-muted-3" : ""}`, children: [
      /* @__PURE__ */ jsx7("style", { children: `
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.2);
          border-radius: 20px;
        }
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background-color: rgba(155, 155, 155, 0.3);
        }
      ` }),
      /* @__PURE__ */ jsx7(
        "div",
        {
          ref: chatContainerRef,
          className: "flex-1 overflow-y-auto p-2 sm:p-4 pt-2 sm:pt-4 pb-1 chat-messages",
          style: { scrollBehavior: "smooth" },
          children: /* @__PURE__ */ jsx7("div", { className: `max-w-4xl w-full mx-auto min-h-full flex flex-col ${messages.length !== 0 ? "items-start justify-start" : "items-center justify-center"}`, children: isLoadingSession && messages.length === 0 ? /* @__PURE__ */ jsx7("div", { className: "flex justify-center items-center w-full", children: /* @__PURE__ */ jsx7(Loader22, { className: "h-8 w-8 text-muted-foreground animate-spin" }) }) : messages.length === 0 ? /* @__PURE__ */ jsx7("div", { className: "flex justify-center items-center w-full", children: /* @__PURE__ */ jsxs3("div", { className: "flex flex-col justify-center items-center text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsx7("h3", { className: "text-lg font-medium text-foreground-80 mb-2", children: "Start chatting with this team" }),
            /* @__PURE__ */ jsx7("p", { className: "max-w-md text-sm", children: "Send a message to start a conversation with this team of AI agents working together." })
          ] }) }) : /* @__PURE__ */ jsxs3("div", { className: "space-y-4 sm:space-y-6 w-full", children: [
            messages.map((message, index) => {
              const isUser = message.sender === "user";
              const timestamp = formatMessageTimestamp(message.timestamp, index);
              if (isUser) {
                return /* @__PURE__ */ jsx7("div", { className: "flex justify-end w-full px-2 sm:px-4", children: /* @__PURE__ */ jsxs3("div", { className: "flex flex-row gap-2 sm:gap-3 max-w-[85%] ml-auto", children: [
                  /* @__PURE__ */ jsxs3("div", { className: "rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex-1 overflow-x-auto border bubble-user ml-auto group", children: [
                    /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-center mb-1 text-xs text-muted-foreground-60", children: [
                      /* @__PURE__ */ jsxs3("span", { children: [
                        "You - ",
                        timestamp
                      ] }),
                      /* @__PURE__ */ jsx7(
                        "button",
                        {
                          onClick: () => handleCopy(message.content),
                          title: "Copy",
                          className: "ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground",
                          children: /* @__PURE__ */ jsx7(Copy, { className: "w-4 h-4" })
                        }
                      )
                    ] }),
                    renderMessageContent(message)
                  ] }),
                  !isHomeTeam && /* @__PURE__ */ jsx7("div", { className: "flex-shrink-0 ml-1 sm:ml-2", children: user ? /* @__PURE__ */ jsx7(Avatar, { className: "h-7 w-7 sm:h-8 sm:w-8 text-white", children: /* @__PURE__ */ jsx7(AvatarFallback, { className: "gradient-color", children: user?.username?.[0]?.toUpperCase() || "U" }) }) : /* @__PURE__ */ jsx7(Avatar, { className: "h-7 w-7 sm:h-8 sm:w-8 text-white", children: /* @__PURE__ */ jsx7(AvatarFallback, { className: "gradient-color", children: "U" }) }) })
                ] }) }, message.id);
              }
              return /* @__PURE__ */ jsx7("div", { className: "flex justify-start w-full px-2 sm:px-4", children: /* @__PURE__ */ jsxs3("div", { className: "flex flex-row gap-2 sm:gap-3 max-w-[85%]", children: [
                !isHomeTeam && /* @__PURE__ */ jsx7("div", { className: "flex-shrink-0 mr-1 sm:mr-2", children: /* @__PURE__ */ jsx7(Avatar, { className: "h-7 w-7 sm:h-8 sm:w-8 text-white", children: /* @__PURE__ */ jsx7(AvatarFallback, { className: `bg-gradient-to-br ${accentColor}`, children: "T" }) }) }),
                /* @__PURE__ */ jsxs3("div", { className: "rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex-1 overflow-x-auto border bubble-team group", children: [
                  /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-center mb-1 text-xs text-muted-foreground-60", children: [
                    /* @__PURE__ */ jsxs3("span", { children: [
                      "Team - ",
                      timestamp
                    ] }),
                    /* @__PURE__ */ jsx7(
                      "button",
                      {
                        onClick: () => handleCopy(message.content),
                        title: "Copy",
                        className: "ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground",
                        children: /* @__PURE__ */ jsx7(Copy, { className: "w-4 h-4" })
                      }
                    )
                  ] }),
                  renderMessageContent(message)
                ] })
              ] }) }, message.id);
            }),
            (isLoading || hasStreamedResponse) && normalizeEvents(currentEvents, currentStreamingContent, getMemberDisplayName).length > 0 && /* @__PURE__ */ jsx7("div", { className: `flex justify-start w-full px-2 sm:px-4`, children: /* @__PURE__ */ jsxs3("div", { className: `flex flex-row gap-2 sm:gap-3 max-w-[85%]`, children: [
              !isHomeTeam && /* @__PURE__ */ jsx7("div", { className: "flex-shrink-0 mr-1 sm:mr-2", children: /* @__PURE__ */ jsx7(Avatar, { className: "h-7 w-7 sm:h-8 sm:w-8 text-white", children: /* @__PURE__ */ jsx7(AvatarFallback, { className: `bg-gradient-to-br ${accentColor}`, children: "T" }) }) }),
              /* @__PURE__ */ jsxs3("div", { className: `rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${isLoading && !hasStreamedResponse ? "bubble-user ml-auto" : "bubble-team"} text-foreground flex-1 max-w-[700px] overflow-x-auto`, children: [
                /* @__PURE__ */ jsxs3("div", { className: "text-xs text-muted-foreground-60 mb-1", children: [
                  "Team - ",
                  formatMessageTimestamp(/* @__PURE__ */ new Date(), messages.length)
                ] }),
                renderStreamingMemberResponses(),
                /* @__PURE__ */ jsx7(
                  TeamEventTimeline,
                  {
                    events: normalizeEvents(currentEvents, currentStreamingContent, getMemberDisplayName),
                    isStreaming: true
                  }
                )
              ] })
            ] }) }),
            isLoading && !currentStreamingContent && /* @__PURE__ */ jsxs3("div", { className: "flex justify-start w-full px-2 sm:px-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300", children: [
              !isHomeTeam && /* @__PURE__ */ jsx7(
                "div",
                {
                  className: `w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${accentColor} flex items-center justify-center mr-2 sm:mr-2.5 flex-shrink-0 shadow-md`,
                  style: { animation: "pulse 2s infinite ease-in-out" },
                  children: /* @__PURE__ */ jsx7(Users2, { className: "h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" })
                }
              ),
              /* @__PURE__ */ jsxs3("div", { className: "rounded-2xl bg-card backdrop-blur-sm text-foreground px-4 py-3 shadow-md border border-zinc-600/30 relative overflow-hidden", children: [
                /* @__PURE__ */ jsx7(
                  "div",
                  {
                    className: "absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/10 to-transparent",
                    style: {
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s infinite linear",
                      animationFillMode: "forwards"
                    }
                  }
                ),
                /* @__PURE__ */ jsxs3("div", { className: "relative flex flex-col space-y-1.5", children: [
                  /* @__PURE__ */ jsxs3("div", { className: "flex space-x-2 items-center h-5", children: [
                    /* @__PURE__ */ jsx7(
                      "div",
                      {
                        className: `w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`,
                        style: { animation: "scale 1.4s infinite ease-in-out" }
                      }
                    ),
                    /* @__PURE__ */ jsx7(
                      "div",
                      {
                        className: `w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`,
                        style: { animation: "scale 1.4s infinite ease-in-out 0.2s" }
                      }
                    ),
                    /* @__PURE__ */ jsx7(
                      "div",
                      {
                        className: `w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`,
                        style: { animation: "scale 1.4s infinite ease-in-out 0.4s" }
                      }
                    ),
                    /* @__PURE__ */ jsx7("span", { className: "text-foreground-90 text-xs font-medium ml-1", children: "Thinking..." })
                  ] }),
                  /* @__PURE__ */ jsx7("span", { className: "text-muted-foreground text-xs", children: "Team is processing your request" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx7("div", { ref: messagesEndRef })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsx7("div", { className: "border-border", children: /* @__PURE__ */ jsxs3("div", { className: "max-w-full sm:max-w-3xl mx-auto w-full px-2 sm:px-4", children: [
        (selectedFiles.length > 0 || uploadedFileIds.length > 0) && /* @__PURE__ */ jsx7("div", { className: "max-w-4xl mx-auto w-full px-2 sm:px-4 mb-2 mt-2", children: /* @__PURE__ */ jsx7("div", { className: "flex flex-wrap gap-1", children: [
          ...selectedFiles.filter(
            (file) => !uploadedFileIds.some((f) => f.name === file.name && f.size === file.size)
          ),
          ...uploadedFileIds
        ].map((file) => {
          const fileKey = `${file.name}-${file.size}`;
          const isUploaded = uploadedFileIds.some((f) => f.name === file.name && f.size === file.size);
          return /* @__PURE__ */ jsxs3(
            "div",
            {
              className: "flex items-center bg-card px-2 py-1 rounded text-sm text-foreground max-w-full",
              children: [
                /* @__PURE__ */ jsx7(Paperclip, { className: "w-4 h-4 text-foreground-60 mr-1 shrink-0" }),
                /* @__PURE__ */ jsxs3("div", { className: "flex flex-col max-w-[200px]", children: [
                  /* @__PURE__ */ jsx7("span", { className: "truncate", children: file.name }),
                  uploadProgress[fileKey] !== void 0 && !isUploaded && /* @__PURE__ */ jsx7("div", { className: "w-full bg-muted-10 h-1 mt-1 rounded overflow-hidden", children: /* @__PURE__ */ jsx7(
                    "div",
                    {
                      className: "progress-color h-full transition-all duration-300",
                      style: { width: `${uploadProgress[fileKey]}%` }
                    }
                  ) })
                ] }),
                isUploaded && /* @__PURE__ */ jsx7(
                  "button",
                  {
                    type: "button",
                    disabled: isLoading || Object.values(uploadProgress).some((percent) => percent < 100),
                    onClick: () => setUploadedFileIds(
                      (prev) => prev.filter((f) => f.name !== file.name || f.size !== file.size)
                    ),
                    className: `ml-2 text-xs ${isLoading || Object.values(uploadProgress).some((p) => p < 100) ? "text-zinc-400 cursor-not-allowed" : "text-red-400 hover:text-red-600"}`,
                    children: "\u2715"
                  }
                )
              ]
            },
            fileKey
          );
        }) }) }),
        /* @__PURE__ */ jsxs3(
          "form",
          {
            onSubmit: handleUserMessageSubmit,
            className: `w-full border border-border rounded-2xl p-3 sm:p-4 flex flex-col gap-3 bg-chat-input ${isHomeTeam ? "" : "mb-6"} max-w-full sm:max-w-3xl mx-auto`,
            children: [
              /* @__PURE__ */ jsx7(
                TextareaAutosize,
                {
                  ref: textareaRef,
                  className: "w-full bg-transparent rounded-md p-2 sm:p-3 text-sm sm:text-base text-foreground \n                          placeholder:text-muted-foreground resize-none overflow-auto focus:outline-none focus:ring-0 focus:border-none",
                  placeholder: "Send a message...",
                  minRows: 1,
                  maxRows: 25,
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: handleKeyDown
                }
              ),
              /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-end", children: [
                /* @__PURE__ */ jsxs3("div", { children: [
                  /* @__PURE__ */ jsx7(
                    "label",
                    {
                      htmlFor: "file-upload",
                      className: `rounded-full form-button p-2 sm:p-3 h-11 w-11 flex items-center justify-center 
                    transition-colors duration-200 
                    ${isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`,
                      "aria-label": "Attach files",
                      children: /* @__PURE__ */ jsx7("span", { className: "text-xl font-bold text-white", children: "\uFF0B" })
                    }
                  ),
                  /* @__PURE__ */ jsx7(
                    "input",
                    {
                      type: "file",
                      multiple: true,
                      id: "file-upload",
                      title: "",
                      className: "hidden",
                      disabled: isLoading,
                      onChange: async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const MAX_SIZE = 10 * 1024 * 1024;
                          const newFiles = Array.from(e.target.files);
                          const tooLargeFiles = newFiles.filter((file) => file.size > MAX_SIZE);
                          const allowedFiles = newFiles.filter((file) => file.size <= MAX_SIZE);
                          if (tooLargeFiles.length > 0) {
                            const message = tooLargeFiles.map((file) => `\u2022 ${file.name} is too large (max 10MB)`).join("\n");
                            showToast(message);
                          }
                          if (allowedFiles.length === 0) {
                            e.target.value = "";
                            return;
                          }
                          const existingKeys = new Set(
                            uploadedFileIds.map((f) => `${f.name}-${f.size}`)
                          );
                          const filteredFiles = allowedFiles.filter(
                            (file) => !existingKeys.has(`${file.name}-${file.size}`)
                          );
                          if (filteredFiles.length === 0) {
                            e.target.value = "";
                            return;
                          }
                          setSelectedFiles(filteredFiles);
                          const result = await teamService.uploadFilesWithProgress(
                            teamId,
                            filteredFiles,
                            sessionId,
                            (fileKey, percent) => {
                              if (percent === -1) {
                                setSelectedFiles(
                                  (prev) => prev.filter((f) => `${f.name}-${f.size}` !== fileKey)
                                );
                              } else {
                                setUploadProgress((prev) => ({
                                  ...prev,
                                  [fileKey]: percent
                                }));
                              }
                            },
                            showToast
                          );
                          if (result?.data?.session_id && !sessionId) {
                            const newSessionId = result.data.session_id;
                            setSessionId(newSessionId);
                            sessionIdRef.current = newSessionId;
                          }
                          const uploaded = result?.data?.successful_files || [];
                          const mapped = uploaded.map((file) => ({
                            id: file.file_id,
                            name: file.original_filename,
                            size: file.size
                          }));
                          setUploadedFileIds((prev) => [...prev, ...mapped]);
                          setSelectedFiles(
                            (prev) => prev.filter(
                              (f) => !mapped.some((m) => m.name === f.name && m.size === f.size)
                            )
                          );
                          setUploadProgress({});
                          e.target.value = "";
                        }
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx7("div", { children: /* @__PURE__ */ jsx7(
                  Button,
                  {
                    type: "submit",
                    disabled: isLoading || !input.trim(),
                    className: `rounded-full form-button p-2 sm:p-3 h-11 w-11 flex items-center justify-center 
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
                    "aria-label": "Send message",
                    children: isLoading ? /* @__PURE__ */ jsx7(Loader22, { className: "h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" }) : /* @__PURE__ */ jsx7(Send, { className: "h-4 w-4 sm:h-5 sm:w-5 text-white" })
                  }
                ) })
              ] })
            ]
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx7(AlertDialog, { open: showNoCreditDialog, onOpenChange: setShowNoCreditDialog, children: /* @__PURE__ */ jsxs3(AlertDialogContent, { className: "bg-background border border-border", children: [
      /* @__PURE__ */ jsx7(AlertDialogHeader, { children: /* @__PURE__ */ jsxs3(AlertDialogTitle, { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsx7(AlertCircle, { className: "h-5 w-5 text-red-500" }),
        "Insufficient Credits"
      ] }) }),
      /* @__PURE__ */ jsx7(AlertDialogDescription, { className: "text-foreground-80", children: "You need credits to use the team chat feature. Purchase credits to continue." }),
      /* @__PURE__ */ jsxs3(AlertDialogFooter, { className: "mt-4", children: [
        /* @__PURE__ */ jsx7(AlertDialogCancel, { className: "bg-card hover:bg-card-hover text-foreground-80 border-border", children: "Cancel" }),
        /* @__PURE__ */ jsx7(AlertDialogAction, { asChild: true, children: /* @__PURE__ */ jsx7(Button, { className: "button-color text-foreground", asChild: true, children: /* @__PURE__ */ jsx7(Link, { to: "/payment", children: "Purchase Credits" }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx7(GlobalStyle, {})
  ] });
};
export {
  TeamChatInterface
};
//# sourceMappingURL=index.mjs.map