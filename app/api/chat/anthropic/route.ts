import { NextResponse } from 'next/server';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createVertexAnthropic } from '@ai-sdk/google-vertex/anthropic';
import { generateText, streamText } from 'ai';

import { VertexAIModels } from '@/lib/constant';
import { env } from '@/lib/env';
import { Message, type Usage } from '@/lib/types';
import { auth as clerkAuth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type PostData = Usage & {
  messages: Message[];
};

export async function POST(req: Request) {
  const { userId } = await clerkAuth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.ANTHROPIC_ENABLED) {
    return NextResponse.json(
      { error: 'Anthropic is disabled' },
      { status: 403 }
    );
  }

  const json: PostData = await req.json();
  const {
    messages,
    model,
    stream,
    prompt,
    temperature,
    frequencyPenalty,
    presencePenalty,
    maxTokens
  } = json;

  try {
    const provider = env.ANTHROPIC_API_PROVIDER;
    let languageModel;

    if (provider === 'vertex') {
      const vertex = createVertexAnthropic({
        project: env.GOOGLE_VERTEX_PROJECT,
        location: env.GOOGLE_VERTEX_LOCATION,
        googleAuthOptions: {
          credentials: JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS || '{}')
        }
      });
      languageModel = vertex(VertexAIModels[model] || model);
    } else {
      const anthropic = createAnthropic({
        apiKey: env.ANTHROPIC_API_KEY,
        baseURL: env.ANTHROPIC_BASE_URL
      });
      languageModel = anthropic(model);
    }

    const parameters = {
      model: languageModel,
      system: prompt,
      messages,
      temperature,
      frequencyPenalty,
      presencePenalty,
      maxTokens
    };

    if (!stream) {
      const { text } = await generateText(parameters);

      return NextResponse.json({
        role: 'assistant',
        content: text
      });
    }

    const res = streamText(parameters);

    return res.toDataStreamResponse({
      getErrorMessage: error => {
        if (error == null) {
          return 'Unknown error';
        }

        if (typeof error === 'string') {
          return error;
        }

        if (error instanceof Error) {
          return error.message;
        }

        return JSON.stringify(error);
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
