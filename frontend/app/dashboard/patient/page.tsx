import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, Heart, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PatientDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Chidi Nwosu" notificationCount={1} />
      <DashboardSidebar userType="patient" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Hello, Chidi</h1>
            <p className="text-lg text-muted-foreground">How are you feeling today?</p>
          </div>

          {/* Quick Health Check */}
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Need Health Guidance?</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Use our AI-powered symptom checker to get instant health recommendations in your language
                  </p>
                  <Button asChild size="lg">
                    <Link href="/dashboard/patient/triage">
                      <MessageSquare className="mr-2 w-5 h-5" />
                      Check Symptoms Now
                    </Link>
                  </Button>
                </div>
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild className="h-auto py-6 justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/patient/triage">
                  <MessageSquare className="mr-3 w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-base">Symptom Checker</div>
                    <div className="text-xs text-muted-foreground font-normal">Get instant health guidance</div>
                  </div>
                </Link>
              </Button>

              <Button asChild className="h-auto py-6 justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/patient/history">
                  <FileText className="mr-3 w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-base">View Health Records</div>
                    <div className="text-xs text-muted-foreground font-normal">Access your medical history</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent Symptom History */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Symptom Checks</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/patient/history">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">3 days ago</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Fever and Body Ache</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Recommendation: Non-urgent - Monitor symptoms for 2-3 days
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                          Non-Urgent
                        </span>
                        <span className="text-xs text-muted-foreground">Suspected: Common Cold</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">1 week ago</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Headache and Fatigue</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Recommendation: Rest and hydration, monitor for 24-48 hours
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                          Non-Urgent
                        </span>
                        <span className="text-xs text-muted-foreground">Suspected: Dehydration</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Health Tips</CardTitle>
              <CardDescription>Daily recommendations for better health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Prevent Malaria</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sleep under insecticide-treated mosquito nets every night, especially during rainy season
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Stay Hydrated</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Drink at least 8 glasses of clean water daily to maintain good health and prevent dehydration
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Regular Check-ups</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Visit your local health facility for routine check-ups and vaccinations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
