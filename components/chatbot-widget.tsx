"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRobot,
  faXmark,
  faPaperPlane,
  faSpinner,
  faChevronDown,
  faChevronUp,
  faPaperclip,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons"
import { useLanguage } from "@/contexts/language-context"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  status?: "sending" | "sent" | "error"
  attachments?: { type: string; url: string; name: string }[]
}

export function ChatbotWidget() {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        language === "en"
          ? "Hello! I'm your AI assistant. How can I help you with the procurement portal today?"
          : "สวัสดี! ฉันเป็นผู้ช่วย AI ของคุณ ฉันจะช่วยคุณเกี่ยวกับพอร์ทัลการจัดซื้อจัดจ้างได้อย่างไรในวันนี้?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Update body class to resize main content
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.classList.add("chatbot-open")
    } else {
      document.body.classList.remove("chatbot-open")
    }

    return () => {
      document.body.classList.remove("chatbot-open")
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate API delay
    setTimeout(() => {
      // Update user message status
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "sent" } : msg)))

      // Generate mock response based on user input
      let responseContent = ""
      const lowercaseInput = userMessage.content.toLowerCase()

      if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi") || lowercaseInput.includes("สวัสดี")) {
        responseContent =
          language === "en"
            ? "Hello! How can I assist you with the procurement portal today?"
            : "สวัสดี! ฉันจะช่วยคุณเกี่ยวกับพอร์ทัลการจัดซื้อจัดจ้างได้อย่างไรในวันนี้?"
      } else if (
        lowercaseInput.includes("procurement") ||
        lowercaseInput.includes("purchase") ||
        lowercaseInput.includes("การจัดซื้อ")
      ) {
        responseContent =
          language === "en"
            ? "The procurement process involves several steps: creating a requisition, getting approvals, sending purchase orders, and receiving goods. Which part would you like to know more about?"
            : "กระบวนการจัดซื้อจัดจ้างประกอบด้วยหลายขั้นตอน: การสร้างคำขอ การขออนุมัติ การส่งคำสั่งซื้อ และการรับสินค้า คุณต้องการทราบเพิ่มเติมเกี่ยวกับส่วนใด?"
      } else if (lowercaseInput.includes("help") || lowercaseInput.includes("ช่วย")) {
        responseContent =
          language === "en"
            ? "I can help you with navigating the portal, understanding procurement processes, finding documents, and answering questions about energy regulations. What specific help do you need?"
            : "ฉันสามารถช่วยคุณในการนำทางพอร์ทัล ทำความเข้าใจกระบวนการจัดซื้อจัดจ้าง ค้นหาเอกสาร และตอบคำถามเกี่ยวกับข้อบังคับด้านพลังงาน คุณต้องการความช่วยเหลือเฉพาะด้านใด?"
      } else if (lowercaseInput.includes("thank") || lowercaseInput.includes("ขอบคุณ")) {
        responseContent =
          language === "en"
            ? "You're welcome! Is there anything else I can help you with?"
            : "ด้วยความยินดี! มีอะไรอื่นที่ฉันสามารถช่วยคุณได้อีกไหม?"
      } else {
        responseContent =
          language === "en"
            ? "I understand you're asking about " +
              userMessage.content +
              ". Could you provide more details so I can assist you better?"
            : "ฉันเข้าใจว่าคุณกำลังถามเกี่ยวกับ " +
              userMessage.content +
              " คุณช่วยให้รายละเอียดเพิ่มเติมได้ไหม เพื่อให้ฉันสามารถช่วยคุณได้ดีขึ้น?"
      }

      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: responseContent,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "en" ? "en-US" : "th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className={`fixed z-40 bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-facgure-blue text-white" : "bg-white text-facgure-blue"
        }`}
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
        ) : (
          <FontAwesomeIcon icon={faRobot} className="h-6 w-6" />
        )}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div
          className={`fixed z-30 bottom-6 right-6 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 flex flex-col ${
            isMinimized ? "w-72 h-16" : "w-96 h-[600px] max-h-[calc(100vh-120px)] sm:w-[400px] md:w-[450px]"
          }`}
        >
          {/* Chat header */}
          <div
            className="p-3 border-b flex items-center justify-between cursor-pointer"
            onClick={isMinimized ? toggleMinimize : undefined}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-facgure-blue flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{language === "en" ? "AI Assistant" : "ผู้ช่วย AI"}</h3>
                {!isMinimized && (
                  <p className="text-xs text-gray-500">
                    {language === "en" ? "Ask me anything about the portal" : "ถามฉันได้ทุกอย่างเกี่ยวกับพอร์ทัล"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMinimize()
                }}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={isMinimized ? faChevronUp : faChevronDown} className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleChat()
                }}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-facgure-blue text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                      <div
                        className={`text-xs mt-1 flex justify-between items-center ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.status === "sending" && (
                          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none max-w-[80%] p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-3 border-t">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={language === "en" ? "Type your message here..." : "พิมพ์ข้อความของคุณที่นี่..."}
                    className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent resize-none"
                    rows={2}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FontAwesomeIcon icon={faFaceSmile} className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FontAwesomeIcon icon={faPaperclip} className="h-5 w-5" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim()}
                      className={`p-1.5 rounded-full ${
                        inputValue.trim()
                          ? "bg-facgure-blue text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {language === "en" ? "Powered by Facgure AI" : "ขับเคลื่อนโดย Facgure AI"}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
