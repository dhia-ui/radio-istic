"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Award, Briefcase, Lightbulb, MessageSquare, Shield } from "lucide-react"
import type { Member } from "@/types/member"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

type MemberProfileModalProps = {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberProfileModal({ member, open, onOpenChange }: MemberProfileModalProps) {
  const router = useRouter()
  const { user } = useAuth()

  if (!member) return null

  // Check if viewing user is bureau member
  const isViewerBureau = user?.isBureau || user?.role === 'president' || user?.role === 'admin'
  
  // Check if member being viewed is bureau member
  const isBureauMember = member.isBureau || 
    ['president', 'vice-president', 'secretary-general', 'event-manager', 'media-manager', 'sponsor-manager', 'rh-manager', 'admin'].includes(member.role || '')

  // Regular members cannot view full profiles of bureau members
  const canViewFullProfile = isViewerBureau || !isBureauMember

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
          {isBureauMember && (
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-neon-lime/10 rounded-lg -z-10" />
          )}
          <Avatar className={`h-24 w-24 mb-4 ${isBureauMember ? "ring-4 ring-electric-blue/50" : ""}`}>
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
            {isBureauMember && (
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                <Shield className="h-3 w-3 mr-1" />
                {member.coordonation || member.role}
              </Badge>
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

        {/* Bureau Member - Limited Info for Regular Members */}
        {isBureauMember && !canViewFullProfile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-8 text-center">
              <Shield className="h-12 w-12 text-electric-blue/50" />
            </div>
            <p className="text-center text-muted-foreground">
              Membre du bureau - Informations privées
            </p>
            <div className="flex items-center gap-3 text-sm justify-center pt-4">
              <Mail className="h-4 w-4 text-electric-blue" />
              <span className="text-muted-foreground">Contact disponible uniquement pour le bureau</span>
            </div>
          </div>
        ) : (
          <>
            {/* Contact Info - Only for non-bureau or bureau viewers */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-electric-blue" />
                <a href={`mailto:${member.email}`} className="hover:text-electric-blue transition-colors">
                  {member.email}
                </a>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-neon-lime" />
                  <a href={`tel:${member.phone}`} className="hover:text-neon-lime transition-colors">
                    {member.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              {member.motivation && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-signal-orange" />
                    <h3 className="font-semibold">Motivation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{member.motivation}</p>
                </div>
              )}

              {member.projects && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-electric-blue" />
                    <h3 className="font-semibold">Projets</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{member.projects}</p>
                </div>
              )}

              {member.skills && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-neon-lime" />
                    <h3 className="font-semibold">Compétences</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{member.skills}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {canViewFullProfile && (
            <Button onClick={handleSendMessage} className="flex-1 bg-electric-blue hover:bg-electric-blue/90">
              <MessageSquare className="h-4 w-4 mr-2" />
              Envoyer un message
            </Button>
          )}
          {!canViewFullProfile && (
            <Button variant="outline" className="flex-1" disabled>
              <Shield className="h-4 w-4 mr-2" />
              Profil privé
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
