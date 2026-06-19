'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { FadeInUp } from '@/lib/animations'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
      </Container>

      <Section variant="default" spacing="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FadeInUp delay={0.1}>
              <div className="text-center mb-12 space-y-4">
                <p className="text-label text-accent tracking-widest">Get in Touch</p>
                <h1 className="text-display-1">Contact Us</h1>
                <p className="text-body text-foreground-muted max-w-lg mx-auto">
                  We would love to hear from you. Whether you have a question about our collections, a special request, or just want to say hello.
                </p>
              </div>
            </FadeInUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <FadeInUp delay={0.2}>
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="text-5xl text-accent">✓</div>
                    <h2 className="font-serif text-2xl text-foreground tracking-wide">Thank You</h2>
                    <p className="text-muted">
                      Your message has been received. We will get back to you shortly.
                    </p>
                    <Button variant="secondary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }) }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <Button variant="primary" size="lg" fullWidth className="font-medium" type="submit">
                      Send Message
                    </Button>
                  </form>
                )}
              </FadeInUp>

              {/* Contact Info */}
              <FadeInUp delay={0.3}>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                      Visit Our Atelier
                    </h3>
                    <div className="space-y-3 text-sm text-muted leading-relaxed">
                      <p>123 Avenue Habib Bourguiba</p>
                      <p>Tunis, 1000</p>
                      <p>Tunisia</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p>
                        <span className="text-foreground">Email:</span>{' '}
                        <a href="mailto:hello@maisontunis.tn" className="text-accent hover:text-accent-light transition-colors">
                          hello@maisontunis.tn
                        </a>
                      </p>
                      <p>
                        <span className="text-foreground">Phone:</span>{' '}
                        <a href="tel:+21698123456" className="text-accent hover:text-accent-light transition-colors">
                          +216 98 123 456
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                      Hours
                    </h3>
                    <div className="space-y-2 text-sm text-muted">
                      <p>Monday — Friday: 10:00 – 19:00</p>
                      <p>Saturday: 10:00 – 17:00</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
