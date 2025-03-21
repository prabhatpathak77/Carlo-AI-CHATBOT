"use client"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { ArrowUpIcon, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import React, { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  })
  console.log(error)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
    <header className="m-auto flex max-w-3xl flex-col gap-5 text-center">
      <h1 className="text-3xl font-semibold leading-none tracking-tight text-primary">
        <Leaf className="inline-block mr-0" /> Carlo
      </h1>
      
      <p className="text-muted-foreground text-sm">
      Smart conversations start here!!!
      </p>
      <p className="text-muted-foreground tect-sum">
      How can I help?
      </p>
      <p className="discord ">
      </p>
    </header>
  )

  

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className={cn(
            "max-w-[80%] rounded-xl px-4 py-3 text-sm",
            message.role === "user"
              ? "self-end bg-blue-500 text-white"
              : "self-start bg-blue-200 text-blue-900"
          )}
        >
          {/* Render Markdown with custom styling for code blocks */}
          <ReactMarkdown
            className="prose prose-blue break-words"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                return inline ? (
                  <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-gray-800">{children}</code>
                ) : (
                  <pre className="bg-gray-900 text-white p-3 rounded-md overflow-auto">
                    <code className="text-sm">{children}</code>
                  </pre>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )

  return (
    <TooltipProvider>
      <main
        className={cn(
          "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[48rem] flex-col items-stretch border-none bg-gradient-to-b from-blue-100 to-white",
          className,
        )}
        {...props}
      >
        <div className="flex-1 content-center overflow-y-auto px-6 py-8">{messages.length ? messageList : header}</div>
        {isLoading && <div className="text-center text-sm text-muted-foreground">Thinking...</div>}
        {error && <div className="text-center text-sm text-destructive">Error: {error.message}</div>}
        <form
          onSubmit={onSubmit}
          className="border-input bg-white focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-full border-2 border-blue-500 px-4 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="What's on your mind...?"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none resize-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={isLoading}
              >
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Send message</TooltipContent>
          </Tooltip>
        </form>
        <footer className="text-center py-0 mt-0text-sm text-muted-foreground">
    <p>Community 💬 :{" "}
      <a
        href="https://chat.whatsapp.com/FJvnsTIzJxy8iIPPHfIkJ7"
        className="text-blue-500 hover:text-blue-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        NadeX
      </a>
    </p>
  </footer>
      </main>
    </TooltipProvider>
    
    
  )
  
  
}