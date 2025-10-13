"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Mic, MicOff, RotateCcw, Clock, Activity, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
}

export default function ProfessionalTriagePage() {
  const [language, setLanguage] = useState("english")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm Dr. Sage, your health assistant. Please tell me about your symptoms or what concerns you have. You can type or use voice. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Thank you for sharing. How long have you had this fever? (1-3 days, 4-7 days, or more than a week)",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleQuickSymptom = (symptom: string) => {
    setInputMessage(symptom)
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
  }

  const handleNewSession = () => {
    setMessages([
      {
        id: "1",
        type: "bot",
        content:
          "Hello! I'm Dr. Sage, your health assistant. Please tell me about your symptoms or what concerns you have. You can type or use voice. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  const quickSymptoms = ["Fever", "Cough", "Body Ache", "Nausea", "Headache", "Chills", "Fatigue", "Other"]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Dr. Amara Okafor" userOrganization="Lagos General Hospital" notificationCount={3} />
      <DashboardSidebar userType="professional" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Triage Assistant</h1>
              <p className="text-muted-foreground">Assist patients with symptom checking and health guidance</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="yoruba">Yoruba</SelectItem>
                  <SelectItem value="igbo">Igbo</SelectItem>
                  <SelectItem value="hausa">Hausa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleNewSession}>
                <RotateCcw className="mr-2 w-4 h-4" />
                New Session
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[calc(100vh-16rem)]">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Dr. Sage Assistant</CardTitle>
                        <CardDescription className="text-xs">AI-powered health guidance</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Online
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.type === "user" ? "justify-end" : "justify-start",
                          message.type === "system" && "justify-center",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-3",
                            message.type === "user" && "bg-primary text-primary-foreground",
                            message.type === "bot" && "bg-muted",
                            message.type === "system" && "bg-accent text-accent-foreground text-sm",
                          )}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1 opacity-70",
                              message.type === "user" ? "text-right" : "text-left",
                            )}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Symptom Buttons */}
                  <div className="px-4 py-3 border-t bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Quick symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickSymptoms.map((symptom, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickSymptom(symptom)}
                          className="text-xs"
                        >
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <Tabs defaultValue="text" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                        <TabsTrigger value="text">Text Input</TabsTrigger>
                        <TabsTrigger value="voice">Voice Input</TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="mt-0">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Describe symptoms..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="voice" className="mt-0">
                        <div className="flex flex-col items-center gap-4 py-4">
                          <Button
                            size="lg"
                            variant={isRecording ? "destructive" : "default"}
                            onClick={handleVoiceToggle}
                            className="w-20 h-20 rounded-full"
                          >
                            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            {isRecording ? "Recording... Tap to stop" : "Tap to record"}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session Stats */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Session started: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages: {messages.length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Patient: Current Session</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Triage Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent sessions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
