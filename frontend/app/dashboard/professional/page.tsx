import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, Users, AlertTriangle, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { BarChart3 } from "lucide-react" // Import BarChart3

export default function ProfessionalDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Dr. Amara Okafor" userOrganization="Lagos General Hospital" notificationCount={3} />
      <DashboardSidebar userType="professional" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your clinic today.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clinic Status</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground">Operational</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">All systems running normally</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Malaria Risk Level</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning text-warning-foreground">Medium</Badge>
                  <span className="text-xs text-muted-foreground">↑ 12%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Increasing trend this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Patient Volume</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">247</div>
                <p className="text-xs text-muted-foreground mt-1">Expected visits this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">3</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button asChild className="h-auto py-4 justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/professional/forecast">
                  <TrendingUp className="mr-3 w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Run Malaria Forecast</div>
                    <div className="text-xs text-muted-foreground font-normal">Predict upcoming trends</div>
                  </div>
                </Link>
              </Button>

              <Button asChild className="h-auto py-4 justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/professional/triage">
                  <Activity className="mr-3 w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Start Triage Session</div>
                    <div className="text-xs text-muted-foreground font-normal">Assist patients with symptoms</div>
                  </div>
                </Link>
              </Button>

              <Button asChild className="h-auto py-4 justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/professional/analytics">
                  <BarChart3 className="mr-3 w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">View Analytics</div>
                    <div className="text-xs text-muted-foreground font-normal">Explore health data insights</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Alerts</h2>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">High Priority</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />2 hours ago
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">High Malaria Prevalence Detected</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Malaria cases have increased by 35% in your region over the past week. Consider increasing
                        antimalarial drug stock and ITN distribution.
                      </p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-warning">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />5 hours ago
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Resource Stock Running Low</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Antimalarial medication inventory is below recommended levels. Restock within 3-5 days to avoid
                        shortages.
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Info</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />1 day ago
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Weekly Report Available</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your weekly health analytics report is ready for review. View insights on patient volume,
                        disease trends, and resource utilization.
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mini Malaria Risk Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Malaria Prevalence Trend</CardTitle>
              <CardDescription>Last 3 months with current week prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chart visualization would appear here</p>
                  <p className="text-xs mt-1">Showing historical data and AI predictions</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">Historical Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-xs text-muted-foreground">Predicted</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/professional/forecast">
                    View Full Forecast
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
