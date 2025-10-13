"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function PatientHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Chidi Nwosu" notificationCount={1} />
      <DashboardSidebar userType="patient" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Health History</h1>
            <p className="text-muted-foreground">View your past symptom checks and health records</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>Your complete health history and triage sessions</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Health history interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
