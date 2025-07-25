"use client"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { ArrowUpIcon, Leaf, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import React, { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { useState } from "react"

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

  // Enhanced copy button for code blocks
  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text)
        console.log(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
    return (
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 rounded bg-gray-800 px-2 py-1 text-xs text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
      >
        {copied ? (
          <>
            <Check size={24} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy
          </>
        )}
      </button>
    )
  }

  // Message copy button
  const MessageCopyButton = ({ text, messageRole }: { text: string; messageRole: string }) => {
    const [copied, setCopied] = useState(false)
    
    const handleCopy = async () => {
      try {
        // Ensure text is a string and handle potential objects
        const textToCopy = typeof text === 'string' ? text : String(text || '')
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy message: ', err)
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-1 right-1 sm:top-2 sm:right-2 z-10 rounded p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform",
              messageRole === "user" 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-white text-blue-600 hover:bg-gray-50 border border-blue-200"
            )}
          >
            {copied ? <Check size={10} className="sm:w-3 sm:h-3" /> : <Copy size={10} className="sm:w-3 sm:h-3" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? "Copied to clipboard!" : "Copy message"}
        </TooltipContent>
      </Tooltip>
    )
  }

  const header = (
    <header className="m-auto flex max-w-3xl flex-col gap-3 sm:gap-5 text-center px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold leading-none tracking-tight text-primary">
        <Leaf className="inline-block mr-0" /> Carlo
      </h1>
      
      <p className="text-muted-foreground text-sm">
        Smart conversations start here!!!
      </p>
      <p className="text-muted-foreground text-sm">
        How can I help?
      </p>
      <p className="discord ">
      </p>
    </header>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-3 sm:gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className={cn(
            "absolute top-1 right-1 sm:top-2 sm:right-2 z-10 rounded p-1 text-xs transition-opacity transform hover:scale-110",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100", // 👈 always visible on phone
            message.role === "user"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-blue-600 hover:bg-gray-50 border border-blue-200"
          )}
        >
          {/* Copy button for the entire message */}
          <MessageCopyButton text={message.content} messageRole={message.role} />
          
          {/* Render Markdown with custom styling for code blocks */}
          <ReactMarkdown
            className="prose prose-blue break-words pr-6 sm:pr-8"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                // Utility function to extract raw string from nested React children
                const extractText = (node: any): string => {
                  if (typeof node === "string") return node;
                  if (Array.isArray(node)) return node.map(extractText).join("");
                  if (typeof node === "object" && node?.props?.children) {
                    return extractText(node.props.children);
                  }
                  return "";
                };
              
                const rawCode = extractText(children);
              
                return inline ? (
                  <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-gray-800">
                    {children}
                  </code>
                ) : (
                  <div className="group relative">
                    <pre className="bg-gray-900 text-white p-2 sm:p-3 rounded-md overflow-auto text-xs sm:text-sm">
                      <CopyButton text={rawCode} />
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              }            
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
        <div className="flex-1 content-center overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">{messages.length ? messageList : header}</div>
        {isLoading && <div className="text-center text-sm text-muted-foreground px-4">Thinking...</div>}
        {error && <div className="text-center text-sm text-destructive px-4">Error: {error.message}</div>}
        <form
          onSubmit={onSubmit}
          className="border-input bg-white focus-within:ring-ring/10 relative mx-3 sm:mx-6 mb-3 sm:mb-6 flex items-center rounded-full border-2 border-blue-500 px-3 sm:px-4 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
        >
          <div className="flex-1 min-h-[40px] max-h-[120px] overflow-hidden">
            <AutoResizeTextarea
              onKeyDown={handleKeyDown}
              onChange={(v) => setInput(v)}
              value={input}
              placeholder="What's on your mind...?"
              className="placeholder:text-muted-foreground w-full bg-transparent focus:outline-none resize-none min-h-[40px] max-h-[100px] py-2"
              rows={1}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 ml-2 flex-shrink-0"
                disabled={isLoading}
              >
                <ArrowUpIcon size={14} className="sm:w-4 sm:h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Send message</TooltipContent>
          </Tooltip>
        </form>
        <footer className="text-center py-2 sm:py-0 mt-0 text-xs sm:text-sm text-muted-foreground px-4">
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