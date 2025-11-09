"use client"

import type React from "react"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Users, Search, Trophy, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { membersData } from "@/lib/members-data"
import ProtectedRoute from "@/components/protected-route"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MemberProfileModal } from "@/components/member-profile-modal"
import type { Member } from "@/lib/members-data"

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterField, setFilterField] = useState("all")
  const [filterYear, setFilterYear] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get top members by points
  const topMembers = [...membersData].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5)

  // Filter members
  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesField = filterField === "all" || member.field === filterField
    const matchesYear = filterYear === "all" || member.year.toString() === filterYear
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "online" && member.status === "online") ||
      (filterStatus === "offline" && member.status === "offline")

    return matchesSearch && matchesField && matchesYear && matchesStatus
  })

  // Count online members
  const onlineCount = membersData.filter((m) => m.status === "online").length

  const handleMemberClick = (member: Member, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        header={{
          title: "Portail des Membres",
          description: `${membersData.length} membres • ${onlineCount} en ligne`,
          icon: Users,
        }}
      >
        {/* Top Members Section */}
        <div className="bg-gradient-to-br from-electric-blue/20 via-background to-neon-lime/10 border border-electric-blue/30 rounded-xl p-6 mb-6 glass card-3d-lift">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-6 w-6 text-neon-lime" />
            <h2 className="text-2xl font-display font-bold">Top Membres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topMembers.map((member, index) => (
              <div
                key={member.id}
                onClick={(e) => handleMemberClick(member, e)}
                className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 hover:border-electric-blue/50 transition-all group cursor-pointer card-3d floating"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <Avatar
                      className={`h-16 w-16 avatar-ring-3d ${member.isBureau ? "ring-2 ring-electric-blue/50" : "border-2 border-electric-blue/50"}`}
                    >
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={`${member.firstName} ${member.lastName}`}
                      />
                      <AvatarFallback className="bg-electric-blue/20 text-electric-blue font-bold">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 bg-neon-lime text-background rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    {member.isBureau && (
                      <div className="absolute -bottom-1 -left-1 bg-electric-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ⭐
                      </div>
                    )}
                  </div>
                  <p className="font-display font-bold text-sm mb-1 group-hover:text-electric-blue transition-colors">
                    {member.firstName} {member.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-neon-lime">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-bold">{member.points} pts</span>
                  </div>
                  {member.role && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {member.role}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 glass-light">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="GLSI">GLSI</SelectItem>
                  <SelectItem value="IRS">IRS</SelectItem>
                  <SelectItem value="LISI">LISI</SelectItem>
                  <SelectItem value="LAI">LAI</SelectItem>
                  <SelectItem value="IOT">IOT</SelectItem>
                  <SelectItem value="LT">LT</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="1">1ère année</SelectItem>
                  <SelectItem value="2">2ème année</SelectItem>
                  <SelectItem value="3">3ème année</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="online">En ligne</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={(e) => handleMemberClick(member, e)}
              className="bg-card border border-border rounded-lg p-5 hover:border-electric-blue/50 transition-all group cursor-pointer card-3d-lift"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className={`h-14 w-14 avatar-ring-3d ${member.isBureau ? "ring-2 ring-electric-blue/50" : ""}`}>
                    <AvatarImage
                      src={member.avatar || "/placeholder.svg"}
                      alt={`${member.firstName} ${member.lastName}`}
                    />
                    <AvatarFallback className="bg-electric-blue/20 text-electric-blue font-bold">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                      member.status === "online" ? "bg-neon-lime" : "bg-muted"
                    }`}
                  />
                  {member.isBureau && (
                    <div className="absolute -top-1 -left-1 bg-electric-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ⭐
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg mb-1 group-hover:text-electric-blue transition-colors truncate">
                    {member.firstName} {member.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.field}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Année {member.year}
                    </Badge>
                  </div>
                  {member.role && (
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs mb-2">
                      {member.role}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{member.motivation}</p>
                  {member.points && (
                    <div className="flex items-center gap-1 mt-2 text-neon-lime">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-bold">{member.points} points</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun membre trouvé</p>
          </div>
        )}

        <MemberProfileModal member={selectedMember} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </DashboardPageLayout>
    </ProtectedRoute>
  )
}
