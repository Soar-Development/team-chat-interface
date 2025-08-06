export interface Team {
    id: string;
    name: string;
    description?: string;
    is_public: boolean;
    shared_with?: string[];
    owner_id: string;
    model_id: string;
    members: string[];
    created_at: string;
    updated_at: string;
    config: TeamConfig;
}

export interface TeamMember {
    name: string;
    role?: string;
    type: 'agent' | 'team';
    agent_config?: Record<string, any>;
    team_config?: Record<string, any>;
}

export interface TeamConfig {
    mode: 'coordinate' | 'collaborate';
    model_provider: string;
    model_id: string;
    model_settings?: Record<string, any>;
    instructions?: string;
    markdown?: boolean;
    enable_team_history?: boolean;
    num_history_runs?: number;
    share_member_interactions?: boolean;
    show_members_responses?: boolean;
    add_memory_references?: boolean;
    enable_session_summaries?: boolean;
    add_session_summary_references?: boolean;
    reasoning?: boolean;
    reasoning_min_steps?: number;
    reasoning_max_steps?: number;
    debug_mode?: boolean;
    monitoring?: boolean;
    telemetry?: boolean;
    is_paid?: boolean;
    credit_cost?: number;
    tools: any;
    members?: TeamMember[]; // Complex member configurations (optional)
}

export interface TeamSession {
    id?: string; // Our interface uses id but API might not
    session_id?: string; // API uses session_id
    team_id: string;
    user_id: string;
    name?: string | null;
    session_name?: string | null; // API might use session_name instead of name
    created_at?: string | number;
    updated_at?: string | number;
    last_updated?: number; // API might use last_updated instead of updated_at
    message_count: number;
    last_message?: string;
    metadata?: Record<string, any>;
}

export interface TeamSessionMessage {
    id: string;
    session_id: string;
    role: string;
    content: string;
    created_at: string;
    tools?: ToolCall[];
    member_responses?: MemberResponse[];
}

export interface MemberResponse {
    member_id: string;
    member_name: string;
    content: string;
    tools?: ToolCall[];
}

export interface ToolCall {
    name: string;
    arguments?: Record<string, any> | string;
    output?: string;
    role?: string;
    tool_name?: string;
    content?: string;
    created_at?: number;
    input?: Record<string, any>;
}

export interface TeamEvent {
    type: 'RunStarted' | 'ToolCallStarted' | 'ToolCallCompleted' | 'RunResponse' | 'MemberResponse';
    timestamp: number;
    data?: any;
}

export interface TeamService {
    getTeams: (limit?: number, skip?: number, includePublic?: boolean) => Promise<any>;
    getTeam: (teamId: string) => Promise<any>;
    getTeamSessions: (teamId: string, limit?: number, skip?: number) => Promise<any>;
    getAllSessions: (limit?: number, skip?: number) => Promise<any>;
    getSessionDetails: (sessionId: string) => Promise<any>;
    getSessionMessages: (sessionId: string, limit?: number, skip?: number) => Promise<any>;
    updateSession: (sessionId: string, data: { session_name: string }) => Promise<any>;
    deleteSession: (sessionId: string) => Promise<any>;
    updateTeam: (teamId: string, data: any) => Promise<any>;
    chatWithTeam: (
        teamId: string,
        message: string,
        sessionId?: string,
        stream?: boolean
    ) => Promise<any>;
    uploadFilesWithProgress: (
        teamId: string,
        files: File[],
        sessionId: string | undefined,
        onProgress: (fileKey: string, percent: number) => void,
        showToast: (message: string) => void
    ) => Promise<{ data: { successful_files: any[]; session_id?: string } }>;
    chatWithTeamStream: (
        teamId: string,
        message: string,
        sessionId: string | undefined,
        onChunk?: (content: string) => void,
        onToolEvent?: (toolEvent: string, data: any) => void,
        onMemberResponses?: (responses: any[]) => void,
        onEnd?: (sessionId: string, tools?: any[]) => void,
        onError?: (message: string) => void,
        fileIds?: string[]
    ) => { close: () => void };
    attachKnowledgeBaseToMember: (teamId: string, memberIndex: number, kbId: string) => Promise<any>;
    cloneTeam: (teamId: string) => Promise<any>;
    deleteTeam: (teamId: string) => Promise<any>;
}

export interface User {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
    wallet_address?: string;
    google_id?: string;
    name?: string;
    picture?: string;
}
