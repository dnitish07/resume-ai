
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  onSuggestionApply?: (text: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant = ({ onSuggestionApply }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response for now - you can integrate with OpenAI later
      const response = await simulateAIResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const input = userInput.toLowerCase();
    
    if (input.includes('correct') || input.includes('grammar') || input.includes('fix')) {
      return "I can help you improve your text! Please share the specific sentence or paragraph you'd like me to review and I'll provide suggestions for grammar, clarity, and professional tone.";
    } else if (input.includes('bullet') || input.includes('list')) {
      return "Here are some tips for formatting lists:\n\n• Use bullet points for multiple items\n• Start each point with an action verb\n• Keep points concise and parallel\n• Use numbers for sequential steps or ranked items";
    } else if (input.includes('resume') || input.includes('professional')) {
      return "For a professional resume:\n\n• Use action verbs (Developed, Managed, Led)\n• Quantify achievements with numbers\n• Keep bullet points concise\n• Use consistent formatting\n• Tailor content to the job role";
    } else if (input.includes('technology') || input.includes('skills')) {
      return "When listing technologies:\n\n1. Group by category (Languages, Frameworks, Tools)\n2. List most relevant skills first\n3. Use bullet points for readability\n4. Include proficiency levels if relevant";
    } else {
      return "I'm here to help you improve your resume content! I can assist with:\n\n• Grammar and sentence corrections\n• Professional formatting suggestions\n• Bullet point optimization\n• Technology and skills presentation\n\nWhat specific area would you like help with?";
    }
  };

  const applyResponse = (content: string) => {
    if (onSuggestionApply) {
      onSuggestionApply(content);
      toast({
        title: "Applied",
        description: "AI suggestion has been applied to your content.",
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-96 bg-white shadow-2xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>AI Resume Assistant</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-80">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="h-12 w-12 mx-auto mb-2 text-purple-600" />
              <p>Ask me anything about improving your resume!</p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && <Bot className="h-4 w-4 mt-1 text-purple-600" />}
                  {message.role === 'user' && <User className="h-4 w-4 mt-1" />}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyResponse(message.content)}
                        className="mt-2 h-6 text-xs text-purple-600 hover:text-purple-700"
                      >
                        Apply Suggestion
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to improve your resume content..."
            className="flex-1 min-h-0 h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
