import OpenAI from "openai";

class AsyncRequestCoalescer {
  constructor() {
    this.pendingRequests = new Map();
  }

  async coalesce(key, asyncFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    const promise = asyncFn().finally(() => {
      this.pendingRequests.delete(key);
    });
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

const coalescer = new AsyncRequestCoalescer();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askGPT(question) {
  const key = question.trim().toLowerCase();
  return coalescer.coalesce(key, async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in BTP." },
        { role: "user", content: question },
      ],
    });
    return response.choices[0].message.content;
  });
}
