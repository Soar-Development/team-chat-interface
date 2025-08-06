import React from 'react';
import { SequencedResponseBox } from './sequenced-response-box';
import type { SequencedEvent } from './sequenced-response-box';
import { cleanMessageContent, markdownComponents } from '../utils/chat-utils';
import ReactMarkdown from 'react-markdown';

interface TeamEventTimelineProps {
    events: SequencedEvent[];
    isStreaming?: boolean;
}

export const TeamEventTimeline: React.FC<TeamEventTimelineProps> = ({
    events,
    isStreaming = false,
}) => {
    return (
        <div className="space-y-2 mt-4">
            {events.map((event, index) => {
                if (event.type === 'FinalResponse' && isStreaming) {
                    return (
                        <div key={`final-${index}`} className="mb-2">
                            <ReactMarkdown components={markdownComponents}>
                                {cleanMessageContent(event.content)}
                            </ReactMarkdown>
                        </div>
                    );
                }

                return (
                    <SequencedResponseBox
                        key={index}
                        event={event}
                        index={index}
                        isStreaming={isStreaming}
                    />
                );
            })}
        </div>
    );
};