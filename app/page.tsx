'use client'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* Hero Section - Premium Storytelling */}
      <section className="relative min-h-screen bg-background flex items-center pt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Typography & Story */}
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-4">
                <p className="text-label text-accent tracking-widest">
                  Heritage & Craftsmanship
                </p>
                <h1 className="text-display-1 leading-tight text-balance">
                  Tunisian Elegance, Redefined
                </h1>
              </div>

              <p className="text-body max-w-lg text-foreground-muted leading-relaxed">
                Where ancient Tunisian craftsmanship meets contemporary design. Each piece from MAISON TUNIS is a testament to heritage, artistry, and the pursuit of timeless elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/shop">
                  <Button className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-dark text-accent-foreground font-serif text-base">
                    Discover Collections
                  </Button>
                </Link>
                <button className="w-full sm:w-auto px-8 py-3 border border-accent/40 text-foreground hover:border-accent transition-colors font-serif text-base">
                  Our Heritage
                </button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
              <Image
                src="/images/hero-collection.png"
                alt="MAISON TUNIS Featured Collection"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>

      {/* Brand Values - Asymmetrical Layout */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Value 1 */}
            <div className="space-y-4">
              <div className="text-4xl text-accent">◆</div>
              <h3 className="text-heading-3">Handcrafted Heritage</h3>
              <p className="text-body-sm text-foreground-muted leading-relaxed">
                Every piece is meticulously crafted by skilled artisans in Tunis, preserving centuries of tradition in modern silhouettes.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-4">
              <div className="text-4xl text-accent">◆</div>
              <h3 className="text-heading-3">Premium Materials</h3>
              <p className="text-body-sm text-foreground-muted leading-relaxed">
                We source the finest natural fabrics and materials, ensuring each garment feels as luxurious as it appears.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-4">
              <div className="text-4xl text-accent">◆</div>
              <h3 className="text-heading-3">Timeless Design</h3>
              <p className="text-body-sm text-foreground-muted leading-relaxed">
                Collections designed to transcend seasons and trends, creating pieces you'll treasure for years to come.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Collections - Grid Showcase */}
      <section className="py-20 md:py-32 bg-background-secondary">
        <Container>
          <div className="space-y-16">
            <div className="space-y-4 max-w-2xl">
              <p className="text-label text-accent">Curated Collections</p>
              <h2 className="text-display-2">Explore Our Latest Designs</h2>
              <p className="text-body text-foreground-muted">
                Discover handpicked pieces that embody the essence of MAISON TUNIS
              </p>
            </div>

            {/* Collection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Large Featured Collection */}
              <div className="md:row-span-2 space-y-4">
                <div className="aspect-square bg-background rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-background group-hover:from-accent/20 transition-all duration-500">
                    <div className="text-6xl text-accent/50">✦</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading-2">Summer Essence</h3>
                  <p className="text-body-sm text-foreground-muted">
                    Light, breathable silhouettes in earth tones and natural fibers
                  </p>
                  <Link href="/shop" className="inline-block pt-2">
                    <span className="text-accent hover:text-accent-light transition-colors text-sm font-serif tracking-wider">
                      View Collection →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Collection 2 */}
              <div className="space-y-4">
                <div className="aspect-square bg-background rounded-lg flex items-center justify-center group cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-background group-hover:from-accent/20 transition-all duration-500">
                    <div className="text-6xl text-accent/50">✦</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading-3">Heritage Weave</h3>
                  <p className="text-body-sm text-foreground-muted">
                    Traditional patterns reimagined for the modern wardrobe
                  </p>
                </div>
              </div>

              {/* Collection 3 */}
              <div className="space-y-4">
                <div className="aspect-square bg-background rounded-lg flex items-center justify-center group cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-background group-hover:from-accent/20 transition-all duration-500">
                    <div className="text-6xl text-accent/50">✦</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading-3">Evening Luxury</h3>
                  <p className="text-body-sm text-foreground-muted">
                    Sophisticated pieces for special occasions and gatherings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 md:py-32 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <div className="space-y-6 lg:order-2">
              <div className="space-y-4">
                <p className="text-label text-accent">Our Story</p>
                <h2 className="text-display-2">Rooted in Tradition, Reaching Forward</h2>
              </div>

              <div className="space-y-4 text-body text-foreground-muted leading-relaxed">
                <p>
                  MAISON TUNIS began with a single vision: to celebrate the artisanal traditions of Tunisia while creating pieces for the discerning, modern individual.
                </p>
                <p>
                  Every garment carries the spirit of North African craftsmanship—in the precise stitching, the quality of materials, and the thoughtful design that honors heritage without compromising on contemporary aesthetics.
                </p>
                <p>
                  We believe luxury is not about excess. It&apos;s about intention, quality, and the stories woven into each piece.
                </p>
              </div>

              <Link href="#" className="inline-block pt-4">
                <button className="text-accent hover:text-accent-light transition-colors text-sm font-serif tracking-wider">
                  Read Full Story →
                </button>
              </Link>
            </div>

            {/* Story Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] lg:order-1">
              <Image
                src="/images/brand-story.png"
                alt="MAISON TUNIS Artisan Craftsmanship"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-24 bg-background-secondary">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-display-2">Stay Connected</h2>
              <p className="text-body text-foreground-muted">
                Receive exclusive previews of new collections and invitations to private events
              </p>
            </div>

            <form className="flex gap-4 flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-background border border-accent/30 text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                required
              />
              <Button className="px-8 py-3 bg-accent hover:bg-accent-dark text-accent-foreground font-serif text-base">
                Subscribe
              </Button>
            </form>

            <p className="text-body-sm text-foreground-muted">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
