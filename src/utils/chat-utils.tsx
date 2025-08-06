import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  code(props) {
    const { className, children, ...rest } = props;
    return (
      <code className={`${className || ''} bg-card px-1 py-0.5 rounded text-sm break-words`} {...rest}>
        {children}
      </code>
    );
  },
  pre(props) {
    const { children, ...rest } = props;
    return (
      <pre className='bg-zinc-800 text-white p-4 rounded-md overflow-x-auto max-w-full my-4' {...rest}>
        {children}
      </pre>
    );
  },
  ul(props) {
    return <ul className='list-disc pl-5 my-4' {...props} />;
  },
  ol(props) {
    return <ol className='list-decimal pl-5 my-4' {...props} />;
  },
  li(props) {
    return <li className='my-1' {...props} />;
  },
  p(props) {
    return <p className='my-2' {...props} />;
  },
};

export const cleanMessageContent = (
  content: string,
  memberResponses?: { content: string }[]
): string => {
  if (!content) return content;

  let cleanedContent = content;

  cleanedContent = cleanedContent
    .replace(/^[a-f0-9-]{36}[\s\n\r]*/gi, '')
    .replace(/(?:^|\s)[a-f0-9-]{36}(?:\s|$)/gi, ' ')
    .replace(/[\s\n\r]*[a-f0-9-]{36}[\s\n\r]*$/gi, '')
    .trim();

  if (!memberResponses?.length) return cleanedContent;

  if (cleanedContent.includes('Step 1:') && cleanedContent.length > 1000) {
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

  memberResponses.forEach(({ content }) => {
    if (content?.length > 50) {
      const trimmed = content.trim();
      if (cleanedContent.includes(trimmed)) {
        cleanedContent = cleanedContent.replace(trimmed, '').trim();
      } else {
        const start = trimmed.substring(0, 200);
        const index = cleanedContent.indexOf(start);
        if (index !== -1) {
          cleanedContent = cleanedContent.substring(0, index).trim();
        }
      }
    }
  });

  cleanedContent = cleanedContent
    .replace(/[a-f0-9-]{36}/gi, '')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\s{3,}/g, ' ')
    .trim();

  if (cleanedContent.length < 10 && content.length > 50) {
    return content
      .replace(/^[a-f0-9-]{36}[\s\n\r]*/gi, '')
      .replace(/[\s\n\r]*[a-f0-9-]{36}[\s\n\r]*$/gi, '')
      .trim();
  }

  return cleanedContent || content;
};