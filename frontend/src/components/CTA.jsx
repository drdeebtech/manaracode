import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Clock, Shield } from 'lucide-react'
import { postContact } from '../lib/api'
import Turnstile from './Turnstile'
import { Button, Card, Input, Textarea, EmptyState } from '../ui'
import { EASE } from '../styles/tokens'

const benefits = [
  { Icon: Clock, text: 'Response within 24 hours' },
  { Icon: Shield, text: 'Free initial consultation' },
  { Icon: Mail, text: 'No commitment required' },
]

export default function CTA() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [token, setToken] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const turnstileRef = useRef(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    let ok = false
    try {
      const res = await postContact(form, token)
      if (res.status === 429) {
        setError('Too many requests. Please wait a minute and try again.')
        return
      }
      if (res.status === 403) {
        setError('Verification failed. Please complete the security check and try again.')
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }
      ok = true
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
      // Turnstile tokens are single-use; re-arm the widget for any retry.
      if (!ok) {
        setToken('')
        turnstileRef.current?.reset()
      }
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left ── (vertical reveal: a horizontal x-offset overflowed the
              viewport on the right while pending whileInView) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE.out }}
          >
            <span className="text-sm font-semibold text-accent tracking-widest uppercase mb-4 block">
              Let's Work Together
            </span>
            <h2 id="contact-heading" className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-6 leading-tight">
              Ready to Build Something Great?
            </h2>
            <p className="text-muted text-lg mb-10 leading-relaxed">
              Tell us about your project. We'll get back to you within 24 hours with a clear, no-obligation plan.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-soft rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                  </div>
                  <span className="text-muted text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:contact@manaracode.com"
              className="inline-flex items-center gap-2 text-accent hover:text-fg text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              contact@manaracode.com
            </a>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE.out }}
          >
            <Card variant="elevated" padding="lg">
              {submitted ? (
                <EmptyState
                  tone="success"
                  title="Message Sent!"
                  description={`Thanks, ${form.name || 'there'}! We'll be in touch within 24 hours.`}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Your Name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                  />
                  <Textarea
                    label="Tell Us About Your Project"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="We need to build a platform that..."
                  />

                  <Turnstile
                    ref={turnstileRef}
                    onVerify={setToken}
                    onExpire={() => setToken('')}
                    onError={() => setToken('')}
                  />

                  {error && (
                    <p role="alert" className="text-xs text-error text-center">
                      {error}
                    </p>
                  )}

                  <Button type="submit" variant="webgl" size="lg" fullWidth loading={submitting} Icon={ArrowRight}>
                    Send Message
                  </Button>

                  <p className="text-xs text-muted text-center">We respect your privacy. No spam, ever.</p>
                </form>
              )}
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
