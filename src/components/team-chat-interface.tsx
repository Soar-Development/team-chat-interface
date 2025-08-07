import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './button';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { Loader2, AlertCircle, Users, ChevronDown, ChevronUp, Paperclip, CheckCircle, XCircle, Send, ArrowRight, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { getAccentColor } from '../utils/utils';
import { Avatar, AvatarFallback } from './avatar';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { normalizeEvents } from '../utils/normalize-events';
import { TeamEventTimeline } from './team-event-timeline';
import { cleanMessageContent, markdownComponents } from '../utils/chat-utils';
import { TeamService, User } from '../types/types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'team';
  timestamp: Date;
  tools?: ToolCall[];
  memberResponses?: MemberResponse[];
  fileIds?: string[];
  activeTools?: ActiveTool[]; // Tools currently executing
  completedTools?: CompletedTool[]; // Tools that finished execution
  events?: TeamEvent[]; // Event timeline
}

interface MemberResponse {
  member_id: string;
  member_name?: string;
  content: string;
  tools?: ToolCall[];
  model?: string;
  created_at?: number;
}

interface ToolCall {
  role?: string;
  content?: string;
  created_at?: number;
  metrics?: Record<string, unknown>;
  tool_name?: string;
  tool_call_id?: string;
  tool_args?: Record<string, unknown>;
  tool_call_error?: boolean;
  name?: string;
  output?: string;
  arguments?: string | Record<string, unknown>;
  input?: Record<string, unknown>;
  timestamp?: number;
  result?: string; // Tool execution result - this is where the main content is stored
  requires_confirmation?: boolean;
  confirmed?: boolean;
  confirmation_note?: string;
  requires_user_input?: boolean;
  user_input_schema?: any;
  external_execution_required?: boolean;
  stop_after_tool_call?: boolean;
}

// New interfaces for enhanced tool tracking
interface ActiveTool {
  tool_call_id: string;
  tool_name: string;
  tool_args: Record<string, unknown>;
  started_at: number;
  status: 'starting' | 'running' | 'waiting_confirmation' | 'waiting_input';
  formatted_call?: string;
}

interface CompletedTool {
  tool_call_id: string;
  tool_name: string;
  tool_args: Record<string, unknown>;
  result?: string;
  error?: boolean;
  metrics?: Record<string, unknown>;
  started_at: number;
  completed_at: number;
  formatted_call?: string;
}

interface TeamEvent {
  type: 'RunStarted' | 'ToolCallStarted' | 'ToolCallCompleted' | 'RunResponse' | 'MemberResponse';
  timestamp: number;
  data?: any;
}

interface ServerToolCall {
  id?: string;
  type?: string;
  role?: string;
  content?: string;
  created_at?: number;
  metrics?: Record<string, unknown>;
  tool_name?: string;
  tool_call_id?: string;
  tool_args?: Record<string, unknown>;
  tool_call_error?: boolean;
  name?: string;
  output?: string;
  arguments?: string | Record<string, unknown>;
  input?: Record<string, unknown>;
  timestamp?: number;
  result?: string;
  requires_confirmation?: boolean;
  confirmed?: boolean;
  confirmation_note?: string;
  requires_user_input?: boolean;
  user_input_schema?: any;
  external_execution_required?: boolean;
  stop_after_tool_call?: boolean;
  function?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
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
  useAuthStore: () => { user: User | null };
  useCreditStore: () => { fetchBalance: () => Promise<void> };
  useToast: () => { showToast: (message: string) => void };
}

