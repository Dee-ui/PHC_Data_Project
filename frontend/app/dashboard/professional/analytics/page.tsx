"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Dr. Amara Okafor" userOrganization="Lagos General Hospital" notificationCount={3} />
      <DashboardSidebar userType="professional" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Health Analytics</h1>
            <p className="text-muted-foreground">Real-time insights and data visualization</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Power BI dashboard will be embedded here</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Power BI analytics dashboard coming next</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
