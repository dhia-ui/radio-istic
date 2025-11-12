import { useEffect, useCallback } from 'react'
import { useToast } from './use-toast'

interface Reminder {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  reminderTime: number // timestamp when notification should fire
  type: '1h' | '1d'
}

export function useNotifications() {
  const { toast } = useToast()

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Non supporté",
        description: "Les notifications ne sont pas supportées par votre navigateur.",
      })
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des rappels pour vos événements.",
        })
        return true
      }
    }

    if (Notification.permission === 'denied') {
      toast({
        variant: "destructive",
        title: "Notifications bloquées",
        description: "Veuillez autoriser les notifications dans les paramètres du navigateur.",
      })
    }

    return false
  }, [toast])

  // Show a notification
  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/logo/logo radio noir.png',
        badge: '/logo/logo radio noir.png',
        tag: 'radio-istic-reminder',
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto close after 30 seconds
      setTimeout(() => notification.close(), 30000)
    }
  }, [])

  // Save reminder to localStorage
  const saveReminder = useCallback((reminder: Reminder) => {
    const reminders = getReminders()
    // Check if reminder already exists
    const exists = reminders.some(
      r => r.eventId === reminder.eventId && r.type === reminder.type
    )
    if (!exists) {
      reminders.push(reminder)
      localStorage.setItem('radio-istic-reminders', JSON.stringify(reminders))
      return true
    }
    return false
  }, [])

  // Get all reminders
  const getReminders = useCallback((): Reminder[] => {
    try {
      const stored = localStorage.getItem('radio-istic-reminders')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  // Remove a reminder
  const removeReminder = useCallback((reminderId: string) => {
    const reminders = getReminders()
    const filtered = reminders.filter(r => r.id !== reminderId)
    localStorage.setItem('radio-istic-reminders', JSON.stringify(filtered))
  }, [getReminders])

  // Check for due reminders
  const checkReminders = useCallback(() => {
    const reminders = getReminders()
    const now = Date.now()
    
    reminders.forEach(reminder => {
      if (now >= reminder.reminderTime) {
        // Show notification
        const eventDate = new Date(reminder.eventDate)
        const timeStr = eventDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        
        showNotification(
          `📅 Rappel: ${reminder.eventTitle}`,
          `L'événement commence ${reminder.type === '1h' ? 'dans 1 heure' : 'demain'} à ${timeStr}`,
        )

        // Show toast as well
        toast({
          title: `📅 Rappel: ${reminder.eventTitle}`,
          description: `L'événement commence ${reminder.type === '1h' ? 'dans 1 heure' : 'demain'} à ${timeStr}`,
          duration: 10000,
        })

        // Remove the reminder
        removeReminder(reminder.id)
      }
    })
  }, [getReminders, showNotification, toast, removeReminder])

  // Schedule a reminder
  const scheduleReminder = useCallback(async (
    eventId: string,
    eventTitle: string,
    eventDate: string,
    type: '1h' | '1d'
  ) => {
    // Request permission first
    const hasPermission = await requestPermission()
    if (!hasPermission) {
      return false
    }

    const eventTime = new Date(eventDate).getTime()
    const now = Date.now()

    // Calculate reminder time
    let reminderTime: number
    if (type === '1h') {
      reminderTime = eventTime - (60 * 60 * 1000) // 1 hour before
    } else {
      reminderTime = eventTime - (24 * 60 * 60 * 1000) // 1 day before
    }

    // Check if reminder time is in the past
    if (reminderTime <= now) {
      toast({
        variant: "destructive",
        title: "Impossible de programmer",
        description: `Le rappel ${type === '1h' ? "d'1 heure" : "d'1 jour"} est déjà passé pour cet événement.`,
      })
      return false
    }

    const reminder: Reminder = {
      id: `${eventId}-${type}-${Date.now()}`,
      eventId,
      eventTitle,
      eventDate,
      reminderTime,
      type,
    }

    const saved = saveReminder(reminder)
    if (saved) {
      const timeUntil = reminderTime - now
      const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60))
      const daysUntil = Math.floor(hoursUntil / 24)
      
      let timeMessage = ''
      if (daysUntil > 0) {
        timeMessage = `dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`
      } else if (hoursUntil > 0) {
        timeMessage = `dans ${hoursUntil} heure${hoursUntil > 1 ? 's' : ''}`
      } else {
        const minutesUntil = Math.floor(timeUntil / (1000 * 60))
        timeMessage = `dans ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''}`
      }

      toast({
        title: "✅ Rappel programmé",
        description: `Vous serez notifié ${timeMessage} (${type === '1h' ? '1h' : '1 jour'} avant l'événement).`,
      })
      return true
    } else {
      toast({
        variant: "destructive",
        title: "Rappel déjà programmé",
        description: `Un rappel ${type === '1h' ? "d'1 heure" : "d'1 jour"} existe déjà pour cet événement.`,
      })
      return false
    }
  }, [requestPermission, saveReminder, toast])

  // Get reminders for a specific event
  const getEventReminders = useCallback((eventId: string) => {
    const reminders = getReminders()
    return reminders.filter(r => r.eventId === eventId)
  }, [getReminders])

  // Set up interval to check reminders
  useEffect(() => {
    // Check immediately
    checkReminders()

    // Check every minute
    const interval = setInterval(checkReminders, 60 * 1000)

    return () => clearInterval(interval)
  }, [checkReminders])

  return {
    requestPermission,
    scheduleReminder,
    getEventReminders,
    getReminders,
    removeReminder,
  }
}
