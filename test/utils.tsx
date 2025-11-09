import { render, RenderOptions } from "@testing-library/react"
import { ReactElement, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

// Custom render function with providers
function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

// Mock data generators
export const mockUser = {
  id: "test-user-1",
  name: "Test User",
  email: "test@example.com",
  avatar: "/avatars/test.png",
}

export const mockConversation = {
  id: "conv-1",
  userId: "user-1",
  userName: "Alice",
  lastMessage: "Hello!",
  timestamp: new Date().toISOString(),
  unread: 0,
  isOnline: true,
  status: "online" as const,
}

export const mockMessage = {
  id: "msg-1",
  conversationId: "conv-1",
  senderId: "user-1",
  senderName: "Alice",
  content: "Test message",
  timestamp: new Date().toISOString(),
  status: "sent" as const,
  reactions: [],
  replyToId: null,
}

export const mockEvent = {
  id: "event-1",
  title: "Test Event",
  description: "A test event",
  category: "Podcast" as const,
  date: "2025-12-01",
  time: "19:00",
  location: "ISTIC",
  image: "/events/test.jpg",
  participants: 5,
  maxParticipants: 20,
}

// Wait for async updates
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0))
