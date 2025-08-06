import React, { useState } from 'react';
import { CheckCircle, ChevronDown, XCircle, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ToolRunEvent {
    type: 'ToolRun';
    tool_name: string;
    tool_args: Record<string, unknown>;
    result?: string;
    error?: boolean;
    started_at: number;
    completed_at: number;
    formatted_calls?: string[];
}

interface MemberResponseEvent {
    type: 'MemberResponse';
    member_name: string;
    content: string;
    tools?: { tool_name?: string; name?: string }[];
    model?: string;
    created_at?: number;
}

interface RunStartedEvent {
    type: 'RunStarted';
}

interface FinalResponseEvent {
    type: 'FinalResponse';
    content: string;
}

export type SequencedEvent = ToolRunEvent | MemberResponseEvent | RunStartedEvent | FinalResponseEvent;

interface SequencedResponseBoxProps {
    event: SequencedEvent;
    index: number;
    isStreaming: boolean;
}

export const SequencedResponseBox: React.FC<SequencedResponseBoxProps> = ({ event, isStreaming }) => {
    const [expanded, setExpanded] = useState(isStreaming);
    const hasCollapsedAutomatically = React.useRef(false);

    React.useEffect(() => {
        if (event.type === 'ToolRun') {
            const tool = event as ToolRunEvent;
            const isCompleted = tool.completed_at !== -1 && tool.result !== 'None' && !tool.error;

            // Collapse only once when completed during streaming
            if (isStreaming && isCompleted && !hasCollapsedAutomatically.current) {
                setExpanded(false);
                hasCollapsedAutomatically.current = true;
            }

            // Final collapse if streaming ends and it hasn't collapsed yet
            if (!isStreaming && expanded && !isCompleted) {
                setExpanded(false);
                hasCollapsedAutomatically.current = true;
            }
        } else if (!isStreaming && expanded) {
            setExpanded(false);
        }
    }, [isStreaming, event]);

    const toggleExpanded = () => setExpanded(prev => !prev);

    const renderValue = (val: any) =>
        typeof val === 'string' && val.startsWith('http')
            ? <a href={val} className="text-blue-400 underline" target="_blank">{val}</a>
            : <span>{String(val).replace(/_/g, ' ')}</span>;

    const renderToolRun = (toolEvent: ToolRunEvent) => {
        const { tool_name, tool_args, result, error, completed_at } = toolEvent;

        const formattedMemberId =
            typeof tool_args.member_id === 'string'
                ? tool_args.member_id
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())
                : 'member';

        const formattedToolName = tool_name
            .replace('atransfer', 'transfer')
            .replace(/_/g, ' ')
            .replace(/\bmember\b/, formattedMemberId);

        return (
            <div className="bg-card rounded mb-2 border border-border relative">
                {/* Sticky header */}
                <div className="sticky top-0 bg-card z-10 border-b border-border px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        {error ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                        ) : completed_at && completed_at !== -1 && result !== 'None' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        )}
                        {formattedToolName}
                    </div>
                    <button onClick={toggleExpanded} className="text-xs text-blue-400 flex items-center gap-1">
                        {expanded ? 'Hide' : 'Show'} <ChevronDown className={`w-3 h-3 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Scrollable content */}
                {expanded && (
                    <div className="max-h-[360px] overflow-y-auto px-4 pt-4 pb-4 text-xs space-y-1">
                        {/* Content starts here */}
                        <div className="font-medium">
                            Time:
                            {/* {started_at ? ` ${format(new Date(started_at), 'HH:mm:ss')}` : ' Unknown'} - */}
                            {completed_at && completed_at !== -1
                                ? ` ${format(new Date(completed_at), 'HH:mm:ss')}`
                                : ' In progress'}
                        </div>
                        <div className="text-xs mt-2">
                            <div className="font-medium mb-1">Parameters:</div>
                            <ul className="space-y-1 ml-4 list-disc">
                                {Object.entries(tool_args).map(([key, value]) => (
                                    <li key={key}>
                                        <span className="font-semibold">{key.replace(/_/g, ' ')}:</span>{' '}
                                        {typeof value === 'string'
                                            ? value.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                            : renderValue(value)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {completed_at && completed_at !== -1 && tool_name.includes('transfer') && !error && result !== 'None' && toolEvent.formatted_calls?.length ? (
                            <div className="text-xs bg-muted p-2 rounded mt-2 border border-border font-mono break-words whitespace-pre-wrap space-y-1">
                                {toolEvent.formatted_calls.map((call, i) => (
                                    <div key={i}>
                                        {call.replace('atransfer_task_to_member', 'transfer_task_to_member')}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                {error ? (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                ) : completed_at && completed_at !== -1 && result !== 'None' ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                )}
                                <span className="text-muted-foreground">
                                    {error ? 'Error' : completed_at && completed_at !== -1 && result !== 'None' ? 'Completed' : 'Running'}
                                </span>
                            </div>
                        )}
                        {result && result !== 'None' ? (
                            <div className="mt-2 text-sm space-y-3">
                                {(() => {
                                    try {
                                        // Try to split out valid JSON from the start
                                        const trimmed = result.trim();

                                        // Heuristic: find where the JSON part ends
                                        const jsonEndIndex = (() => {
                                            let stack = [];
                                            for (let i = 0; i < trimmed.length; i++) {
                                                const char = trimmed[i];
                                                if (char === '{' || char === '[') stack.push(char);
                                                if (char === '}' || char === ']') stack.pop();
                                                if (stack.length === 0 && (char === '}' || char === ']')) {
                                                    return i + 1;
                                                }
                                            }
                                            return -1;
                                        })();

                                        const jsonPart = trimmed.slice(0, jsonEndIndex).trim();
                                        const markdownPart = trimmed.slice(jsonEndIndex).trim();

                                        const parsedJson = JSON.parse(jsonPart);

                                        return (
                                            <>
                                                {/* JSON part */}
                                                <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap break-words border border-border overflow-x-auto">
                                                    <code>{JSON.stringify(parsedJson, null, 2)}</code>
                                                </pre>

                                                {/* Markdown part */}
                                                {markdownPart && (
                                                    <div className="bg-muted p-4 rounded border border-border">
                                                        <ReactMarkdown
                                                            children={markdownPart}
                                                            components={{
                                                                p: ({ children }) => (
                                                                    <p className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
                                                                        {children}
                                                                    </p>
                                                                ),
                                                                code: ({ children }) => (
                                                                    <code className="bg-card text-purple-300 px-1 rounded">{children}</code>
                                                                ),
                                                                li: ({ children }) => (
                                                                    <li className="ml-4 list-disc">{children}</li>
                                                                ),
                                                                h2: ({ children }) => (
                                                                    <h2 className="text-foreground text-xl mt-4 mb-2">{children}</h2>
                                                                ),
                                                                h3: ({ children }) => (
                                                                    <h3 className="text-foreground text-lg mt-3 mb-1">{children}</h3>
                                                                ),
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        );
                                    } catch (err) {
                                        // Enhanced fallback: detect step-based or just render whole thing as markdown
                                        if (/Step \d+:/.test(result)) {
                                            return Array.from(
                                                new Set(
                                                    result
                                                        .split(/(?=Step \d+:)/g)
                                                        .map((s) => s.trim().replace(/,+$/, ''))
                                                )
                                            )
                                                .filter((s) => s)
                                                .map((step, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-muted p-3 rounded border border-border space-y-1"
                                                    >
                                                        {step.split('\n').map((line, j) => {
                                                            const match = line.match(/^(Title|Reasoning|Action|Confidence):\s*(.*)$/);
                                                            if (match) {
                                                                return (
                                                                    <div key={j}>
                                                                        <span className="font-semibold">{match[1]}:</span>{' '}
                                                                        <ReactMarkdown
                                                                            children={match[2]}
                                                                            components={{
                                                                                p: ({ children }) => (
                                                                                    <span className="prose prose-invert max-w-none">
                                                                                        {children}
                                                                                    </span>
                                                                                ),
                                                                            }}
                                                                        />
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <ReactMarkdown
                                                                        key={j}
                                                                        children={line}
                                                                        components={{
                                                                            p: ({ children }) => (
                                                                                <p className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
                                                                                    {children}
                                                                                </p>
                                                                            ),
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                ));
                                        } else {
                                            // Pure markdown (like validation logs, error dumps, etc)
                                            return (
                                                <div className="bg-muted p-4 rounded border border-border">
                                                    <ReactMarkdown
                                                        children={result}
                                                        components={{
                                                            pre: ({ children }) => (
                                                                <pre className="bg-card p-3 rounded overflow-x-auto text-xs whitespace-pre-wrap break-words border border-zinc-600">
                                                                    {children}
                                                                </pre>
                                                            ),
                                                            code: ({ children }) => (
                                                                <code className="bg-card text-purple-300 px-1 rounded">{children}</code>
                                                            ),
                                                            p: ({ children }) => (
                                                                <p className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
                                                                    {children}
                                                                </p>
                                                            ),
                                                            li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                                                            h2: ({ children }) => <h2 className="text-foreground text-xl mt-4 mb-2">{children}</h2>,
                                                            h3: ({ children }) => <h3 className="text-foreground text-lg mt-3 mb-1">{children}</h3>,
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                    }
                                })()}
                            </div>
                        ) : (
                            <div className="bg-muted p-2 rounded text-sm text-muted-foreground">
                                Pending ...
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderMemberResponse = (memberEvent: MemberResponseEvent) => {
        const { member_name, content, tools, model, created_at } = memberEvent;

        return (
            <div className="bg-card p-3 rounded mb-2 border border-border">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-sm text-foreground">{member_name}</span>
                        {model && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                {model}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleExpanded}
                        className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                        {expanded ? 'Hide' : 'Show'}{' '}
                        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {expanded && (
                    <div className="mt-2 text-sm text-foreground">
                        <ReactMarkdown
                            children={content}
                            components={{
                                p: ({ children }) => (
                                    <p className="prose max-w-none prose-invert dark:prose-invert">{children}</p>
                                ),
                            }}
                        />

                        {tools && tools.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                <span className="font-medium">Tools used:</span>{' '}
                                {tools.map((t) => t.tool_name || t.name || 'Unknown Tool').join(', ')}
                            </div>
                        )}

                        {created_at && (
                            <div className="text-xs text-muted-foreground mt-1">
                                🕓 {format(new Date(created_at), 'HH:mm:ss')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderRunStarted = () => (
        <div className="text-xs text-muted-foreground mb-2">🔄 Run started...</div>
    );

    if (event.type === 'ToolRun') return renderToolRun(event);
    if (event.type === 'MemberResponse') return renderMemberResponse(event);
    if (event.type === 'RunStarted') return renderRunStarted();

    return null;
};