import DashboardPageLayout from "@/components/dashboard/layout"
import { GraduationCap, Award, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const trainingModules = [
  {
    id: "1",
    title: "Adobe Photoshop - Niveau Débutant",
    description: "Maîtrisez les bases de Photoshop pour créer des visuels professionnels",
    duration: "8 heures",
    sessions: 4,
    enrolled: 24,
    maxEnrolled: 30,
    level: "Débutant",
    instructor: "Dhia Eddine Ktiti",
    image: "/photoshop-design-tutorial.jpg",
    progress: 0,
  },
  {
    id: "2",
    title: "Adobe Illustrator - Design Vectoriel",
    description: "Créez des logos et illustrations vectorielles avec Illustrator",
    duration: "10 heures",
    sessions: 5,
    enrolled: 18,
    maxEnrolled: 25,
    level: "Intermédiaire",
    instructor: "Équipe Média",
    image: "/illustrator-vector-design.jpg",
    progress: 0,
  },
  {
    id: "3",
    title: "Montage Vidéo avec Premiere Pro",
    description: "Apprenez à monter des vidéos professionnelles pour vos projets",
    duration: "12 heures",
    sessions: 6,
    enrolled: 20,
    maxEnrolled: 25,
    level: "Intermédiaire",
    instructor: "Équipe Média",
    image: "/video-editing-premiere.jpg",
    progress: 0,
  },
  {
    id: "4",
    title: "Graphic Design Fundamentals",
    description: "Les principes fondamentaux du design graphique et de la composition",
    duration: "6 heures",
    sessions: 3,
    enrolled: 32,
    maxEnrolled: 35,
    level: "Débutant",
    instructor: "Équipe Média",
    image: "/placeholder.svg?height=300&width=400",
    progress: 0,
  },
  {
    id: "5",
    title: "Podcast Production",
    description: "De l'enregistrement au montage: créez votre propre podcast",
    duration: "8 heures",
    sessions: 4,
    enrolled: 15,
    maxEnrolled: 20,
    level: "Débutant",
    instructor: "Équipe Radio",
    image: "/placeholder.svg?height=300&width=400",
    progress: 0,
  },
  {
    id: "6",
    title: "Social Media Content Creation",
    description: "Créez du contenu engageant pour Instagram, TikTok et Facebook",
    duration: "6 heures",
    sessions: 3,
    enrolled: 28,
    maxEnrolled: 30,
    level: "Débutant",
    instructor: "Équipe Média",
    image: "/placeholder.svg?height=300&width=400",
    progress: 0,
  },
]

const levelColors: Record<string, string> = {
  Débutant: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Intermédiaire: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Avancé: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
}

export default function TrainingPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Formation",
        description: "Développez vos compétences",
        icon: GraduationCap,
      }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neon-lime/20 via-background to-electric-blue/10 border border-neon-lime/30 rounded-xl p-8 mb-6">
        <h2 className="text-3xl font-display font-bold mb-3">Formations gratuites pour les membres</h2>
        <p className="text-muted-foreground mb-4">
          Apprenez le design graphique, le montage vidéo, la production de podcasts et bien plus encore avec nos
          formateurs expérimentés.
        </p>
        <Button className="bg-neon-lime text-background hover:bg-neon-lime/90">
          <Award className="h-4 w-4 mr-2" />
          Voir mes certificats
        </Button>
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingModules.map((module) => (
          <div
            key={module.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-neon-lime/50 transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={module.image || "/placeholder.svg"}
                alt={module.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className={`absolute top-4 right-4 ${levelColors[module.level]}`}>{module.level}</Badge>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-display font-bold mb-2 group-hover:text-neon-lime transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{module.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-neon-lime" />
                  <span>
                    {module.duration} • {module.sessions} sessions
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-neon-lime" />
                  <span>
                    {module.enrolled}/{module.maxEnrolled} inscrits
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-neon-lime" />
                  <span>{module.instructor}</span>
                </div>
              </div>

              {module.progress > 0 ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-bold text-neon-lime">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              ) : null}

              <Button className="w-full bg-neon-lime text-background hover:bg-neon-lime/90">
                {module.progress > 0 ? "Continuer" : "S'inscrire"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardPageLayout>
  )
}
