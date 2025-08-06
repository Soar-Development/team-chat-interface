import { TeamEvent, ToolCall } from '../types/types';

export type NormalizedEvent =
    | { type: 'RunStarted' }
    | {
        type: 'ToolRun';
        tool_name: string;
        tool_args: Record<string, any>;
        result?: string;
        error?: boolean;
        started_at: number;
        completed_at: number;
        formatted_calls?: string[];
    }
    | {
        type: 'MemberResponse';
        member_name: string;
        content: string;
        tools?: ToolCall[];
        model?: string;
        created_at?: number;
    }
    | {
        type: 'FinalResponse';
        content: string;
    };

export const normalizeEvents = (
    events: TeamEvent[],
    currentStreamingContent: string,
    getMemberDisplayName: (id: string, name?: string) => string
): NormalizedEvent[] => {
    const normalized: NormalizedEvent[] = [];

    const toolRuns: Record<
        string,
        Partial<NormalizedEvent & { type: 'ToolRun' }>
    > = {};

    const pendingToolOutputs: Record<string, true> = {};

    for (const event of events) {
        if (event.type === 'RunStarted') {
            normalized.push({ type: 'RunStarted' });
        }

        if (event.type === 'ToolCallStarted') {
            const tools = event.data?.tools || [];
            tools.forEach((tool: any) => {
                const existing = toolRuns[tool.tool_call_id] || {};
                toolRuns[tool.tool_call_id] = {
                    ...existing,
                    type: 'ToolRun',
                    tool_name: tool.tool_name || tool.name || 'Unknown Tool',
                    tool_args: tool.tool_args || tool.arguments || {},
                    started_at: tool.created_at || event.timestamp || Date.now()
                };
            });
        }

        if (event.type === 'ToolCallCompleted') {
            const tools = event.data?.tools || [event.data];
            tools.forEach((tool: any) => {
                const existing = toolRuns[tool.tool_call_id] || {};
                const memberId = tool.tool_args?.member_id || tool.arguments?.member_id;

                const matchedFormattedCalls =
                    event.data?.formatted_tool_calls?.filter((call: string) =>
                        memberId && call.includes(memberId)
                    ) || [];

                toolRuns[tool.tool_call_id] = {
                    ...existing,
                    type: 'ToolRun',
                    tool_name: tool.tool_name || tool.name || 'Unknown Tool',
                    tool_args: tool.tool_args || tool.arguments || {},
                    result: tool.result || tool.output || '',
                    error: tool.tool_call_error,
                    started_at: existing?.started_at || tool.created_at || event.timestamp,
                    completed_at: Date.now(),
                    formatted_calls: Array.from(new Set([
                        ...(existing.formatted_calls || []),
                        ...matchedFormattedCalls
                    ]))
                };

                delete pendingToolOutputs[tool.tool_call_id];
            });
        }

        if (event.type === 'RunResponse' || event.type === 'MemberResponse') {
            const members = event.data?.member_responses || [event.data];
            members.forEach((m: any) => {
                m.tools?.forEach((tool: any) => {
                    if (tool.status === 'completed' && tool.output === 'None') {
                      pendingToolOutputs[tool.tool_call_id] = true;
                    }
                  });

                normalized.push({
                    type: 'MemberResponse',
                    member_name: getMemberDisplayName(m.member_id, m.member_name),
                    content: m.content,
                    tools: m.tools,
                    model: m.model,
                    created_at: m.created_at,
                });
            });
        }
    }

    Object.values(toolRuns).forEach((tool) => {
        if (
            tool.type === 'ToolRun' &&
            tool.tool_name &&
            tool.tool_args &&
            typeof tool.started_at === 'number'
        ) {
            normalized.push({
                type: 'ToolRun',
                tool_name: tool.tool_name,
                tool_args: tool.tool_args,
                result: tool.result,
                error: tool.error,
                started_at: tool.started_at,
                completed_at: tool.completed_at ?? -1,
                formatted_calls: tool.formatted_calls || [],
            });
        }
    });

    if (currentStreamingContent?.trim()) {
        normalized.push({ type: 'FinalResponse', content: currentStreamingContent.trim() });
    }

    return normalized;
};