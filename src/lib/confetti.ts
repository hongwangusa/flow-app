import confetti from 'canvas-confetti'

export const launchConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#1B8A8F', '#2ABFBF', '#F5C842', '#E8A020', '#E8644B']
  })
}
