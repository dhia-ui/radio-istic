"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Award, Briefcase, Lightbulb, MessageSquare } from "lucide-react"
import type { Member } from "@/lib/members-data"
import { useRouter } from "next/navigation"

type MemberProfileModalProps = {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberProfileModal({ member, open, onOpenChange }: MemberProfileModalProps) {
  const router = useRouter()

  if (!member) return null

  const handleSendMessage = () => {
    onOpenChange(false)
    router.push(`/chat?member=${member.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Profil de {member.name}</DialogTitle>
        </DialogHeader>

        {/* Header with Avatar */}
        <div className="flex flex-col items-center text-center mb-6 relative">
          {member.isBureau && (
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-neon-lime/10 rounded-lg -z-10" />
          )}
          <Avatar className={`h-24 w-24 mb-4 ${member.isBureau ? "ring-4 ring-electric-blue/50" : ""}`}>
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback className="text-2xl bg-electric-blue/20 text-electric-blue">
              {member.firstName[0]}
              {member.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-display font-bold mb-2">{member.name}</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="border-electric-blue/30 text-electric-blue">
              {member.field} - Année {member.year}
            </Badge>
            {member.isBureau && (
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">⭐ {member.role}</Badge>
            )}
            <Badge
              variant="outline"
              className={member.status === "online" ? "border-neon-lime/30 text-neon-lime" : "border-muted"}
            >
              {member.status === "online" ? "● En ligne" : "○ Hors ligne"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Award className="h-4 w-4 text-signal-orange" />
            <span className="text-sm font-semibold">{member.points} points</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-electric-blue" />
            <a href={`mailto:${member.email}`} className="hover:text-electric-blue transition-colors">
              {member.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-neon-lime" />
            <a href={`tel:${member.phone}`} className="hover:text-neon-lime transition-colors">
              {member.phone}
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-signal-orange" />
              <h3 className="font-semibold">Motivation</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{member.motivation}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-electric-blue" />
              <h3 className="font-semibold">Projets</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{member.projects}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-neon-lime" />
              <h3 className="font-semibold">Compétences</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{member.skills}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSendMessage} className="flex-1 bg-electric-blue hover:bg-electric-blue/90">
            <MessageSquare className="h-4 w-4 mr-2" />
            Envoyer un message
          </Button>
          <Button variant="outline" onClick={() => router.push(`/members/${member.id}`)} className="flex-1">
            Voir le profil complet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
