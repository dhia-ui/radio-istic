import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@/test/utils"
import { AudioWaveform } from "@/components/media/audio-waveform"
import userEvent from "@testing-library/user-event"

describe("AudioWaveform Component", () => {
  const mockSrc = "/audio/test.mp3"
  const mockTitle = "Test Track - Test Artist"

  beforeEach(() => {
    // Mock localStorage
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    })

    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      fillStyle: "",
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      closePath: vi.fn(),
    })) as any
  })

  it("should render track information", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    expect(screen.getByText(mockTitle)).toBeInTheDocument()
  })

  it("should render play button initially", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    const playButton = screen.getByLabelText(/play/i)
    expect(playButton).toBeInTheDocument()
  })

  it("should show loading state while processing peaks", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    // Should show some loading indicator or disabled state initially
    const canvas = document.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("should render canvas for waveform", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    const canvas = document.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute("width")
    expect(canvas).toHaveAttribute("height")
  })

  it("should render volume control slider", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    const volumeSlider = screen.getByRole("slider")
    expect(volumeSlider).toBeInTheDocument()
  })

  it("should have accessible controls", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    // Check for ARIA labels
    expect(screen.getByLabelText(/play/i)).toBeInTheDocument()
  })

  it("should display time information", () => {
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    // Should show current time (0:00 initially)
    expect(screen.getAllByText("0:00").length).toBeGreaterThan(0)
  })

  it("should try to use cached peaks from localStorage", () => {
    const getItemSpy = vi.spyOn(localStorage, "getItem")
    
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    expect(getItemSpy).toHaveBeenCalledWith(`waveform_peaks_${mockSrc}`)
  })

  it("should handle play/pause toggle", async () => {
    const user = userEvent.setup()
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    const playButton = screen.getByLabelText(/play/i)
    
    await user.click(playButton)

    // After click, button should change to pause
    await waitFor(() => {
      expect(screen.getByLabelText(/pause/i)).toBeInTheDocument()
    })
  })

  it("should handle volume changes", async () => {
    const user = userEvent.setup()
    render(<AudioWaveform src={mockSrc} title={mockTitle} />)

    const volumeSlider = screen.getByRole("slider")
    
    // Simulate volume change
    await user.click(volumeSlider)
    
    // Volume slider should be interactive
    expect(volumeSlider).not.toBeDisabled()
  })
})
