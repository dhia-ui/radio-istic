"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Loader2,
  Shield,
  Star,
  Edit,
  Check,
  X,
} from "lucide-react"
import { api, getAvatarUrl } from "@/lib/api"
import type { Member } from "@/types/member"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Member Management Card Component
function MemberManagementCard({ member, onUpdate }: { member: Member; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [role, setRole] = useState(member.role || "member")
  const [points, setPoints] = useState(member.points?.toString() || "0")
  const [isBureau, setIsBureau] = useState(member.isBureau || false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!member.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID du membre invalide",
      })
      return
    }

    setIsUpdating(true)
    try {
      // Update role
      await api.members.updateRole(member.id, role, isBureau)
      
      // Update points
      const currentPoints = member.points || 0
      const newPoints = parseInt(points) || 0
      if (newPoints !== currentPoints) {
        await api.members.updatePoints(member.id, newPoints, "set")
      }

      toast({
        title: "Membre mis à jour",
        description: `${member.name} a été mis à jour avec succès`,
      })
      setIsEditing(false)
      onUpdate()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le membre",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setRole(member.role || "member")
    setPoints(member.points?.toString() || "0")
    setIsBureau(member.isBureau || false)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-electric-blue/50 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={getAvatarUrl(member.avatar)} alt={member.name} />
        <AvatarFallback>
          {member.firstName?.[0]}
          {member.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{member.name}</p>
          {member.isBureau && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Bureau
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{member.email}</span>
          <span>•</span>
          <span>{member.field} - {member.year}ème année</span>
        </div>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-3">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="events-organizer">Events Organizer</SelectItem>
              <SelectItem value="media-responsable">Media Responsable</SelectItem>
              <SelectItem value="sponsor-manager">Sponsor Manager</SelectItem>
              <SelectItem value="secretary">Secretary</SelectItem>
              <SelectItem value="vice-president">Vice President</SelectItem>
              <SelectItem value="president">President</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-24"
            placeholder="Points"
          />

          <Button
            size="icon"
            variant={isBureau ? "default" : "outline"}
            onClick={() => setIsBureau(!isBureau)}
            title="Toggle Bureau Status"
          >
            <Shield className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="default"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium capitalize">{member.role?.replace(/-/g, " ")}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {member.points || 0} points
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function BureauDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dialog states for Quick Actions
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false)
  const [showSchedulePodcastDialog, setShowSchedulePodcastDialog] = useState(false)
  
  // Form states for Quick Actions
  const [newMemberForm, setNewMemberForm] = useState<{
    firstName: string
    lastName: string
    email: string
    password: string
    field: "GLSI" | "IRS" | "LISI" | "LAI" | "IOT" | "LT"
    year: 1 | 2 | 3
    phone: string
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    field: "GLSI",
    year: 1,
    phone: "",
  })
  
  const [newEventForm, setNewEventForm] = useState<{
    title: string
    description: string
    startDate: string
    location: string
    category: "Sport" | "Podcast" | "Voyage" | "Social" | "Training" | "Other"
    maxParticipants: number
  }>({
    title: "",
    description: "",
    startDate: "",
    location: "",
    category: "Sport",
    maxParticipants: 30,
  })
  
  const [newPodcastForm, setNewPodcastForm] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    duration: "",
  })

  // Handler functions for Quick Actions
  const handleAddMember = async () => {
    try {
      await api.auth.register(newMemberForm)
      toast({
        title: "Membre ajouté",
        description: `${newMemberForm.firstName} ${newMemberForm.lastName} a été ajouté avec succès`,
      })
      setShowAddMemberDialog(false)
      setNewMemberForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        field: "GLSI",
        year: 1,
        phone: "",
      })
      // Refresh members list
      const response = await api.members.getAll({})
      const membersArray = response.members || []
      const transformedMembers: Member[] = membersArray.map((u: any) => ({
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone || "",
        field: u.field,
        year: u.year,
        motivation: u.motivation || "",
        projects: typeof u.projects === 'string' ? u.projects : (u.projects?.join(", ") || ""),
        skills: typeof u.skills === 'string' ? u.skills : (u.skills?.join(", ") || ""),
        status: u.status || "offline",
        avatar: u.avatar || u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
        points: u.points || 0,
        role: u.role,
        isBureau: u.isBureau,
      }))
      setMembers(transformedMembers)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le membre",
      })
    }
  }

  const handleCreateEvent = async () => {
    try {
      await api.events.create(newEventForm)
      toast({
        title: "Événement créé",
        description: `${newEventForm.title} a été créé avec succès`,
      })
      setShowCreateEventDialog(false)
      setNewEventForm({
        title: "",
        description: "",
        startDate: "",
        location: "",
        category: "Sport",
        maxParticipants: 30,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer l'événement",
      })
    }
  }

  const handleSchedulePodcast = () => {
    toast({
      title: "Podcast programmé",
      description: `${newPodcastForm.title} a été programmé pour ${newPodcastForm.scheduledDate}`,
    })
    setShowSchedulePodcastDialog(false)
    setNewPodcastForm({
      title: "",
      description: "",
      scheduledDate: "",
      duration: "",
    })
  }

  const handleSendNewsletter = () => {
    router.push("/bureau?action=newsletter")
    toast({
      title: "Newsletter",
      description: "Fonctionnalité à venir - envoi de newsletter aux membres",
    })
  }

  const handleViewAnalytics = () => {
    router.push("/bureau?tab=analytics")
    toast({
      title: "Analytics",
      description: "Tableau de bord analytique à venir",
    })
  }

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.members.getAll({})
        // Backend returns { success: true, members: [...] }
        const membersArray = response.members || []
        const transformedMembers: Member[] = membersArray.map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone || "",
          field: u.field,
          year: u.year,
          motivation: u.motivation || "",
          projects: typeof u.projects === 'string' ? u.projects : (u.projects?.join(", ") || ""),
          skills: typeof u.skills === 'string' ? u.skills : (u.skills?.join(", ") || ""),
          status: u.status || "offline",
          avatar: u.avatar || u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
          points: u.points || 0,
          role: u.role,
          isBureau: u.isBureau,
        }))
        setMembers(transformedMembers)
      } catch (error) {
        console.error("Failed to fetch members:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les membres",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [toast])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
        </div>
      </ProtectedRoute>
    )
  }

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
                          <AvatarImage src={getAvatarUrl(member.avatar)} alt={member.name} />
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
                    <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Ajouter un nouveau membre</DialogTitle>
                          <DialogDescription>
                            Remplissez les informations du nouveau membre
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Prénom</Label>
                              <Input
                                id="firstName"
                                value={newMemberForm.firstName}
                                onChange={(e) => setNewMemberForm({...newMemberForm, firstName: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Nom</Label>
                              <Input
                                id="lastName"
                                value={newMemberForm.lastName}
                                onChange={(e) => setNewMemberForm({...newMemberForm, lastName: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newMemberForm.email}
                              onChange={(e) => setNewMemberForm({...newMemberForm, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                              id="password"
                              type="password"
                              value={newMemberForm.password}
                              onChange={(e) => setNewMemberForm({...newMemberForm, password: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="field">Filière</Label>
                              <Select value={newMemberForm.field} onValueChange={(value) => setNewMemberForm({...newMemberForm, field: value as "GLSI" | "IRS" | "LISI" | "LAI" | "IOT" | "LT"})}>
                                <SelectTrigger id="field">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GLSI">GLSI</SelectItem>
                                  <SelectItem value="IRS">IRS</SelectItem>
                                  <SelectItem value="LISI">LISI</SelectItem>
                                  <SelectItem value="LAI">LAI</SelectItem>
                                  <SelectItem value="IOT">IOT</SelectItem>
                                  <SelectItem value="LT">LT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="year">Année</Label>
                              <Select value={newMemberForm.year.toString()} onValueChange={(value) => setNewMemberForm({...newMemberForm, year: parseInt(value) as 1 | 2 | 3})}>
                                <SelectTrigger id="year">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Année 1</SelectItem>
                                  <SelectItem value="2">Année 2</SelectItem>
                                  <SelectItem value="3">Année 3</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={handleAddMember} className="w-full">
                            Ajouter le membre
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Créer un événement</DialogTitle>
                          <DialogDescription>
                            Organisez un nouvel événement pour le club
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="eventTitle">Titre</Label>
                            <Input
                              id="eventTitle"
                              value={newEventForm.title}
                              onChange={(e) => setNewEventForm({...newEventForm, title: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventDescription">Description</Label>
                            <Textarea
                              id="eventDescription"
                              value={newEventForm.description}
                              onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="eventDate">Date</Label>
                              <Input
                                id="eventDate"
                                type="datetime-local"
                                value={newEventForm.startDate}
                                onChange={(e) => setNewEventForm({...newEventForm, startDate: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="eventCategory">Catégorie</Label>
                              <Select value={newEventForm.category} onValueChange={(value) => setNewEventForm({...newEventForm, category: value as "Sport" | "Podcast" | "Voyage" | "Social" | "Training" | "Other"})}>
                                <SelectTrigger id="eventCategory">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sport">Sport</SelectItem>
                                  <SelectItem value="Podcast">Podcast</SelectItem>
                                  <SelectItem value="Soirée">Soirée</SelectItem>
                                  <SelectItem value="Voyage">Voyage</SelectItem>
                                  <SelectItem value="Social">Social</SelectItem>
                                  <SelectItem value="Training">Formation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventLocation">Lieu</Label>
                            <Input
                              id="eventLocation"
                              value={newEventForm.location}
                              onChange={(e) => setNewEventForm({...newEventForm, location: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleCreateEvent} className="w-full">
                            Créer l'événement
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showSchedulePodcastDialog} onOpenChange={setShowSchedulePodcastDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Radio className="h-4 w-4 mr-2" />
                          Schedule Podcast
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Programmer un podcast</DialogTitle>
                          <DialogDescription>
                            Planifiez un nouvel épisode de podcast
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="podcastTitle">Titre</Label>
                            <Input
                              id="podcastTitle"
                              value={newPodcastForm.title}
                              onChange={(e) => setNewPodcastForm({...newPodcastForm, title: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="podcastDescription">Description</Label>
                            <Textarea
                              id="podcastDescription"
                              value={newPodcastForm.description}
                              onChange={(e) => setNewPodcastForm({...newPodcastForm, description: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="podcastDate">Date</Label>
                              <Input
                                id="podcastDate"
                                type="datetime-local"
                                value={newPodcastForm.scheduledDate}
                                onChange={(e) => setNewPodcastForm({...newPodcastForm, scheduledDate: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="podcastDuration">Durée</Label>
                              <Input
                                id="podcastDuration"
                                placeholder="45 min"
                                value={newPodcastForm.duration}
                                onChange={(e) => setNewPodcastForm({...newPodcastForm, duration: e.target.value})}
                              />
                            </div>
                          </div>
                          <Button onClick={handleSchedulePodcast} className="w-full">
                            Programmer le podcast
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      className="w-full justify-start bg-transparent" 
                      variant="outline"
                      onClick={handleSendNewsletter}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Newsletter
                    </Button>
                    <Button 
                      className="w-full justify-start bg-transparent" 
                      variant="outline"
                      onClick={handleViewAnalytics}
                    >
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
                  <CardTitle className="flex items-center justify-between">
                    <span>Gestion des Membres</span>
                    <Badge variant="secondary">{members.length} membres</Badge>
                  </CardTitle>
                  <CardDescription>Gérer les rôles, points et statuts des membres du club</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <MemberManagementCard 
                        key={member.id} 
                        member={member}
                        onUpdate={() => {
                          // Refresh members list
                          const fetchMembers = async () => {
                            const response = await api.members.getAll({})
                            const membersArray = response.members || []
                            const transformedMembers: Member[] = membersArray.map((u: any) => ({
                              id: u._id,
                              name: `${u.firstName} ${u.lastName}`,
                              firstName: u.firstName,
                              lastName: u.lastName,
                              email: u.email,
                              phone: u.phone || "",
                              field: u.field,
                              year: u.year,
                              motivation: u.motivation || "",
                              projects: typeof u.projects === "string" ? u.projects : (u.projects?.join(", ") || ""),
                              skills: typeof u.skills === "string" ? u.skills : (u.skills?.join(", ") || ""),
                              status: u.status || "offline",
                              avatar: u.avatar || u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
                              points: u.points || 0,
                              role: u.role,
                              isBureau: u.isBureau,
                            }))
                            setMembers(transformedMembers)
                          }
                          fetchMembers()
                        }}
                      />
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
