import { Controller, Get, Query } from '@nestjs/common';

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ConfigService } from '@nestjs/config';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableLambda } from '@langchain/core/runnables';

@Controller('chat')
export class ChatController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getChat(
    @Query('topic') topic: string,
    @Query('scene') scene: string,
    @Query('tips') tips: string,
  ) {
    const llm = new ChatOpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
      configuration: {
        baseURL: this.configService.get('OPENAI_BASE_URL'),
      },
      modelName: this.configService.get('MODEL_NAME'),
      cache: false,
      temperature: 1,
    });

    const prompt = ChatPromptTemplate.fromTemplate(
      '请用一些喜庆吉祥的祝福词给 {topic}, 祝福词要大气，喜庆，大概100字左右, 需要具有创意和新意， 场合是 {scene}, 要结合场合，不要出现任何不合适的内容。 希望结合这些关键词 {tips} 来生成, 返回的话要贴近现实，不要出现太多书面词汇，并且带有蛇年元素',
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const analysisPrompt = ChatPromptTemplate.fromTemplate(
      '请分析一下这段话， {value} 是否是吉祥话，并且没有什么不合适的内容, 请返回 true 或者 false, 不要返回任何其他内容',
    );

    let content = '';

    const composedChain = new RunnableLambda({
      func: async (input: { topic: string; scene: string; tips: string }) => {
        const result = await chain.invoke(input);
        content = result;
        console.log(result);
        return { value: result };
      },
    })
      .pipe(analysisPrompt)
      .pipe(llm)
      .pipe(new StringOutputParser());

    const checkResult = await composedChain.invoke({ topic, scene, tips });
    if (checkResult === 'true') {
      return content;
    } else {
      return '不符合要求, 请重新生成';
    }
  }
}
