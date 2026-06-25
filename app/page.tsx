'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(212,173,106,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,173,106,0.03) 0%, transparent 50%)'
        }} />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Typography & Story */}
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px" style={{ backgroundColor: 'var(--accent)' }} />
                  <p className="text-overline" style={{ color: 'var(--accent)' }}>
                    Heritage &amp; Craftsmanship
                  </p>
                </div>
                <h1 className="text-display-1 leading-[1.05] text-balance" style={{ color: 'var(--fg)' }}>
                  Tunisian Elegance, Redefined
                </h1>
              </div>

              <p className="text-body-lg max-w-lg leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                Where ancient Tunisian craftsmanship meets contemporary design. Each piece from MAISON TUNIS is a testament to heritage, artistry, and the pursuit of timeless elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/collections">
                  <Button className="w-full sm:w-auto px-10 py-3.5 font-serif text-base tracking-wide">
                    Discover Collections
                  </Button>
                </Link>
                <Link href="/about">
                  <button
                    className="w-full sm:w-auto px-10 py-3.5 font-serif text-base transition-all duration-300 border hover:shadow-sm"
                    style={{ border: '1px solid var(--accent)', color: 'var(--fg)', backgroundColor: 'transparent' }}
                  >
                    Our Heritage
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
              <Image
                src="/images/hero-collection.png"
                alt="MAISON TUNIS Featured Collection"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle border frame */}
              <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: 'var(--border)' }} />
            </div>
          </div>
        </Container>
      </section>

      {/* Divider */}
      <div className="divider-luxury" />

      {/* Brand Values */}
      <section className="section-py-xl" style={{ backgroundColor: 'var(--bg)' }}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Value 1 */}
            <div className="space-y-5 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300" style={{ border: '1px solid var(--accent)' }}>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>&#9830;</span>
              </div>
              <h3 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Handcrafted Heritage</h3>
              <p className="text-body-sm leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                Every piece is meticulously crafted by skilled artisans in Tunis, preserving centuries of tradition in modern silhouettes.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-5 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300" style={{ border: '1px solid var(--accent)' }}>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>&#9830;</span>
              </div>
              <h3 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Premium Materials</h3>
              <p className="text-body-sm leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                We source the finest natural fabrics and materials, ensuring each garment feels as luxurious as it appears.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-5 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300" style={{ border: '1px solid var(--accent)' }}>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>&#9830;</span>
              </div>
              <h3 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Timeless Design</h3>
              <p className="text-body-sm leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                Collections designed to transcend seasons and trends, creating pieces you&apos;ll treasure for years to come.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Collections */}
      <section className="section-py-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Container>
          <div className="space-y-16">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px" style={{ backgroundColor: 'var(--accent)' }} />
                <p className="text-overline" style={{ color: 'var(--accent)' }}>Curated Collections</p>
              </div>
              <h2 className="text-display-2" style={{ color: 'var(--fg)' }}>Explore Our Latest Designs</h2>
              <p className="text-body" style={{ color: 'var(--fg-secondary)' }}>
                Discover handpicked pieces that embody the essence of MAISON TUNIS
              </p>
            </div>

            {/* Collection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Large Featured Collection */}
              <div className="md:row-span-2 space-y-4">
                <div className="aspect-square flex items-center justify-center overflow-hidden group cursor-pointer relative" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="w-full h-full flex items-center justify-center transition-all duration-700 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 group-hover:from-[var(--accent)]/10 group-hover:to-[var(--accent)]/15">
                    <div className="text-7xl opacity-30 transition-opacity duration-500 group-hover:opacity-50" style={{ color: 'var(--accent)' }}>&#10022;</div>
                  </div>
                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t border-r transition-colors duration-300" style={{ borderColor: 'var(--accent)', opacity: 0.3 }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l transition-colors duration-300" style={{ borderColor: 'var(--accent)', opacity: 0.3 }} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl" style={{ color: 'var(--fg)' }}>Summer Essence</h3>
                  <p className="text-body-sm" style={{ color: 'var(--fg-secondary)' }}>
                    Light, breathable silhouettes in earth tones and natural fibers
                  </p>
                  <Link href="/collections" className="inline-block pt-2">
                    <span className="hover:opacity-80 transition-opacity text-sm font-serif tracking-wider" style={{ color: 'var(--accent)' }}>
                      View Collection &rarr;
                    </span>
                  </Link>
                </div>
              </div>

              {/* Collection 2 */}
              <Link href="/collections" className="space-y-4 group block">
                <div className="aspect-square flex items-center justify-center group cursor-pointer relative overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="w-full h-full flex items-center justify-center transition-all duration-700 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 group-hover:from-[var(--accent)]/10 group-hover:to-[var(--accent)]/15">
                    <div className="text-6xl opacity-30 transition-opacity duration-500 group-hover:opacity-50" style={{ color: 'var(--accent)' }}>&#10022;</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Heritage Weave</h3>
                  <p className="text-body-sm" style={{ color: 'var(--fg-secondary)' }}>
                    Traditional patterns reimagined for the modern wardrobe
                  </p>
                </div>
              </Link>

              {/* Collection 3 */}
              <Link href="/collections" className="space-y-4 group block">
                <div className="aspect-square flex items-center justify-center group cursor-pointer relative overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="w-full h-full flex items-center justify-center transition-all duration-700 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 group-hover:from-[var(--accent)]/10 group-hover:to-[var(--accent)]/15">
                    <div className="text-6xl opacity-30 transition-opacity duration-500 group-hover:opacity-50" style={{ color: 'var(--accent)' }}>&#10022;</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Evening Luxury</h3>
                  <p className="text-body-sm" style={{ color: 'var(--fg-secondary)' }}>
                    Sophisticated pieces for special occasions and gatherings
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Story Section */}
      <section className="section-py-xl" style={{ backgroundColor: 'var(--bg)' }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <div className="space-y-6 lg:order-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px" style={{ backgroundColor: 'var(--accent)' }} />
                  <p className="text-overline" style={{ color: 'var(--accent)' }}>Our Story</p>
                </div>
                <h2 className="text-display-2" style={{ color: 'var(--fg)' }}>Rooted in Tradition, Reaching Forward</h2>
              </div>

              <div className="space-y-4 text-body leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                <p>
                  MAISON TUNIS began with a single vision: to celebrate the artisanal traditions of Tunisia while creating pieces for the discerning, modern individual.
                </p>
                <p>
                  Every garment carries the spirit of North African craftsmanship&mdash;in the precise stitching, the quality of materials, and the thoughtful design that honors heritage without compromising on contemporary aesthetics.
                </p>
                <p>
                  We believe luxury is not about excess. It&apos;s about intention, quality, and the stories woven into each piece.
                </p>
              </div>

              <Link href="/about" className="inline-block pt-4">
                <button className="hover:opacity-80 transition-opacity text-sm font-serif tracking-wider" style={{ color: 'var(--accent)' }}>
                  Read Full Story &rarr;
                </button>
              </Link>
            </div>

            {/* Story Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] lg:order-1">
              <Image
                src="/images/brand-story.png"
                alt="MAISON TUNIS Artisan Craftsmanship"
                fill
                className="object-cover"
              />
              {/* Subtle border frame */}
              <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: 'var(--border)' }} />
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="section-py-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-display-2" style={{ color: 'var(--fg)' }}>Stay Connected</h2>
              <p className="text-body" style={{ color: 'var(--fg-secondary)' }}>
                Receive exclusive previews of new collections and invitations to private events
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email) {
                  setSubscribed(true)
                  setEmail('')
                }
              }}
              className="flex gap-4 flex-col sm:flex-row max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3 font-sans text-sm transition-all duration-300 focus:outline-none bg-transparent"
                style={{
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--fg)',
                }}
                required
              />
              <Button className="px-8 py-3 font-serif text-base tracking-wide">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>

            <p className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
