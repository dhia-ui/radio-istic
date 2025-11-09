"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Calendar,
  Radio,
  TrendingUp,
  MessageSquare,
  Award,
  Settings,
  BarChart3,
  UserPlus,
  Mail,
  Activity,
} from "lucide-react"
import { members } from "@/lib/members-data"

export default function BureauDashboard() {
  const { user } = useAuth()

  // Calculate statistics
  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "online").length
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0)
  const avgPoints = Math.round(totalPoints / totalMembers)

  // Get bureau members
  const bureauMembers = members.filter((m) => m.role && m.role !== "Member")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Bureau Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Manage Radio Istic club operations and members</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              {user?.role || "Bureau Member"}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{activeMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((activeMembers / totalMembers) * 100)}% online rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{avgPoints}</div>
                <p className="text-xs text-muted-foreground mt-1">Per member engagement</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">8</div>
                <p className="text-xs text-muted-foreground mt-1">3 upcoming this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/50 backdrop-blur border border-primary/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bureau Team */}
                <Card className="border-primary/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Bureau Team
                    </CardTitle>
                    <CardDescription>Current leadership members</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bureauMembers.slice(0, 6).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <Badge variant="outline" className="border-primary/30">
                          {member.points} pts
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-secondary/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-secondary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New Member
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Radio className="h-4 w-4 mr-2" />
                      Schedule Podcast
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Newsletter
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-accent/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest club updates and actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "New member joined", user: "Yassine Bouali", time: "2 hours ago", type: "member" },
                    { action: "Event created", user: "Hamza Ennaciri", time: "5 hours ago", type: "event" },
                    { action: "Podcast published", user: "Salma Ait Taleb", time: "1 day ago", type: "content" },
                    { action: "Training completed", user: "Mehdi Benjelloun", time: "2 days ago", type: "training" },
                    {
                      action: "New sponsor added",
                      user: "Fatima Zahra El Amrani",
                      time: "3 days ago",
                      type: "sponsor",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activity.type === "member"
                            ? "bg-primary"
                            : activity.type === "event"
                              ? "bg-secondary"
                              : activity.type === "content"
                                ? "bg-accent"
                                : "bg-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Management Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>View and manage all club members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.slice(0, 10).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              <div
                                className={`h-2 w-2 rounded-full ${member.status === "online" ? "bg-secondary" : "bg-muted-foreground"}`}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {member.field} • {member.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-primary/30">
                            {member.points} pts
                          </Badge>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Management Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card className="border-secondary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Create and manage club events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Event management coming soon</p>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card className="border-accent/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage podcasts, videos, and media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Content management coming soon</p>
                    <Button>
                      <Radio className="h-4 w-4 mr-2" />
                      Create New Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
