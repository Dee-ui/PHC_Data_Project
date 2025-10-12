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
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
  RotateCcw,
  Clock,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
}

interface TriageResult {
  urgency: "urgent" | "non-urgent"
  condition: string
  confidence: number
  recommendation: string
  redFlags: string[]
  selfCareTips: string[]
  medications: string[]
}

export default function PatientTriagePage() {
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
  const [showTriageResult, setShowTriageResult] = useState(false)
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
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
    // TODO: Implement actual voice recording
  }

  const handleShowTriageResult = () => {
    // Simulate triage completion
    const result: TriageResult = {
      urgency: "non-urgent",
      condition: "Suspected Malaria",
      confidence: 85,
      recommendation: "Rest at home and monitor symptoms for 2-3 days. If symptoms worsen, visit your nearest clinic.",
      redFlags: [
        "High fever above 40°C (104°F)",
        "Severe headache with confusion",
        "Difficulty breathing",
        "Persistent vomiting",
      ],
      selfCareTips: [
        "Drink plenty of water (at least 8 glasses per day)",
        "Rest adequately and avoid strenuous activities",
        "Monitor your temperature regularly",
        "Sleep under an insecticide-treated mosquito net",
      ],
      medications: ["Paracetamol for fever (500mg every 6 hours)", "Oral Rehydration Solution (ORS)"],
    }
    setTriageResult(result)
    setShowTriageResult(true)
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
    setShowTriageResult(false)
    setTriageResult(null)
  }

  const quickSymptoms = {
    english: ["Fever", "Cough", "Body Ache", "Nausea", "Headache", "Chills", "Fatigue", "Other"],
    yoruba: ["Iba (Fever)", "Iko (Cough)", "Irora ara (Body Ache)", "Ọgbẹlẹ (Nausea)"],
    igbo: ["Ahụ ọkụ (Fever)", "Ụkwara (Cough)", "Mgbu ahụ (Body Ache)", "Ọgbụgbọ (Nausea)"],
    hausa: ["Zazzabi (Fever)", "Tari (Cough)", "Ciwon jiki (Body Ache)", "Tashin zuciya (Nausea)"],
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Chidi Nwosu" notificationCount={1} />
      <DashboardSidebar userType="patient" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Symptom Checker</h1>
              <p className="text-muted-foreground">Get instant health guidance from Dr. Sage</p>
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
                      {quickSymptoms[language as keyof typeof quickSymptoms]?.map((symptom, index) => (
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
                            placeholder="Describe your symptoms..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{inputMessage.length}/500 characters</p>
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
                          {isRecording && (
                            <div className="flex items-center gap-2 text-destructive">
                              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                              <span className="text-xs font-medium">Recording in progress</span>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Button */}
              <div className="mt-4 text-center">
                <Button onClick={handleShowTriageResult} variant="outline">
                  Show Demo Triage Result
                </Button>
              </div>
            </div>

            {/* Triage Result Panel */}
            <div className="lg:col-span-1">
              {showTriageResult && triageResult ? (
                <Card className="border-2">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Triage Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Urgency Badge */}
                    <div>
                      <Badge
                        className={cn(
                          "text-base px-4 py-2",
                          triageResult.urgency === "urgent"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-success text-success-foreground",
                        )}
                      >
                        {triageResult.urgency === "urgent" ? "URGENT - SEEK IMMEDIATE CARE" : "NON-URGENT"}
                      </Badge>
                    </div>

                    {/* Likely Condition */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Likely Condition</h3>
                      <p className="text-sm text-muted-foreground mb-1">{triageResult.condition}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {triageResult.confidence}%</p>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Recommended Action</h3>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{triageResult.recommendation}</p>
                      </div>
                    </div>

                    {/* Red Flags */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Warning Signs</h3>
                      <p className="text-xs text-muted-foreground mb-2">Seek immediate care if you experience:</p>
                      <ul className="space-y-2">
                        {triageResult.redFlags.map((flag, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Self-Care Tips */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Self-Care Tips</h3>
                      <ul className="space-y-2">
                        {triageResult.selfCareTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Medication Suggestions */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Medication Suggestions</h3>
                      <ul className="space-y-2">
                        {triageResult.medications.map((med, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{med}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3 p-2 bg-warning/10 rounded">
                        Disclaimer: Consult with a healthcare professional before taking any medication
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button className="w-full bg-transparent" variant="outline">
                        <Download className="mr-2 w-4 h-4" />
                        Save to Health Records
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline">
                        <Share2 className="mr-2 w-4 h-4" />
                        Share with Doctor
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline">
                        <Download className="mr-2 w-4 h-4" />
                        Export as PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full">
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
                    <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground leading-relaxed">
                      <p className="font-medium text-foreground mb-2">How it works:</p>
                      <ol className="space-y-2 list-decimal list-inside">
                        <li>Describe your symptoms in detail</li>
                        <li>Answer follow-up questions</li>
                        <li>Receive personalized health guidance</li>
                        <li>Save or share your results</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
