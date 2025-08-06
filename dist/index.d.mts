import * as react_jsx_runtime from 'react/jsx-runtime';

interface TeamService {
    getTeams: (limit?: number, skip?: number, includePublic?: boolean) => Promise<any>;
    getTeam: (teamId: string) => Promise<any>;
    getTeamSessions: (teamId: string, limit?: number, skip?: number) => Promise<any>;
    getAllSessions: (limit?: number, skip?: number) => Promise<any>;
    getSessionDetails: (sessionId: string) => Promise<any>;
    getSessionMessages: (sessionId: string, limit?: number, skip?: number) => Promise<any>;
    updateSession: (sessionId: string, data: {
        session_name: string;
    }) => Promise<any>;
    deleteSession: (sessionId: string) => Promise<any>;
    updateTeam: (teamId: string, data: any) => Promise<any>;
    chatWithTeam: (teamId: string, message: string, sessionId?: string, stream?: boolean) => Promise<any>;
    uploadFilesWithProgress: (teamId: string, files: File[], sessionId: string | undefined, onProgress: (fileKey: string, percent: number) => void, showToast: (message: string) => void) => Promise<{
        data: {
            successful_files: any[];
            session_id?: string;
        };
    }>;
    chatWithTeamStream: (teamId: string, message: string, sessionId: string | undefined, onChunk?: (content: string) => void, onToolEvent?: (toolEvent: string, data: any) => void, onMemberResponses?: (responses: any[]) => void, onEnd?: (sessionId: string, tools?: any[]) => void, onError?: (message: string) => void, fileIds?: string[]) => {
        close: () => void;
    };
    attachKnowledgeBaseToMember: (teamId: string, memberIndex: number, kbId: string) => Promise<any>;
    cloneTeam: (teamId: string) => Promise<any>;
    deleteTeam: (teamId: string) => Promise<any>;
}
interface User {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
    wallet_address?: string;
    google_id?: string;
    name?: string;
    picture?: string;
}

interface TeamChatInterfaceProps {
    teamId: string;
    initialSessionId?: string;
    initialMessage?: string | null;
    onSessionChange?: (sessionId: string) => void;
    onMessageReceived?: () => void;
    isHomeTeam?: boolean;
    setVncUrl: (url: string) => void;
    setIsIframeOpen: (open: boolean) => void;
    teamService: TeamService;
    useAuthStore: () => {
        user: User | null;
    };
    useCreditStore: () => {
        fetchBalance: () => Promise<void>;
    };
    useToast: () => {
        showToast: (message: string) => void;
    };
}
declare const TeamChatInterface: ({ teamId, initialSessionId, initialMessage, onSessionChange, onMessageReceived, isHomeTeam, setVncUrl, setIsIframeOpen, teamService, useAuthStore, useCreditStore, useToast }: TeamChatInterfaceProps) => react_jsx_runtime.JSX.Element;

export { TeamChatInterface };
