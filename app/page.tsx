"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Zap, TrendingUp, Globe, Shield, Rocket, Lock, ChevronDown, ChevronUp } from "lucide-react"

export default function Home() {
  const [handle, setHandle] = useState("")
  const [platform, setPlatform] = useState<
    | "youtube"
    | "instagram"
    | "telegram"
    | "tiktok"
    | "twitter"
    | "facebook"
    | "linkedin"
    | "twitch"
    | "reddit"
    | "snapchat"
    | "bluesky"
    | "threads"
    | "all"
  >("all")
  const [score, setScore] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [liveCount, setLiveCount] = useState(2847)
  const [error, setError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const nextIncrease = new Date(now)
      nextIncrease.setHours(nextIncrease.getHours() + 1)
      nextIncrease.setMinutes(0)
      nextIncrease.setSeconds(0)

      const diff = nextIncrease.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const validateHandle = async (handleToValidate: string, selectedPlatform: string) => {
    if (!handleToValidate.trim()) {
      setError("Please enter a username")
      return false
    }

    setIsValidating(true)
    setError("")

    try {
      const response = await fetch("/api/validate-handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleToValidate, platform: selectedPlatform }),
      })

      const data = await response.json()

      if (!data.valid) {
        setError(data.error || "Incorrect username")
        setIsValidating(false)
        return false
      }

      setIsValidating(false)
      return true
    } catch (err) {
      setError("Unable to validate username. Please try again.")
      setIsValidating(false)
      return false
    }
  }

  const calculateScore = async () => {
    const isValid = await validateHandle(handle, platform)
    if (!isValid) return

    setIsCalculating(true)
    setError("")

    try {
      const response = await fetch("/api/calculate-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, platform }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsCalculating(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      setScore(data.score)
      setIsCalculating(false)
    } catch (err) {
      setError("Failed to calculate score. Please try again.")
      setIsCalculating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyXCWhEkJJQirzncqLPQZpQ6j8IbaDzn2wP34v0cZjCR8zZCOEYUR5cTXA0mzw0bODvlw/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            email: email,
            timestamp: new Date().toISOString(),
            score: score || "pending",
            platform: platform,
            handle: handle || "not provided",
          }),
        },
      )

      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error submitting email:", err)
      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  const testimonials = [
    {
      name: "CreatorPro",
      handle: "@CreatorPro",
      quote: "My 842 score got me 3 brand deals!",
      avatar: "CP",
    },
    {
      name: "GrowthGuru",
      handle: "@GrowthGuru",
      quote: "I doubled my engagement!",
      avatar: "GG",
    },
    {
      name: "InfluenceKing",
      handle: "@InfluenceKing",
      quote: "The verification badge transformed my brand.",
      avatar: "IK",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Luna Sky", score: 9987, trend: "↑" },
    { rank: 2, name: "Marcus Gold", score: 9876, trend: "↑" },
    { rank: 3, name: "Zara Nova", score: 9654, trend: "↓" },
    { rank: 4, name: "Alex Chen", score: 9847, trend: "↑" },
    { rank: 5, name: "Jordan Mills", score: 8923, trend: "→" },
  ]

  const recentJoins = [
    { name: "@SarahT", score: 784, time: "now" },
    { name: "@Mike_J", score: 692, time: "2 min ago" },
    { name: "@Jessica_Lee", score: 856, time: "5 min ago" },
    { name: "@Alex_Dev", score: 721, time: "8 min ago" },
  ]

  const faqs = [
    {
      question: "How is my Uniura Score calculated?",
      answer:
        "Your score is calculated using our proprietary AI algorithm that analyzes engagement rates, audience quality, growth trajectory, authenticity metrics, and cross-platform influence.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes. We use enterprise-grade encryption and never share your data with third parties. Your privacy is our top priority.",
    },
    {
      question: "Can I improve my score?",
      answer:
        "Your score updates in real-time as your engagement and influence grow. Focus on authentic content and genuine audience connection.",
    },
    {
      question: "What platforms are supported?",
      answer:
        "Currently we support YouTube, Instagram, TikTok, Twitter/X, Facebook, LinkedIn, Twitch, Telegram, Reddit, Snapchat, Bluesky, and Threads. More platforms coming soon!",
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background gradient elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section with Calculator */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <div className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
                ✨ The Social Score Revolution
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              What's Your <span className="gradient-text">Uniura Score?</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-balance">
              The Only Social Score That Matters. Join the Leaderboard.
            </p>

            {/* Calculator Section */}
            <div className="mb-12">
              {!score ? (
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <div>
                    <div className="mb-3">
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as any)}
                        disabled={isCalculating}
                        className="w-full px-6 py-4 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="facebook">Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitch">Twitch</option>
                        <option value="telegram">Telegram</option>
                        <option value="reddit">Reddit</option>
                        <option value="snapchat">Snapchat</option>
                        <option value="bluesky">Bluesky</option>
                        <option value="threads">Threads</option>
                        <option value="all">All Platforms</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder={`Enter your ${platform === "youtube" ? "YouTube" : platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : platform === "twitter" ? "Twitter/X" : platform === "facebook" ? "Facebook" : platform === "linkedin" ? "LinkedIn" : platform === "twitch" ? "Twitch" : platform === "telegram" ? "Telegram" : platform === "reddit" ? "Reddit" : platform === "snapchat" ? "Snapchat" : platform === "bluesky" ? "Bluesky" : platform === "threads" ? "Threads" : "universal"} handle`}
                        value={handle}
                        onChange={(e) => {
                          setHandle(e.target.value)
                          setError("")
                        }}
                        onKeyPress={(e) => e.key === "Enter" && calculateScore()}
                        disabled={isCalculating}
                        className="flex-1 px-6 py-4 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                      />
                      <button
                        onClick={calculateScore}
                        disabled={isValidating || isCalculating}
                        className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 whitespace-nowrap glow-border disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        {isCalculating ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                            Calculating...
                          </span>
                        ) : isValidating ? (
                          "Validating..."
                        ) : (
                          "Calculate My Score"
                        )}
                      </button>
                    </div>
                    {error && <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>}
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="p-8 rounded-xl border border-primary/50 bg-card/50 mb-6 animate-in fade-in duration-500">
                    <p className="text-muted-foreground mb-2">Your Uniura Score</p>
                    <div className="text-6xl font-bold gradient-text mb-2">{score.toLocaleString()}</div>
                    <p className="text-primary font-semibold mb-6">
                      {score > 90000 ? "🔥 Elite Creator" : score > 50000 ? "⭐ Rising Star" : "🚀 Growing Creator"}
                    </p>
                    <button
                      onClick={() => {
                        setScore(null)
                        setHandle("")
                        setError("")
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-all"
                    >
                      Calculate another score
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-6 py-4 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 whitespace-nowrap glow-border"
                    >
                      Join Waitlist
                    </button>
                  </form>
                  {submitted && <p className="mt-4 text-primary text-sm">✓ Check your email to lock your score!</p>}
                </div>
              )}
            </div>

            {/* Live Counter */}
            <div className="text-muted-foreground text-sm">
              Live Counter: <span className="text-primary font-semibold">{liveCount}+ scores calculated today</span>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 px-4 bg-card/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-center text-muted-foreground mb-8">Featured on</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-2xl font-bold text-muted-foreground">TechCrunch</div>
                <div className="text-2xl font-bold text-muted-foreground">Forbes</div>
                <div className="text-2xl font-bold text-muted-foreground">Entrepreneur</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-border bg-background/50">
                <p className="text-lg mb-4">
                  <span className="text-primary font-semibold">"My 842 score got me 3 brand deals!"</span>
                </p>
                <p className="text-muted-foreground">@CreatorPro</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background/50">
                <p className="text-lg mb-4">
                  <span className="text-primary font-semibold">"I doubled my engagement!"</span>
                </p>
                <p className="text-muted-foreground">@GrowthGuru</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-all">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Link Your YouTube/Instagram</h3>
                <p className="text-muted-foreground">
                  Connect your social media accounts in seconds. We verify your authenticity instantly.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-all">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Get Your Verified Aura Score</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your engagement, reach, and influence to calculate your unique score.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-all">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Climb the Global Leaderboard</h3>
                <p className="text-muted-foreground">
                  Compete with creators worldwide and watch your influence grow in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scarcity Section with Progress Bar */}
        <section className="py-20 px-4 bg-card/30 border-y border-border">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-bg border border-primary/30 rounded-2xl p-8 md:p-12">
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
                <span className="text-primary font-semibold text-sm">⏰ Limited Time Offer</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">Founder Spots Filling Fast</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Limited to the first 1,000 users. Secure your founder status and unlock exclusive benefits.
              </p>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Founder Spots: 247 remaining</span>
                  <span className="text-primary font-semibold">75% Filled</span>
                </div>
                <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden border border-border">
                  <div className="bg-gradient-to-r from-primary to-secondary h-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Next price increase in:</p>
                <p className="text-2xl font-bold text-primary">{timeLeft}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fake Live Feed */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">Recent Joins</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">See who's joining the movement</p>

            <div className="space-y-3">
              {recentJoins.map((join, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-border bg-card/50 flex items-center justify-between animate-pulse"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="font-semibold">{join.name}</span>
                    <span className="text-muted-foreground">scored {join.score.toLocaleString()}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{join.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-card/30 border-y border-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">Frequently Asked Questions</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">Everything you need to know about Uniura</p>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-6 flex items-center justify-between hover:bg-card/50 transition-all text-left"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">
              Trusted by Creators Worldwide
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Bank-Level Security</h3>
                <p className="text-muted-foreground">Enterprise-grade encryption protects your data 24/7</p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Privacy First</h3>
                <p className="text-muted-foreground">Your data is never sold or shared with third parties</p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/30">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-lg">99.9% Uptime</h3>
                <p className="text-muted-foreground">Reliable infrastructure you can count on</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-balance">Lock In Your Founder Status</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Get your Uniura Score now and join the elite circle of verified creators.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 whitespace-nowrap glow-border"
              >
                Get My Score Now
              </button>
            </form>
            {submitted && <p className="mt-4 text-primary text-sm">✓ Check your email to get started!</p>}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
            <p>© 2025 Uniura. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