export const TeamChatInterface = ({
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
}: TeamChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStreamedResponse, setHasStreamedResponse] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [currentStreamingContent, setCurrentStreamingContent] = useState('');
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const websocketRef = useRef<{ close: () => void } | null>(null);
  const streamingContentRef = useRef('');
  const messagesRef = useRef<Message[]>([]);
  const isNewlyCreatedSession = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [accentColor, setAccentColor] = useState<string>('from-indigo-500 to-purple-500');
  const { user } = useAuthStore();
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastUserScrollPosition = useRef(0);

  const [currentTools, setCurrentTools] = useState<ToolCall[]>([]);
  const [activeTools, setActiveTools] = useState<ActiveTool[]>([]);
  const [completedTools, setCompletedTools] = useState<CompletedTool[]>([]);
  const [currentEvents, setCurrentEvents] = useState<TeamEvent[]>([]);
  const currentToolsRef = useRef<ToolCall[]>([]);
  const streamingMessageId = useRef<string | null>(null);
  const currentEventsRef = useRef<TeamEvent[]>([]);
  const { fetchBalance } = useCreditStore();
  const [showNoCreditDialog, setShowNoCreditDialog] = useState(false);
  const [currentMemberResponses, setCurrentMemberResponses] = useState<MemberResponse[]>([]);
  const currentMemberResponsesRef = useRef<MemberResponse[]>([]);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});
  const [streamingMemberResponsesExpanded, setStreamingMemberResponsesExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<{ id: string; name: string; size: number }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { showToast } = useToast();
  const sessionIdRef = useRef<string | undefined>(initialSessionId);

  // Helper functions - defined early so they can be used in loadSessionMessages
  const apiTimestampToDate = (timestamp?: string | number): Date => {
    if (!timestamp) return new Date();

    if (typeof timestamp === 'string') {
      // Try to parse ISO string first
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) return date;

      // If that fails, try parsing as a unix timestamp
      return new Date(parseInt(timestamp) * 1000);
    }

    // Handle numeric timestamp (assume unix timestamp in seconds)
    return new Date(timestamp * 1000);
  };

  const getMemberDisplayName = (memberId: string, memberName?: string): string => {
    // If we have a proper member name that's not "Unknown Member", use it
    if (memberName && memberName !== "Unknown Member" && memberName !== "unknown") {
      return memberName;
    }

    // Map member_id to proper display names
    const memberDisplayNames: Record<string, string> = {
      'pranalyst': 'PR Analyst',
      'code-reviewer': 'Code Reviewer',
      'security-auditor': 'Security Auditor',
      'github-specialist': 'GitHub Specialist',
      'tech-lead': 'Tech Lead',
      'unknown': 'Team Member'
    };

    return memberDisplayNames[memberId] || memberName || memberId;
  };

  const cleanDuplicateContent = (content: string): string => {
    if (!content) return content;

    // Split content into lines for processing
    const lines = content.split('\n');
    const seenLines = new Set<string>();
    const cleanedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and very short lines for deduplication
      if (trimmedLine.length < 10) {
        cleanedLines.push(line);
        continue;
      }

      // Check for duplicate lines (case insensitive)
      const normalizedLine = trimmedLine.toLowerCase();
      if (!seenLines.has(normalizedLine)) {
        seenLines.add(normalizedLine);
        cleanedLines.push(line);
      }
    }

    return cleanedLines.join('\n').trim();
  };

  // Add global styles for animations
  const GlobalStyle = () => (
    <style
      dangerouslySetInnerHTML={{
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
    `,
      }}
    />
  );

  useEffect(() => {
    if (isHomeTeam && messages.length === 0 && !sessionId) {
      const welcomeMessage: Message = {
        id: 'welcome-message',
        content: 'What kind of team do you need?',
        sender: 'team',
        timestamp: new Date(),
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
      // Only set a new session ID if it's valid
      if (initialSessionId && initialSessionId !== 'undefined') {
        setSessionId(initialSessionId);
      } else {
        // If no valid session ID, clear messages unless it's a newly created session
        if (!isNewlyCreatedSession.current) {
          setMessages([]);
          setSessionId(undefined);
        }
      }
      isNewlyCreatedSession.current = false;
    }
  }, [initialSessionId, sessionId]);

  useEffect(() => {
    // Set a consistent accent color for this chat session
    if (teamId && teamId !== 'undefined') {
      setAccentColor(getAccentColor(teamId));
    }
  }, [teamId]);

  useEffect(() => {
    currentToolsRef.current = currentTools;
  }, [currentTools]);

  // Handle initial message - automatically send it if provided and no session exists
  useEffect(() => {
    if (initialMessage && !sessionId && !hasProcessedInitialMessage && !isLoading) {
      setInput(initialMessage);
      setHasProcessedInitialMessage(true);

      // Auto-submit the initial message after a short delay
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }, 100);
    }
  }, [initialMessage, sessionId, hasProcessedInitialMessage, isLoading]);

  const loadSessionMessages = useCallback(async (sid: string) => {
    if (isNewlyCreatedSession.current || !sid || sid === 'undefined') return;
    setIsLoadingSession(true);
    try {
      // First get session details to get team context with member interactions
      const [sessionDetailsResponse, messagesResponse] = await Promise.all([
        teamService.getSessionDetails(sid),
        teamService.getSessionMessages(sid)
      ]);

      const sessionDetails = sessionDetailsResponse.data;
      const apiMessages = messagesResponse.data;
      const formattedMessages: Message[] = [];

      // Extract member interactions from team context if available
      const teamContext = sessionDetails.team_context || {};
      const sessionContext = teamContext[sid] || {};
      const memberInteractions = sessionContext.member_interactions || [];

      for (let i = 0; i < apiMessages.length; i++) {
        const msg = apiMessages[i];

        // Skip system messages
        if (msg.role === 'system') continue;

        // Handle user messages
        if (msg.role === 'user') {
          formattedMessages.push({
            id: `message-${msg.created_at || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            content: msg.content || '',
            sender: 'user',
            timestamp: apiTimestampToDate(msg.created_at),
          });
          continue;
        }

        // Handle team/assistant messages
        if (msg.role === 'assistant' || msg.role === 'team_response') {
          // Check for duplicate timestamp (handle multiple team_response messages from same turn)
          const existingMessageIndex = formattedMessages.findIndex(existingMsg =>
            existingMsg.sender === 'team' &&
            Math.abs(apiTimestampToDate(msg.created_at).getTime() - existingMsg.timestamp.getTime()) < 1000
          );

          // If we find a message with the same timestamp, merge them
          if (existingMessageIndex !== -1) {
            const existingMessage = formattedMessages[existingMessageIndex];

            // Prefer assistant over team_response for timestamp
            if (msg.role === 'assistant') {
              existingMessage.timestamp = apiTimestampToDate(msg.created_at);
            }

            // Choose the better content (prefer longer, more detailed content)
            const newContent = msg.content || '';
            const existingContent = existingMessage.content || '';

            // Smart content selection to prevent concatenation artifacts
            // Only replace if new content is significantly longer and more detailed
            if (newContent.length > existingContent.length * 1.5 ||
              (newContent.length > 100 && existingContent.length < 50)) {
              // Check if the new content looks like it contains the existing content (concatenation artifact)
              if (!newContent.includes(existingContent.substring(0, Math.min(100, existingContent.length)))) {
                existingMessage.content = newContent;
              }
            }
            // If new content is much shorter but existing is very short, might be a better summary
            else if (existingContent.length < 20 && newContent.length > 20) {
              existingMessage.content = newContent;
            }
            // Prefer team_response content over assistant content when they're similar length
            else if (msg.role === 'team_response' && Math.abs(newContent.length - existingContent.length) < 100) {
              existingMessage.content = newContent;
            }

            // Merge member responses if available (don't duplicate)
            if (msg.member_responses && Array.isArray(msg.member_responses) && msg.member_responses.length > 0) {
              const memberResponses = msg.member_responses.map((response: any) => ({
                member_id: response.agent_id || response.member_id || 'unknown',
                member_name: getMemberDisplayName(response.agent_id || response.member_id || 'unknown', response.member_name || response.agent_name),
                content: cleanDuplicateContent(response.content || ''),
                tools: response.tools || []
              }));

              // Only add member responses if we don't already have them
              if (!existingMessage.memberResponses || existingMessage.memberResponses.length === 0) {
                existingMessage.memberResponses = memberResponses;
              }
            }

            // Merge tools if available (avoid duplicates)
            if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
              const newTools: ToolCall[] = [];
              msg.tool_calls.forEach((toolCall: ServerToolCall) => {
                const functionData = toolCall.function || {};
                newTools.push({
                  role: (toolCall.role as string) || 'tool',
                  content: (toolCall.content as string) || '',
                  created_at: toolCall.created_at as number,
                  metrics: (toolCall.metrics as Record<string, unknown>) || {},
                  tool_name:
                    (functionData.name as string) ||
                    (toolCall.tool_name as string) ||
                    (toolCall.name as string) ||
                    '',
                  tool_call_id:
                    (toolCall.id as string) ||
                    (toolCall.tool_call_id as string) ||
                    `tool-${toolCall.created_at || Date.now()}`,
                  tool_args:
                    (functionData.arguments as Record<string, unknown>) ||
                    (toolCall.tool_args as Record<string, unknown>) ||
                    (toolCall.arguments as Record<string, unknown>) ||
                    {},
                  tool_call_error: (toolCall.tool_call_error as boolean) || false,
                  name: (functionData.name as string) || (toolCall.name as string) || '',
                  output: (toolCall.output as string) || '',
                  arguments: functionData.arguments || toolCall.arguments || {},
                  input: (toolCall.input as Record<string, unknown>) || {},
                  timestamp: (toolCall.timestamp as number) || (toolCall.created_at as number),
                });
              });

              if (newTools.length > 0 && (!existingMessage.tools || existingMessage.tools.length === 0)) {
                existingMessage.tools = newTools;
              }
            }

            continue; // Skip creating a new message
          }

          // If no duplicate timestamp found, check for duplicate content as before
          const currentContent = (msg.content || '').trim();

          // Check for exact content duplication
          const isDuplicateContent = formattedMessages.some(existingMsg =>
            existingMsg.sender === 'team' &&
            existingMsg.content.trim() === currentContent
          );

          // Check for similar content (potential duplicates with minor variations)
          const isSimilarContent = formattedMessages.some(existingMsg => {
            if (existingMsg.sender !== 'team') return false;
            const existingContent = existingMsg.content.trim();

            // Skip if either content is too short to compare meaningfully
            if (existingContent.length < 50 || currentContent.length < 50) return false;

            // Check if one content contains most of the other (80% overlap)
            const shorterContent = existingContent.length < currentContent.length ? existingContent : currentContent;
            const longerContent = existingContent.length >= currentContent.length ? existingContent : currentContent;

            return longerContent.includes(shorterContent.substring(0, Math.min(200, shorterContent.length * 0.8)));
          });

          // If this is an assistant message and we already have the same/similar content as team_response, skip it
          if (msg.role === 'assistant' && (isDuplicateContent || isSimilarContent)) {
            continue;
          }

          // If this is a team_response and we have an assistant message with same/similar content, replace it
          if (msg.role === 'team_response') {
            const duplicateIndex = formattedMessages.findIndex(existingMsg =>
              existingMsg.sender === 'team' &&
              (existingMsg.content.trim() === currentContent ||
                (existingMsg.content.length > 50 && currentContent.length > 50 &&
                  currentContent.includes(existingMsg.content.substring(0, Math.min(200, existingMsg.content.length * 0.8)))))
            );

            if (duplicateIndex !== -1) {
              // Remove the duplicate/similar message, we'll replace it with this team_response
              formattedMessages.splice(duplicateIndex, 1);
            }
          }

          // Convert tool_calls to tools format
          const tools: ToolCall[] = [];
          if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
            msg.tool_calls.forEach((toolCall: ServerToolCall) => {
              const functionData = toolCall.function || {};
              tools.push({
                role: (toolCall.role as string) || 'tool',
                content: (toolCall.content as string) || '',
                created_at: toolCall.created_at as number,
                metrics: (toolCall.metrics as Record<string, unknown>) || {},
                tool_name:
                  (functionData.name as string) ||
                  (toolCall.tool_name as string) ||
                  (toolCall.name as string) ||
                  '',
                tool_call_id:
                  (toolCall.id as string) ||
                  (toolCall.tool_call_id as string) ||
                  `tool-${toolCall.created_at || Date.now()}`,
                tool_args:
                  (functionData.arguments as Record<string, unknown>) ||
                  (toolCall.tool_args as Record<string, unknown>) ||
                  (toolCall.arguments as Record<string, unknown>) ||
                  {},
                tool_call_error: (toolCall.tool_call_error as boolean) || false,
                name: (functionData.name as string) || (toolCall.name as string) || '',
                output: (toolCall.output as string) || '',
                arguments: functionData.arguments || toolCall.arguments || {},
                input: (toolCall.input as Record<string, unknown>) || {},
                timestamp: (toolCall.timestamp as number) || (toolCall.created_at as number),
              });
            });
          }

          // Use member_responses from the message if available, otherwise use from team context
          let memberResponses: MemberResponse[] = [];
          let mainContent = msg.content || '';

          if (msg.member_responses && Array.isArray(msg.member_responses)) {
            memberResponses = msg.member_responses.map((response: any) => ({
              member_id: response.agent_id || response.member_id || 'unknown',
              member_name: getMemberDisplayName(response.agent_id || response.member_id || 'unknown', response.member_name || response.agent_name),
              content: cleanDuplicateContent(response.content || ''),
              tools: response.tools || []
            }));

            // For team_response messages, the content is already the coordinator's summary
            // Only clean for assistant messages where content might contain embedded member responses
            if (msg.role === 'assistant' && memberResponses.length > 0) {
              // Check if the main content contains member response content and clean it up
              let cleanedContent = mainContent;

              // Remove UUID patterns at the beginning
              cleanedContent = cleanedContent.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}[\s\n]*/gi, '').trim();

              // Look for patterns that indicate member response content is embedded
              memberResponses.forEach(memberResponse => {
                if (memberResponse.content && memberResponse.content.length > 50) {
                  const memberContent = memberResponse.content.trim();

                  // Check if the member content is included
                  if (cleanedContent.includes(memberContent)) {
                    // Remove the member content entirely
                    cleanedContent = cleanedContent.replace(memberContent, '').trim();
                  } else {
                    // Try to find partial matches (first 200 characters)
                    const memberContentStart = memberContent.substring(0, 200);
                    if (cleanedContent.includes(memberContentStart)) {
                      const startIndex = cleanedContent.indexOf(memberContentStart);
                      cleanedContent = cleanedContent.substring(0, startIndex).trim();
                    }
                  }
                }
              });

              // Clean up any remaining artifacts
              cleanedContent = cleanedContent
                .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '')
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .trim();

              // Use cleaned content if it's reasonable, otherwise keep original
              if (cleanedContent.length > 10 || mainContent.length < 100) {
                mainContent = cleanedContent;
              }
            }
            // For team_response messages, don't clean the content - it's already the coordinator's summary
          } else if (memberInteractions.length > 0) {
            // Fallback to team context member interactions
            memberResponses = memberInteractions.map((interaction: any) => ({
              member_id: interaction.member_name || 'Unknown Member',
              content: interaction.response?.content || interaction.task || '',
              tools: interaction.response?.tools || []
            }));
          }

          // Check if the last message was also from the team and merge if so
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'team') {
            // Smart content merging - choose the better content instead of concatenating
            const newContent = mainContent.trim();
            const existingContent = lastMessage.content.trim();

            // Smart content selection to prevent concatenation artifacts
            // Only replace if new content is significantly longer and more detailed
            if (newContent.length > existingContent.length * 1.5 ||
              (newContent.length > 100 && existingContent.length < 50)) {
              // Check if the new content looks like it contains the existing content (concatenation artifact)
              if (!newContent.includes(existingContent.substring(0, Math.min(100, existingContent.length)))) {
                lastMessage.content = newContent;
              }
            }
            // If new content is much shorter but existing is very short, might be a better summary
            else if (existingContent.length < 20 && newContent.length > 20) {
              lastMessage.content = newContent;
            }
            // Prefer team_response content over assistant content when they're similar length
            else if (msg.role === 'team_response' && Math.abs(newContent.length - existingContent.length) < 100) {
              lastMessage.content = newContent;
            }

            // Merge tools without duplicates
            if (tools.length > 0) {
              const existingToolIds = (lastMessage.tools || []).map(t => t.tool_call_id);
              const newTools = tools.filter(t => !existingToolIds.includes(t.tool_call_id));
              if (newTools.length > 0) {
                lastMessage.tools = [...(lastMessage.tools || []), ...newTools];
              }
            }

            // Merge member responses without duplicates
            if (memberResponses.length > 0) {
              const existingMemberIds = (lastMessage.memberResponses || []).map(m => m.member_id);
              const newMemberResponses = memberResponses.filter(m => !existingMemberIds.includes(m.member_id));
              if (newMemberResponses.length > 0) {
                lastMessage.memberResponses = [...(lastMessage.memberResponses || []), ...newMemberResponses];
              }
            }
          } else {
            // Create a new team message
            const teamMessage: Message = {
              id: `message-${msg.created_at || Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,
              content: mainContent,
              sender: 'team',
              timestamp: apiTimestampToDate(msg.created_at),
              tools: tools.length > 0 ? tools : msg.tools || [],
              // Use member responses from message or context
              memberResponses: memberResponses.length > 0 ? memberResponses : undefined,
            };

            formattedMessages.push(teamMessage);
          }
          continue;
        }
      }

      // Sort messages by timestamp to ensure chronological order
      formattedMessages.sort((a, b) => {
        const timeA = a.timestamp.getTime();
        const timeB = b.timestamp.getTime();

        // If timestamps are very close (within 1 second), prioritize user messages before team messages
        if (Math.abs(timeA - timeB) < 1000) {
          if (a.sender === 'user' && b.sender === 'team') return -1;
          if (a.sender === 'team' && b.sender === 'user') return 1;
        }

        return timeA - timeB;
      });

      const finalMessages: Message[] = [];
      let updatedMessages = formattedMessages;

      if (isHomeTeam) {
        const lastTeamMessage = [...finalMessages].reverse().find(
          msg => msg.sender === 'team' && typeof msg.content === 'string'
        );
        if (lastTeamMessage && lastTeamMessage.content) {
          const teamIdMatch = lastTeamMessage.content.match(
            /team[\s_-]*id[^a-f0-9]*([a-f0-9]{24})/i
          );

          const fallbackUrlMatch = lastTeamMessage.content.match(
            /\/teams\/([a-f0-9]{24})\/chat/i
          );

          const extractedTeamId = teamIdMatch?.[1] || fallbackUrlMatch?.[1];

          if (extractedTeamId && !finalMessages.some(msg => msg.content === `followup::${extractedTeamId}`)) {
            const followUpMessage: Message = {
              id: `follow-up-${Date.now()}`,
              content: `followup::${extractedTeamId}`,
              sender: 'team',
              timestamp: new Date(),
            };

            updatedMessages = [...finalMessages, followUpMessage];
          }
        }
      }

      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error loading session messages:', error);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    if (
      sessionId &&
      sessionId !== 'undefined' &&
      !isNewlyCreatedSession.current
    ) {
      loadSessionMessages(sessionId);
    }
  }, [sessionId, loadSessionMessages]);

  const detectVncUrl = (output: string) => {
    if (!output) return;

    try {
      const jsonMatches = output.match(/({[^{}]*"vnc_url"\s*:\s*"[^"]*"[^{}]*})/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const parsed = JSON.parse(match);
            if (parsed.vnc_url && parsed.vnc_url.trim() !== "") {
              let finalUrl = parsed.vnc_url;
              if (!finalUrl.includes('view_only=true')) {
                finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'view_only=true';
              }
              console.log('Found VNC URL in JSON:', finalUrl);
              setVncUrl(finalUrl);
              setIsIframeOpen(true);
              return;
            }
          } catch (err) {
            console.warn('Failed to parse JSON block:', err);
          }
        }
      }

      const markdownVncMatch = output.match(/\(https:\/\/[^\s)]+\/vnc\.html[^\s)]*\)/);
      if (markdownVncMatch) {
        const url = markdownVncMatch[0].slice(1, -1);
        let finalUrl = url;
        if (!finalUrl.includes('view_only=true')) {
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'view_only=true';
        }
        console.log('Found VNC URL in markdown:', finalUrl);
        setVncUrl(finalUrl);
        setIsIframeOpen(true);
      }

    } catch (err) {
      console.warn('Error while processing output for VNC URL:', err);
    }
  };

  useEffect(() => {
    for (const msg of messages) {
      if (!msg.memberResponses) continue;
      for (const member of msg.memberResponses) {
        for (const tool of member.tools || []) {
          const text = tool.output || tool.result;
          if (typeof text === 'string') {
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

  const handleUserMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Prevent sending message if files are still uploading
    const hasPendingUploads = selectedFiles.length > 0;
    if (hasPendingUploads) {
      showToast('Please wait for file uploads to complete.');
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      content: input,
      sender: 'user',
      timestamp: new Date(),
      fileIds: uploadedFileIds.length > 0 ? uploadedFileIds.map(f => f.id) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setHasStreamedResponse(true);

    // Reset all streaming states
    setCurrentTools([]);
    setActiveTools([]);
    setCompletedTools([]);
    setCurrentEvents([]);
    // setFormattedToolCalls([]);
    setCurrentMemberResponses([]);
    setCurrentStreamingContent('');
    streamingContentRef.current = '';

    // Focus the input for the next message
    setTimeout(() => textareaRef.current?.focus(), 0);

    // Create a new message object for the agent's response
    const responseId = `team-${Date.now()}`;
    streamingMessageId.current = responseId;

    try {
      const fileIds = uploadedFileIds.map(f => f.id);

      // Create the streaming connection
      const sessionToUse = sessionIdRef.current || sessionId;
      const connection = teamService.chatWithTeamStream(
        teamId,
        input,
        sessionToUse,
        (content) => {
          // Skip "Run started" messages
          if (!content || content.trim() === 'Run started' || content.includes('Run started')) {
            return;
          }

          // Remove any "Run started" prefix if it's part of a larger message
          const cleanedContent = content.replace(/^Run started\s*/, '');

          streamingContentRef.current += cleanedContent;
          setCurrentStreamingContent(streamingContentRef.current);
        },
        (toolEvent, data) => {
          // Enhanced tool event handling with better state tracking
          console.log('Tool event received:', toolEvent, data);

          // Skip RunCompleted events to prevent content duplication
          if (toolEvent === 'RunCompleted') {
            console.log('Skipping RunCompleted tool event to prevent duplication');
            return;
          }

          // Add event to timeline
          const newEvent: TeamEvent = {
            type: toolEvent as any,
            timestamp: Date.now(),
            data: data
          };
          setCurrentEvents(prev => {
            const updated = [...prev, newEvent];
            currentEventsRef.current = updated;
            return updated;
          });

          if (toolEvent === 'ToolCallStarted') {
            // Handle tool started events
            if (data.tools && Array.isArray(data.tools)) {
              const newActiveTools: ActiveTool[] = data.tools.map((tool: any) => ({
                tool_call_id: tool.tool_call_id || `tool-${Date.now()}`,
                tool_name: tool.tool_name || tool.name || 'Unknown Tool',
                tool_args: tool.tool_args || tool.arguments || {},
                started_at: tool.created_at || Date.now(),
                status: 'starting' as const,
              }));

              setActiveTools(prev => {
                const existing = prev.filter(t =>
                  !newActiveTools.some(nt => nt.tool_call_id === t.tool_call_id)
                );
                return [...existing, ...newActiveTools];
              });
            }

            if (data.active_tool) {
              const activeTool: ActiveTool = {
                tool_call_id: data.active_tool.tool_call_id || `tool-${Date.now()}`,
                tool_name: data.active_tool.tool_name || data.active_tool.name || 'Unknown Tool',
                tool_args: data.active_tool.tool_args || data.active_tool.arguments || {},
                started_at: data.active_tool.created_at || Date.now(),
                status: 'running' as const,
              };

              setActiveTools(prev => {
                const filtered = prev.filter(t => t.tool_call_id !== activeTool.tool_call_id);
                return [...filtered, activeTool];
              });
            }
          } else if (toolEvent === 'ToolCallCompleted') {
            // Handle tool completion events
            console.log('Processing ToolCallCompleted event:', data);

            // Handle individual tool completion from the response
            if (data.tools && Array.isArray(data.tools)) {
              const completedToolsList: CompletedTool[] = data.tools
                .filter((tool: any) => tool.result !== null && tool.result !== undefined)
                .map((tool: any) => ({
                  tool_call_id: tool.tool_call_id || `tool-${Date.now()}`,
                  tool_name: tool.tool_name || tool.name || 'Unknown Tool',
                  tool_args: tool.tool_args || tool.arguments || {},
                  result: tool.result,
                  error: tool.tool_call_error || false,
                  metrics: tool.metrics || {},
                  started_at: tool.created_at || Date.now(),
                  completed_at: Date.now(),
                }));

              setCompletedTools(prev => {
                const existing = prev.filter(t =>
                  !completedToolsList.some(ct => ct.tool_call_id === t.tool_call_id)
                );
                return [...existing, ...completedToolsList];
              });

              // Remove from active tools
              const completedIds = completedToolsList.map(t => t.tool_call_id);
              setActiveTools(prev => prev.filter(t => !completedIds.includes(t.tool_call_id)));
            }

            // Handle single tool completion directly from event data
            else if (data.tool_call_id && data.result) {
              const completedTool: CompletedTool = {
                tool_call_id: data.tool_call_id,
                tool_name: data.tool_name || 'Unknown Tool',
                tool_args: data.tool_args || {},
                result: data.result,
                error: data.tool_call_error || false,
                metrics: data.metrics || {},
                started_at: data.created_at || Date.now(),
                completed_at: Date.now(),
              };

              setCompletedTools(prev => {
                const existing = prev.filter(t => t.tool_call_id !== completedTool.tool_call_id);
                return [...existing, completedTool];
              });

              // Remove from active tools
              setActiveTools(prev => prev.filter(t => t.tool_call_id !== completedTool.tool_call_id));
            }
          }

          // Legacy handling for backwards compatibility
          if (toolEvent === 'ToolsArray' && data.tools) {
            setCurrentTools((prev) => [...prev, ...data.tools]);
            // setShowToolsInMessage(true);
          } else if (toolEvent === 'ToolCall' && data) {
            setCurrentTools((prev) => [...prev, data]);
            // setShowToolsInMessage(true);

            const text = data.output || data.result;
            if (typeof text === 'string') {
              detectVncUrl(text);
            }

          } else if (data && typeof data === 'object') {
            // Handle chunked events with tools array
            if (data.tools && Array.isArray(data.tools)) {
              console.log('Processing tools array from event:', data.tools);

              setCurrentTools((prev) => {
                const newTools = [...prev];

                // Process each tool in the array
                data.tools.forEach((tool: ToolCall) => {
                  const toolExists = newTools.some(
                    (t) =>
                      t.tool_call_id === tool.tool_call_id ||
                      t.tool_name === tool.tool_name ||
                      t.tool_name === tool.name
                  );

                  if (!toolExists) {
                    newTools.push({
                      role: tool.role || 'tool',
                      tool_name: tool.tool_name || tool.name || '',
                      tool_call_id:
                        tool.tool_call_id ||
                        `tool-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                      tool_args:
                        tool.tool_args ||
                        (typeof tool.arguments === 'object' && tool.arguments !== null
                          ? tool.arguments
                          : {}) ||
                        {},
                      content: tool.content || tool.output || '',
                      created_at: tool.created_at || Date.now(),
                      metrics: tool.metrics || { time: 0 },
                    });
                  }
                });

                return newTools;
              });
            }

            // Handle active_tool data
            if (data.active_tool) {
              const tool: ToolCall = data.active_tool;
              setCurrentTools((prev) => {
                const toolExists = prev.some(
                  (t) =>
                    t.tool_call_id === tool.tool_call_id ||
                    t.tool_name === tool.tool_name ||
                    t.tool_name === tool.name
                );

                if (!toolExists) {
                  return [
                    ...prev,
                    {
                      role: tool.role || 'tool',
                      tool_name: tool.tool_name || tool.name || '',
                      tool_call_id:
                        tool.tool_call_id ||
                        `tool-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                      tool_args:
                        tool.tool_args ||
                        (typeof tool.arguments === 'object' && tool.arguments !== null
                          ? tool.arguments
                          : {}) ||
                        {},
                      content: tool.content || tool.output || '',
                      created_at: tool.created_at || Date.now(),
                      metrics: tool.metrics || { time: 0 },
                    },
                  ];
                }

                return prev;
              });
            }

            // Handle member_responses data
            if (
              data.member_responses &&
              Array.isArray(data.member_responses) &&
              data.member_responses.length > 0
            ) {
              console.log('Processing member responses from event:', data.member_responses);
              const formattedMemberResponses = data.member_responses.map((response: any) => ({
                member_id: response.agent_id || response.member_id || 'unknown',
                member_name: getMemberDisplayName(response.agent_id || response.member_id || 'unknown', response.member_name || response.agent_name),
                content: cleanDuplicateContent(response.content || ''),
                tools: response.tools || [],
                model: response.model || 'Unknown',
                created_at: response.created_at || Date.now(),
              }));
              setCurrentMemberResponses(formattedMemberResponses);
            }
          }
        },
        (memberResponses) => {
          const formattedMemberResponses = memberResponses.map((response: any) => ({
            member_id: response.agent_id || response.member_id || 'unknown',
            member_name: getMemberDisplayName(response.agent_id || response.member_id || 'unknown', response.member_name || response.agent_name),
            content: cleanDuplicateContent(response.content || ''),
            tools: response.tools || [],
            model: response.model || 'Unknown',
            created_at: response.created_at || Date.now(),
          }));
          setCurrentMemberResponses(formattedMemberResponses);
        },
        (newSessionId) => {
          // Handle completion
          const finalContent = streamingContentRef.current;

          const teamMessage: Message = {
            id: responseId,
            content: finalContent,
            sender: 'team',
            timestamp: new Date(), // Will be updated when we reload messages from backend
            tools: currentToolsRef.current,
            memberResponses: currentMemberResponsesRef.current,
            activeTools: activeTools,
            completedTools: completedTools,
            events: currentEventsRef.current,
          };

          // Update with the final message
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
              const followUpMessage: Message = {
                id: `follow-up-${Date.now()}`,
                content: `followup::${extractedTeamId}`, // special pattern
                sender: 'team',
                timestamp: new Date(),
              };

              setMessages(prev => [...prev, followUpMessage]);
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
          streamingContentRef.current = '';
          setCurrentTools([]);
          setActiveTools([]);
          setCompletedTools([]);
          setCurrentMemberResponses([]);
          setSelectedFiles([]);
          setUploadedFileIds([]);

          // Update credits after completion
          fetchBalance();

          // Reload messages from backend to get accurate timestamps
          if (uploadedFileIds.length > 0 && (newSessionId || sessionId)) {
            setTimeout(() => {
              const targetSessionId = newSessionId || sessionId;
              if (targetSessionId) {
                loadSessionMessages(targetSessionId);
              }
            }, 500); // Small delay to ensure backend has processed the message
          }

          if (onMessageReceived) {
            onMessageReceived();
          }
        },
        (errorMessage) => {
          // Enhanced error handling for team execution
          console.error('Error in chat stream:', errorMessage);
          setIsLoading(false);

          // Try to parse error as JSON if it contains structured error info
          let errorDetails = null;
          try {
            if (typeof errorMessage === 'string' && (errorMessage.includes('{') || errorMessage.includes('error_code'))) {
              // Try to extract JSON from error message
              const jsonMatch = errorMessage.match(/\{.*\}/);
              if (jsonMatch) {
                errorDetails = JSON.parse(jsonMatch[0]);
              }
            } else if (typeof errorMessage === 'object') {
              errorDetails = errorMessage;
            }
          } catch (e) {
            // If parsing fails, treat as string
            console.warn('Could not parse error details:', e);
          }

          // Handle structured error responses
          if (errorDetails && errorDetails.error_code) {
            if (errorDetails.error_code.includes('credits') || errorDetails.error_code === 'insufficient_credits') {
              setShowNoCreditDialog(true);
              return;
            }

            // Show user-friendly error message with recovery options
            const errorContent = errorDetails.message || 'An error occurred while processing your request.';
            const suggestions = errorDetails.suggestions || [];
            const recoveryOptions = errorDetails.recovery_options || [];

            // Add error message to chat for user visibility
            const errorTeamMessage: Message = {
              id: `error-${Date.now()}`,
              content: errorContent,
              sender: 'team',
              timestamp: new Date(),
              tools: [],
              memberResponses: [],
            };

            setMessages((prev) => [...prev, errorTeamMessage]);

            // Log suggestions for potential future UI improvements
            if (suggestions.length > 0) {
              console.info('Error suggestions:', suggestions);
            }
            if (recoveryOptions.length > 0) {
              console.info('Recovery options:', recoveryOptions);
            }

            return;
          }

          // Handle legacy credit errors (string-based)
          if (typeof errorMessage === 'string' && (errorMessage.includes('credits') || errorMessage.includes('balance'))) {
            setShowNoCreditDialog(true);
            return;
          }

          // Handle generic errors with user-friendly messaging
          const genericErrorMessage = typeof errorMessage === 'string'
            ? (errorMessage.includes('rate limit') || errorMessage.includes('quota')
              ? 'The AI service is currently busy. Please wait a moment and try again.'
              : errorMessage.includes('connection') || errorMessage.includes('timeout')
                ? 'Unable to connect to the AI service. Please check your connection and try again.'
                : 'The team encountered an issue while processing your request. Please try again.')
            : 'An unexpected error occurred. Please try again.';

          // Add generic error message to chat
          const genericErrorTeamMessage: Message = {
            id: `error-${Date.now()}`,
            content: genericErrorMessage,
            sender: 'team',
            timestamp: new Date(),
            tools: [],
            memberResponses: [],
          };

          setMessages((prev) => [...prev, genericErrorTeamMessage]);
        },
        fileIds
      );

      // Store the WebSocket connection
      websocketRef.current = connection;
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);

      // Enhanced error handling for team API errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let shouldShowCreditDialog = false;

      // Handle structured error responses from the API
      if (error && typeof error === 'object') {
        // Handle HTTP error responses
        if ('response' in error && error.response && typeof error.response === 'object') {
          try {
            const errorData = (error.response as any).data;

            // Handle structured error responses
            if (errorData && typeof errorData === 'object') {
              if (errorData.error_code) {
                if (errorData.error_code.includes('credits') || errorData.error_code === 'insufficient_credits') {
                  shouldShowCreditDialog = true;
                } else {
                  errorMessage = errorData.message || errorMessage;
                }
              } else if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.detail) {
                // Handle FastAPI detail responses
                if (typeof errorData.detail === 'object' && errorData.detail.message) {
                  errorMessage = errorData.detail.message;
                  if (errorData.detail.error_code && errorData.detail.error_code.includes('credits')) {
                    shouldShowCreditDialog = true;
                  }
                } else if (typeof errorData.detail === 'string') {
                  errorMessage = errorData.detail;
                }
              }
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch (parseError) {
            console.warn('Could not parse error response:', parseError);
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Handle credit-related errors
      if (shouldShowCreditDialog ||
        (typeof errorMessage === 'string' &&
          (errorMessage.includes('credits') || errorMessage.includes('balance')))) {
        setShowNoCreditDialog(true);
        return;
      }

      // Provide user-friendly error messages for common cases
      if (typeof errorMessage === 'string') {
        if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
          errorMessage = 'The AI service is currently busy. Please wait a moment and try again.';
        } else if (errorMessage.includes('connection') || errorMessage.includes('timeout') || errorMessage.includes('network')) {
          errorMessage = 'Unable to connect to the AI service. Please check your connection and try again.';
        } else if (errorMessage.includes('model') && errorMessage.includes('not found')) {
          errorMessage = 'The AI model is temporarily unavailable. Please try again later.';
        }
      }

      // Add error message to chat for user visibility
      const errorTeamMessage: Message = {
        id: `error-${Date.now()}`,
        content: errorMessage,
        sender: 'team',
        timestamp: new Date(),
        tools: [],
        memberResponses: [],
      };

      setMessages((prev) => [...prev, errorTeamMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessageSubmit(e);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.sender === 'user') {
      return <div className='whitespace-pre-wrap break-words'>{message.content}</div>;
    }

    if (message.content.startsWith('followup::')) {
      const teamId = message.content.replace('followup::', '');

      return (
        <div className="p-2 pt-4 pb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">What's next?</h2>
          <p className="text-muted-foreground text-base mb-4">
            Go to the team room and give them instructions
          </p>
          <Link
            to={`/teams/${teamId}/chat`}
            className="form-button text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 w-fit"
          >
            <span>TEAM ROOM</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      );
    }

    // Render team message with markdown
    const renderTools = () => {
      const timelineEvents = message.events || [];

      if (timelineEvents.length === 0) {
        return null;
      }

      const normalized = normalizeEvents(
        timelineEvents,
        message.content ?? '',
        getMemberDisplayName
      );

      if (normalized.length === 0) return null;

      return (
        <div className="mt-4 mb-4">
          <TeamEventTimeline
            events={normalized}
            isStreaming={false}
          />
        </div>
      );
    };

    // Render member responses if available
    const renderMemberResponses = () => {
      if (!message.memberResponses || message.memberResponses.length === 0) return null;

      return (
        <div className='mt-4 mb-4 pb-3 border-b border-border'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              setExpandedResponses((prev) => ({
                ...prev,
                [message.id]: !prev[message.id],
              }))
            }
            className='text-xs text-muted-foreground mb-2 flex items-center gap-1 hover:bg-muted hover:text-foreground p-0 h-auto font-normal'
          >
            <Users className='h-3 w-3' />
            <span>Team Member Responses ({message.memberResponses.length})</span>
            {expandedResponses[message.id] ? (
              <ChevronUp className='h-3 w-3' />
            ) : (
              <ChevronDown className='h-3 w-3' />
            )}
          </Button>
          {expandedResponses[message.id] && (
            <div className="space-y-3">
              {message.memberResponses.map((member, index) => (
                <div
                  key={`${member.member_id}-${index}`}
                  className="p-3 rounded-md bg-card border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {getMemberDisplayName(member.member_id, member.member_name)}
                      </span>
                      {member.model && (
                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          {member.model}
                        </span>
                      )}
                    </div>
                    {member.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(member.created_at * 1000), 'HH:mm:ss')}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-foreground">
                    <ReactMarkdown components={markdownComponents}>
                      {cleanDuplicateContent(member.content)}
                    </ReactMarkdown>
                  </div>

                  {member.tools && member.tools.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">
                        Tools Used ({member.tools.length})
                      </div>
                      <div className="space-y-1">
                        {member.tools.map((tool, idx) => (
                          <div
                            key={`member-tool-${idx}`}
                            className="text-xs bg-muted text-muted-foreground p-1.5 rounded"
                          >
                            <div className="font-medium flex items-center gap-2">
                              {tool.tool_call_error ? (
                                <XCircle className="w-3 h-3 text-red-500" />
                              ) : (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              )}
                              {String(tool.name || tool.tool_name || 'Unknown Tool')}
                              {typeof tool.metrics?.time === 'number' && (
                                <span className="text-muted-foreground">
                                  ({Number(tool.metrics.time).toFixed(2)}s)
                                </span>
                              )}
                            </div>
                            {(tool.output || tool.result) && (
                              <div className="opacity-80 mt-1 max-h-20 overflow-hidden text-foreground">
                                {String(tool.output || tool.result)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    if (message.fileIds && message.fileIds.length > 0) {
      const contentToRenderWithFiles = message.sender === 'team'
        ? (message.memberResponses && message.memberResponses.length > 0 && message.content.length < 1000
          ? message.content
          : cleanMessageContent(message.content, message.memberResponses))
        : message.content;

      return (
        <div className="space-y-2">
          <div className="text-xs text-foreground-60">
            📎 {message.fileIds.length} file{message.fileIds.length > 1 ? 's' : ''} attached
          </div>
          {renderMemberResponses()}
          {renderTools()}
          <ReactMarkdown components={markdownComponents}>
            {contentToRenderWithFiles}
          </ReactMarkdown>
        </div>
      );
    }

    // Check if this appears to be an error message
    const contentToRender = message.sender === 'team'
      ? (message.memberResponses && message.memberResponses.length > 0 && message.content.length < 1000
        ? message.content
        : cleanMessageContent(message.content, message.memberResponses))
      : message.content;

    return (
      <div>
        {renderMemberResponses()}
        {renderTools()}
        <ReactMarkdown components={markdownComponents}>
          {contentToRender}
        </ReactMarkdown>
      </div>
    );
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (!userHasScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStreamingContent]);

  // Handle auto-scrolling behavior
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

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

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus the input when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);

  const formatMessageTimestamp = (timestamp: Date, messageIndex?: number): string => {
    const now = new Date();
    const timeDiff = now.getTime() - timestamp.getTime();
    const isWithinLastHour = timeDiff < 3600000; // 1 hour

    // Check if this message is close in time to adjacent messages
    let showSeconds = isWithinLastHour; // Default to showing seconds for recent messages

    if (messageIndex !== undefined && messages.length > 1) {
      const checkRange = 3; // Check 3 messages before and after
      for (let i = Math.max(0, messageIndex - checkRange); i <= Math.min(messages.length - 1, messageIndex + checkRange); i++) {
        if (i !== messageIndex && messages[i]) {
          const otherTimestamp = messages[i].timestamp;
          const timeDifference = Math.abs(timestamp.getTime() - otherTimestamp.getTime());
          // If within 5 minutes of another message, show seconds for precision
          if (timeDifference < 300000) {
            showSeconds = true;
            break;
          }
        }
      }
    }

    // Show seconds for recent messages or when messages are clustered
    if (showSeconds) {
      return format(timestamp, 'h:mm:ss a');
    }

    // Show standard format for older, isolated messages
    return format(timestamp, 'h:mm a');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast('Copied to clipboard!');
    });
  };

  const renderStreamingMemberResponses = () => {
    if (!currentMemberResponses || currentMemberResponses.length === 0) return null;

    return (
      <div className='mt-4 mb-4 pb-3 border-b border-border'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setStreamingMemberResponsesExpanded(!streamingMemberResponsesExpanded)}
          className='text-xs text-muted-foreground mb-2 flex items-center gap-1 hover:bg-muted hover:text-foreground p-0 h-auto font-normal'
        >
          <Users className='h-3 w-3' />
          <span>Team Member Responses ({currentMemberResponses.length})</span>
          {streamingMemberResponsesExpanded ? (
            <ChevronUp className='h-3 w-3' />
          ) : (
            <ChevronDown className='h-3 w-3' />
          )}
        </Button>
        {streamingMemberResponsesExpanded && (
          <div className="space-y-3">
            {currentMemberResponses.map((member, index) => (
              <div
                key={`${member.member_id}-${index}`}
                className="p-3 rounded-md bg-card border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getMemberDisplayName(member.member_id, member.member_name)}
                    </span>
                    {member.model && (
                      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                        {member.model}
                      </span>
                    )}
                  </div>
                  {member.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(member.created_at), 'HH:mm:ss')}
                    </span>
                  )}
                </div>

                <div className="text-sm text-foreground">
                  <ReactMarkdown components={markdownComponents}>
                    {cleanDuplicateContent(member.content)}
                  </ReactMarkdown>
                </div>

                {member.tools && member.tools.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Tools Used ({member.tools.length})
                    </div>
                    <div className="space-y-1">
                      {member.tools.map((tool, idx) => (
                        <div
                          key={`streaming-member-tool-${idx}`}
                          className="text-xs bg-muted text-muted-foreground p-1.5 rounded"
                        >
                          <div className="font-medium flex items-center gap-2">
                            {tool.tool_call_error ? (
                              <XCircle className="w-3 h-3 text-red-500" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                            {String(tool.name || tool.tool_name || 'Unknown Tool')}
                            {typeof tool.metrics?.time === 'number' && (
                              <span className="text-muted-foreground">
                                ({Number(tool.metrics.time).toFixed(2)}s)
                              </span>
                            )}
                          </div>
                          {(tool.output || tool.result) && (
                            <div className="opacity-80 mt-1 max-h-20 overflow-hidden text-foreground">
                              {String(tool.output || tool.result)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the chat interface
  return (
    <div className="flex flex-col h-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full">
      {/* Main Chat Area */}
      <div className={`${isHomeTeam ? 'p-2 sm:p-5' : ''} w-full h-full`}>
        <div className={`flex flex-col h-full transition-all duration-300 w-full overflow-hidden ${isHomeTeam ? 'border border-border rounded-[34px] max-w-4xl mx-auto p-4 bg-muted-3' : ''}`}>
          <style>{`
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
      `}</style>

          {/* Chat messages area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 sm:p-4 pt-2 sm:pt-4 pb-1 chat-messages"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className={`max-w-4xl w-full mx-auto min-h-full flex flex-col ${messages.length !== 0 ? 'items-start justify-start' : 'items-center justify-center'}`}>
              {isLoadingSession && messages.length === 0 ? (
                <div className="flex justify-center items-center w-full">
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center w-full">
                  <div className="flex flex-col justify-center items-center text-center text-muted-foreground">
                    <h3 className="text-lg font-medium text-foreground-80 mb-2">
                      Start chatting with this team
                    </h3>
                    <p className="max-w-md text-sm">
                      Send a message to start a conversation with this team of AI agents working together.
                    </p>
                  </div>
                </div>
              ) : (
                <div className='space-y-4 sm:space-y-6 w-full'>
                  {messages.map((message, index) => {
                    const isUser = message.sender === 'user';
                    const timestamp = formatMessageTimestamp(message.timestamp, index);

                    if (isUser) {
                      return (
                        <div key={message.id} className="flex justify-end w-full px-2 sm:px-4">
                          <div className="flex flex-row gap-2 sm:gap-3 max-w-[85%] ml-auto">
                            {/* Message bubble */}
                            <div className="rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex-1 overflow-x-auto border bubble-user ml-auto group">
                              <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground-60">
                                <span>You - {timestamp}</span>
                                <button
                                  onClick={() => handleCopy(message.content)}
                                  title="Copy"
                                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              {renderMessageContent(message)}
                            </div>

                            {/* Avatar */}
                            {!isHomeTeam && (
                              <div className="flex-shrink-0 ml-1 sm:ml-2">
                                {user ? (
                                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 text-white">
                                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600">
                                      {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 text-white">
                                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-700">
                                      U
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Team message
                    return (
                      <div key={message.id} className="flex justify-start w-full px-2 sm:px-4">
                        <div className="flex flex-row gap-2 sm:gap-3 max-w-[85%]">
                          {/* Avatar */}
                          {!isHomeTeam && (
                            <div className="flex-shrink-0 mr-1 sm:mr-2">
                              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 text-white">
                                <AvatarFallback className={`bg-gradient-to-br ${accentColor}`}>
                                  T
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}

                          {/* Message bubble */}
                          <div className="rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex-1 overflow-x-auto border bubble-team group">
                            <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground-60">
                              <span>Team - {timestamp}</span>
                              <button
                                onClick={() => handleCopy(message.content)}
                                title="Copy"
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            {renderMessageContent(message)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Currently streaming message */}
                  {(isLoading || hasStreamedResponse) && normalizeEvents(currentEvents, currentStreamingContent, getMemberDisplayName).length > 0 && (
                    <div className={`flex justify-start w-full px-2 sm:px-4`}>
                      <div className={`flex flex-row gap-2 sm:gap-3 max-w-[85%]`}>
                        {!isHomeTeam && (
                          <div className="flex-shrink-0 mr-1 sm:mr-2">
                            <Avatar className='h-7 w-7 sm:h-8 sm:w-8 text-white'>
                              <AvatarFallback className={`bg-gradient-to-br ${accentColor}`}>T</AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${isLoading && !hasStreamedResponse ? 'bubble-user ml-auto' : 'bubble-team'
                          } text-foreground flex-1 max-w-[700px] overflow-x-auto`}>
                          <div className='text-xs text-muted-foreground-60 mb-1'>
                            Team - {formatMessageTimestamp(new Date(), messages.length)}
                          </div>
                          {renderStreamingMemberResponses()}
                          <TeamEventTimeline
                            events={normalizeEvents(currentEvents, currentStreamingContent, getMemberDisplayName)}
                            isStreaming
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading indicator when not streaming yet */}
                  {isLoading && !currentStreamingContent && (
                    <div className='flex justify-start w-full px-2 sm:px-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                      {!isHomeTeam && (
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${accentColor} flex items-center justify-center mr-2 sm:mr-2.5 flex-shrink-0 shadow-md`}
                          style={{ animation: 'pulse 2s infinite ease-in-out' }}
                        >
                          <Users className='h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white' />
                        </div>
                      )}
                      <div className='rounded-2xl bg-card backdrop-blur-sm text-foreground px-4 py-3 shadow-md border border-zinc-600/30 relative overflow-hidden'>
                        <div
                          className='absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/10 to-transparent'
                          style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s infinite linear',
                            animationFillMode: 'forwards',
                          }}
                        ></div>
                        <div className='relative flex flex-col space-y-1.5'>
                          <div className='flex space-x-2 items-center h-5'>
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`}
                              style={{ animation: 'scale 1.4s infinite ease-in-out' }}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`}
                              style={{ animation: 'scale 1.4s infinite ease-in-out 0.2s' }}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentColor} opacity-80`}
                              style={{ animation: 'scale 1.4s infinite ease-in-out 0.4s' }}
                            ></div>
                            <span className='text-foreground-90 text-xs font-medium ml-1'>Thinking...</span>
                          </div>
                          <span className='text-muted-foreground text-xs'>Team is processing your request</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Chat input area */}
          <div className="border-border">
            <div className="max-w-full sm:max-w-3xl mx-auto w-full px-2 sm:px-4">
              {/* Uploaded files preview */}
              {(selectedFiles.length > 0 || uploadedFileIds.length > 0) && (
                <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 mb-2 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {[
                      ...selectedFiles.filter(
                        (file) => !uploadedFileIds.some(f => f.name === file.name && f.size === file.size)
                      ),
                      ...uploadedFileIds
                    ].map((file) => {
                      const fileKey = `${file.name}-${file.size}`;
                      const isUploaded = uploadedFileIds.some(f => f.name === file.name && f.size === file.size);
                      return (
                        <div
                          key={fileKey}
                          className="flex items-center bg-card px-2 py-1 rounded text-sm text-foreground max-w-full"
                        >
                          <Paperclip className="w-4 h-4 text-foreground-60 mr-1 shrink-0" />
                          <div className="flex flex-col max-w-[200px]">
                            <span className="truncate">{file.name}</span>
                            {uploadProgress[fileKey] !== undefined && !isUploaded && (
                              <div className="w-full bg-muted-10 h-1 mt-1 rounded overflow-hidden">
                                <div
                                  className="bg-violet-500 h-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[fileKey]}%` }}
                                />
                              </div>
                            )}
                          </div>
                          {isUploaded && (
                            <button
                              type="button"
                              disabled={
                                isLoading || Object.values(uploadProgress).some((percent) => percent < 100)
                              }
                              onClick={() =>
                                setUploadedFileIds((prev) =>
                                  prev.filter((f) => f.name !== file.name || f.size !== file.size)
                                )
                              }
                              className={`ml-2 text-xs ${isLoading || Object.values(uploadProgress).some((p) => p < 100)
                                ? 'text-zinc-400 cursor-not-allowed'
                                : 'text-red-400 hover:text-red-600'
                                }`}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleUserMessageSubmit}
                className={`w-full border border-border rounded-2xl p-3 sm:p-4 flex flex-col gap-3 bg-chat-input ${isHomeTeam ? '' : 'mb-6'} max-w-full sm:max-w-3xl mx-auto`}
              >
                {/* Textarea (top row) */}
                <TextareaAutosize
                  ref={textareaRef}
                  className="w-full bg-transparent rounded-md p-2 sm:p-3 text-sm sm:text-base text-foreground 
                          placeholder:text-muted-foreground resize-none overflow-auto focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="Send a message..."
                  minRows={1}
                  maxRows={25}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                {/* Bottom row: Upload and Submit */}
                <div className="flex justify-between items-end">
                  {/* Upload button (left) */}
                  <div>
                    <label
                      htmlFor="file-upload"
                      className={`rounded-full form-button p-2 sm:p-3 h-11 w-11 flex items-center justify-center 
                    transition-colors duration-200 
                    ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                      aria-label="Attach files"
                    >
                      <span className="text-xl font-bold text-white">＋</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      id="file-upload"
                      title=""
                      className="hidden"
                      disabled={isLoading}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const MAX_SIZE = 10 * 1024 * 1024; // 10MB
                          const newFiles = Array.from(e.target.files);

                          // Separate oversized files
                          const tooLargeFiles = newFiles.filter((file) => file.size > MAX_SIZE);
                          const allowedFiles = newFiles.filter((file) => file.size <= MAX_SIZE);

                          // Notify user about each rejected file
                          if (tooLargeFiles.length > 0) {
                            const message = tooLargeFiles
                              .map((file) => `• ${file.name} is too large (max 10MB)`)
                              .join('\n');

                            showToast(message);
                          }

                          // Skip if no valid files left
                          if (allowedFiles.length === 0) {
                            e.target.value = '';
                            return;
                          }

                          const existingKeys = new Set(
                            uploadedFileIds.map((f) => `${f.name}-${f.size}`)
                          );

                          const filteredFiles = allowedFiles.filter(
                            (file) => !existingKeys.has(`${file.name}-${file.size}`)
                          );

                          if (filteredFiles.length === 0) {
                            e.target.value = '';
                            return;
                          }

                          setSelectedFiles(filteredFiles);

                          const result = await teamService.uploadFilesWithProgress(
                            teamId,
                            filteredFiles,
                            sessionId,
                            (fileKey, percent) => {
                              if (percent === -1) {
                                setSelectedFiles((prev) =>
                                  prev.filter((f) => `${f.name}-${f.size}` !== fileKey)
                                );
                              } else {
                                setUploadProgress((prev) => ({
                                  ...prev,
                                  [fileKey]: percent,
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
                          const mapped = uploaded.map((file: any) => ({
                            id: file.file_id,
                            name: file.original_filename,
                            size: file.size,
                          }));

                          setUploadedFileIds((prev) => [...prev, ...mapped]);
                          setSelectedFiles((prev) =>
                            prev.filter(
                              (f) =>
                                !mapped.some((m) => m.name === f.name && m.size === f.size)
                            )
                          );
                          setUploadProgress({});
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>

                  {/* Submit Button (right) */}
                  <div>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className={`rounded-full form-button p-2 sm:p-3 h-11 w-11 flex items-center justify-center 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Send message"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* No credits dialog */}
      <AlertDialog open={showNoCreditDialog} onOpenChange={setShowNoCreditDialog}>
        <AlertDialogContent className='bg-background border border-border'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-lg font-semibold text-foreground flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              Insufficient Credits
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='text-foreground-80'>
            You need credits to use the team chat feature. Purchase credits to continue.
          </AlertDialogDescription>
          <AlertDialogFooter className='mt-4'>
            <AlertDialogCancel className='bg-card hover:bg-card-hover text-foreground-80 border-border'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button className='bg-violet-600 hover:bg-violet-700 text-foreground' asChild>
                <Link to='/payment'>Purchase Credits</Link>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GlobalStyle />
    </div>
  );
};