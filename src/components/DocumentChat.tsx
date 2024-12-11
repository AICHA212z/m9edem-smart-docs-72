import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageSquare, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const examplePrompts = [
  "كيفية استخراج البطاقة الوطنية للتعريف الإلكترونية؟",
  "ما هي الوثائق المطلوبة للحصول على جواز السفر؟",
  "كيف يمكنني الحصول على رخصة السياقة؟",
  "ما هي خطوات استخراج عقد الازدياد؟"
];

export function DocumentChat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('https://gptmodelbargain.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an Arabic-speaking assistant specialized in guiding users through the process of obtaining various Moroccan government documents. Your responses should be clear, informative, and structured in a newsletter-style format with visually engaging elements, like bullet points, icons, and headings. You will provide detailed steps and documents required for the user's request, as well as any relevant information about timeframes, locations, and additional notes. Your language should be friendly, concise, and professional."
            },
            ...messages,
            userMessage
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 min-h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-moroccan-blue text-white ml-4'
                        : 'bg-moroccan-sand/20 text-moroccan-charcoal mr-4'
                    }`}
                    dir="rtl"
                  >
                    <p className="whitespace-pre-wrap font-['Noto_Naskh_Arabic']">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-moroccan-sand/20 text-moroccan-charcoal p-4 rounded-lg mr-4">
                    <p className="font-['Noto_Naskh_Arabic']">جاري التحميل...</p>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Écrivez votre question ici...'}
                className="flex-1 font-['Noto_Naskh_Arabic']"
                dir="rtl"
              />
              <Button 
                type="submit" 
                className="bg-moroccan-blue hover:bg-moroccan-blue/90"
                disabled={!apiKey || isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-moroccan-blue font-['Noto_Naskh_Arabic']" dir="rtl">
              مفتاح API
            </h3>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح API الخاص بك"
              className="font-['Noto_Naskh_Arabic']"
              dir="rtl"
            />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-moroccan-blue font-['Noto_Naskh_Arabic']" dir="rtl">
              أمثلة على الأسئلة
            </h3>
            <div className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="p-3 bg-moroccan-sand/10 rounded-lg cursor-pointer hover:bg-moroccan-sand/20 transition-colors"
                  onClick={() => setInput(prompt)}
                >
                  <p className="text-moroccan-charcoal font-['Noto_Naskh_Arabic']" dir="rtl">
                    <MessageSquare className="inline-block h-4 w-4 ml-2" />
                    {prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}