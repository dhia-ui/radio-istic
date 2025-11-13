"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Trash2, Edit2, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import api from "@/lib/api"

interface Comment {
  _id: string
  userId: {
    _id: string
    name: string
    avatar?: string
  }
  userName: string
  userAvatar?: string
  content: string
  likes: string[]
  replies?: Comment[]
  createdAt: string
  edited?: boolean
  editedAt?: string
}

interface EventCommentsProps {
  eventId: string
}

export function EventComments({ eventId }: EventCommentsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch comments
  useEffect(() => {
    fetchComments()
  }, [eventId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/event/${eventId}`)
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commentaires",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
      })
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newComment,
            replyTo,
          }),
        }
      )

      const data = await response.json()
      if (data.success) {
        setNewComment("")
        setReplyTo(null)
        await fetchComments()
        toast({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été publié avec succès",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier le commentaire",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer un commentaire",
      })
      return
    }

    try {
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      if (data.success) {
        await fetchComments()
      }
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return

    try {
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      if (data.success) {
        await fetchComments()
        toast({
          title: "Commentaire supprimé",
          description: "Le commentaire a été supprimé avec succès",
        })
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le commentaire",
      })
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editContent,
          }),
        }
      )

      const data = await response.json()
      if (data.success) {
        setEditingId(null)
        setEditContent("")
        await fetchComments()
        toast({
          title: "Commentaire modifié",
          description: "Votre commentaire a été mis à jour",
        })
      }
    } catch (error) {
      console.error("Error editing comment:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le commentaire",
      })
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isOwnComment = user?.id === comment.userId._id
    const hasLiked = user && comment.likes.includes(user.id)

    return (
      <div className={`${isReply ? "ml-12 mt-2" : "mt-4"}`}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.userId.avatar || comment.userAvatar} />
            <AvatarFallback>
              {comment.userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{comment.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                  {comment.edited && " (modifié)"}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEditComment(comment._id)}>
                      Enregistrer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditContent("")
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-1 text-sm">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                  hasLiked ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                <span>{comment.likes.length}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyTo(comment._id)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Répondre</span>
                </button>
              )}

              {isOwnComment && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(comment._id)
                      setEditContent(comment.content)
                    }}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                </>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply._id} comment={reply} isReply />
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyTo === comment._id && (
              <div className="mt-2 ml-12">
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Écrire une réponse..."
                    className="min-h-[60px]"
                  />
                  <div className="flex flex-col gap-2">
                    <Button size="icon" onClick={handleSubmitComment} disabled={isSubmitting}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setReplyTo(null)
                        setNewComment("")
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Commentaires ({comments.length})
      </h3>

      {/* New comment input */}
      {user && !replyTo && (
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || user.photo} />
            <AvatarFallback>
              {user.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitComment()
                }
              }}
            />
            <Button onClick={handleSubmitComment} disabled={isSubmitting || !newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Chargement des commentaires...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun commentaire pour l'instant. Soyez le premier à commenter!
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
