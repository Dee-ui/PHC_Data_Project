"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Download,
  AlertCircle,
  Users,
  Package,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MalariaForecastPage() {
  const [startMonth, setStartMonth] = useState("january")
  const [endMonth, setEndMonth] = useState("june")
  const [confidenceThreshold, setConfidenceThreshold] = useState([70])
  const [showDetailedData, setShowDetailedData] = useState(false)

  // Mock forecast data
  const forecastData = [
    {
      month: "January 2025",
      historical: 32,
      predicted: 35,
      confidence: 92,
      factors: "High rainfall, warm temperatures",
    },
    {
      month: "February 2025",
      historical: 28,
      predicted: 38,
      confidence: 89,
      factors: "Peak mosquito breeding season",
    },
    {
      month: "March 2025",
      historical: 35,
      predicted: 45,
      confidence: 87,
      factors: "Increased humidity, poor drainage",
    },
    {
      month: "April 2025",
      historical: 42,
      predicted: 48,
      confidence: 85,
      factors: "Rainy season peak, high temperatures",
    },
    {
      month: "May 2025",
      historical: 38,
      predicted: 42,
      confidence: 88,
      factors: "Continued rainfall, vector activity",
    },
    {
      month: "June 2025",
      historical: 30,
      predicted: 35,
      confidence: 90,
      factors: "Declining rainfall, improved control",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Dr. Amara Okafor" userOrganization="Lagos General Hospital" notificationCount={3} />
      <DashboardSidebar userType="professional" />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Malaria Prevalence Forecasting</h1>
            <p className="text-muted-foreground">
              AI-powered predictions to help you plan resources and respond to malaria outbreaks
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <CardDescription>Customize your forecast view</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="start-month">Start Month</Label>
                    <Select value={startMonth} onValueChange={setStartMonth}>
                      <SelectTrigger id="start-month" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January 2025</SelectItem>
                        <SelectItem value="february">February 2025</SelectItem>
                        <SelectItem value="march">March 2025</SelectItem>
                        <SelectItem value="april">April 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="end-month">End Month</Label>
                    <Select value={endMonth} onValueChange={setEndMonth}>
                      <SelectTrigger id="end-month" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="may">May 2025</SelectItem>
                        <SelectItem value="june">June 2025</SelectItem>
                        <SelectItem value="july">July 2025</SelectItem>
                        <SelectItem value="august">August 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="clinic-select">Geographic Scope</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="clinic-select" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clinics</SelectItem>
                        <SelectItem value="lagos">Lagos General Hospital</SelectItem>
                        <SelectItem value="ikeja">Ikeja Health Center</SelectItem>
                        <SelectItem value="surulere">Surulere Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="confidence-slider">Confidence Threshold: {confidenceThreshold[0]}%</Label>
                    <Slider
                      id="confidence-slider"
                      value={confidenceThreshold}
                      onValueChange={setConfidenceThreshold}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-3"
                    />
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full">Apply Filters</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 w-4 h-4" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Forecast Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Malaria Prevalence Forecast</CardTitle>
                  <CardDescription>Historical data and AI predictions for the next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg mb-6">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">Interactive Chart Visualization</p>
                      <p className="text-xs mt-1">Line chart showing historical vs predicted malaria prevalence</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">Historical Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-warning" />
                        <span className="text-sm text-muted-foreground">Predicted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-warning/30" />
                        <span className="text-sm text-muted-foreground">Confidence Interval</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>AI-generated insights from the forecast data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Peak Expected in April 2025</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Malaria prevalence is predicted to reach approximately 48% in April, representing a 14% increase
                        from current levels. This coincides with peak rainy season.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Increasing Trend Detected</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Risk factors include high rainfall patterns, elevated temperatures, and increased mosquito
                        breeding activity in your region.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                    <Calendar className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Improvement Expected by June</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Prevalence is forecasted to decline to 35% by June as rainfall decreases and vector control
                        measures take effect.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Actionable Recommendations</CardTitle>
                  <CardDescription>Data-driven suggestions to prepare for upcoming trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Staffing</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Increase medical staff by 25-30% during peak months (March-April). Consider hiring temporary
                      healthcare workers or extending shifts.
                    </p>
                    <Badge variant="outline">Priority: High</Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Resources</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Stock antimalarial medications to support 50% increase in patient volume. Recommended: 500+
                      treatment courses of ACT (Artemisinin-based Combination Therapy).
                    </p>
                    <Badge variant="outline">Priority: High</Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Megaphone className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Prevention Campaigns</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Launch community awareness programs in February-March. Focus on ITN (Insecticide-Treated Net)
                      distribution and environmental sanitation to reduce mosquito breeding sites.
                    </p>
                    <Badge variant="outline">Priority: Medium</Badge>
                  </div>

                  <Button className="w-full sm:w-auto">Contact Support for Guidance</Button>
                </CardContent>
              </Card>

              {/* Detailed Data Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Detailed Forecast Data</CardTitle>
                      <CardDescription>Month-by-month breakdown with confidence levels</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowDetailedData(!showDetailedData)}>
                      {showDetailedData ? (
                        <>
                          <ChevronUp className="mr-2 w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 w-4 h-4" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {showDetailedData && (
                  <CardContent>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead className="text-right">Historical (%)</TableHead>
                            <TableHead className="text-right">Predicted (%)</TableHead>
                            <TableHead className="text-right">Confidence (%)</TableHead>
                            <TableHead>Key Factors</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {forecastData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{row.month}</TableCell>
                              <TableCell className="text-right">{row.historical}%</TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold text-warning">{row.predicted}%</span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant={row.confidence >= 85 ? "default" : "secondary"}>
                                  {row.confidence}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{row.factors}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Data sources: Historical clinic records, environmental data, WHO malaria reports
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 w-4 h-4" />
                        Download CSV
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Context & Information */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    This forecast uses advanced machine learning algorithms to predict malaria prevalence based on
                    historical clinic data, environmental factors (rainfall, temperature, humidity), and seasonal
                    patterns specific to your region.
                  </p>
                  <p>
                    <strong className="text-foreground">Data Sources:</strong> Historical clinic records (2020-2024),
                    WHO malaria surveillance data, regional meteorological data, and vector control program reports.
                  </p>
                  <p>
                    <strong className="text-foreground">Methodology:</strong> The AI model combines time-series
                    analysis, environmental correlation, and epidemiological patterns to generate predictions with
                    confidence intervals. Learn more in our{" "}
                    <a href="#" className="text-primary hover:underline">
                      documentation
                    </a>
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
