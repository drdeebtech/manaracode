import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Clock, Shield } from 'lucide-react'
import { postContact } from '../lib/api'

const benefits = [
  { Icon: Clock,  text: 'Response within 24 hours' },
  { Icon: Shield, text: 'Free initial consultation' },
  { Icon: Mail,   text: 'No commitment required' },
]

// Focus ring is a box-shadow (not compositor-friendly), so it appears instantly
// rather than animating — per the project UI checklist (transitions on transform/
// opacity only).
const inputClass =
  'w-full px-4 py-3 rounded-xl border border-blue-100 text-blue-900 text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300'

export default function CTA() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await postContact(form)
      if (res.status === 429) {
        setError('Too many requests. Please wait a minute and try again.')
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-blue-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-blue-300 tracking-widest uppercase mb-4 block">
              Let's Work Together
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Build Something Great?
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Tell us about your project. We'll get back to you within 24 hours with a clear, no-obligation plan.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-blue-200 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:contact@manaracode.com"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              contact@manaracode.com
            </a>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl p-8 shadow-2xl shadow-blue-950/40"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-heading text-xl font-bold text-blue-900 mb-2">Message Sent!</h3>
                <p className="text-blue-600 text-sm">
                  Thanks, {form.name || 'there'}! We'll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    dir="ltr"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5" htmlFor="message">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="We need to build a platform that..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-opacity duration-200 cursor-pointer text-sm"
                >
                  {submitting ? 'Sending…' : 'Send Message →'}
                </button>

                <p className="text-xs text-blue-400 text-center">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
