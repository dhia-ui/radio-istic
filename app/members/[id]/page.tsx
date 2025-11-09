"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { User, Mail, Phone, GraduationCap, Trophy, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { membersData } from "@/lib/members-data"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { notFound, useRouter } from "next/navigation"

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  const { id } = params
  const member = membersData.find((m) => m.id === id)
  const router = useRouter()

  if (!member) {
    notFound()
  }

  const handleSendMessage = () => {
    router.push(`/chat?member=${id}`)
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        header={{
          title: "Profil du Membre",
          description: "Informations détaillées",
          icon: User,
        }}
      >
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/members">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux membres
          </Link>
        </Button>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-electric-blue/20 via-background to-neon-lime/10 border border-electric-blue/30 rounded-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-electric-blue/50">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={`${member.firstName} ${member.lastName}`} />
                <AvatarFallback className="bg-electric-blue/20 text-electric-blue font-bold text-4xl">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-card ${
                  member.isOnline ? "bg-neon-lime" : "bg-muted"
                }`}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold mb-2">
                {member.firstName} {member.lastName}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {member.field}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Année {member.year}
                </Badge>
                <Badge
                  className={`text-sm ${
                    member.isOnline
                      ? "bg-neon-lime/20 text-neon-lime border-neon-lime/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {member.isOnline ? "En ligne" : "Hors ligne"}
                </Badge>
              </div>
              {member.role && (
                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-4">
                  {member.role}
                </Badge>
              )}
              {member.points && (
                <div className="flex items-center gap-2 text-neon-lime mb-4">
                  <Trophy className="h-5 w-5" />
                  <span className="text-xl font-bold">{member.points} points</span>
                </div>
              )}
              <Button onClick={handleSendMessage} className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue">
                <MessageCircle className="h-4 w-4 mr-2" />
                Envoyer un message
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-display font-bold mb-4">Informations de contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-electric-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-electric-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-electric-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Filière</p>
                <p className="font-medium">
                  {member.field} - Année {member.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-display font-bold mb-4">Motivation</h2>
          <p className="text-muted-foreground">{member.motivation}</p>
        </div>

        {/* Projects */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-display font-bold mb-4">Projets & Émissions</h2>
          <p className="text-muted-foreground">{member.projects}</p>
        </div>

        {/* Skills */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-display font-bold mb-4">Compétences</h2>
          <p className="text-muted-foreground">{member.skills}</p>
        </div>
      </DashboardPageLayout>
    </ProtectedRoute>
  )
}
