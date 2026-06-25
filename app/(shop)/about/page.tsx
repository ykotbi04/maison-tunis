import Image from 'next/image'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'About | MAISON TUNIS',
  description: 'Discover the story behind MAISON TUNIS — a celebration of Tunisian craftsmanship, heritage, and timeless elegance.',
}

export default function AboutPage() {
  return (
    <>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
          ]}
        />
      </Container>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-label text-accent tracking-widest">Our Story</p>
            <h1 className="text-display-1">Rooted in Tradition,<br />Reaching Forward</h1>
            <p className="text-body text-foreground-muted leading-relaxed">
              MAISON TUNIS began with a single vision: to celebrate the artisanal traditions of Tunisia while creating pieces for the discerning, modern individual.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-background rounded-lg flex items-center justify-center">
                <div className="text-8xl text-accent/30">◆</div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-display-2">Heritage & Craftsmanship</h2>
              <div className="space-y-4 text-body text-foreground-muted leading-relaxed">
                <p>
                  Every garment carries the spirit of North African craftsmanship — in the precise stitching, the quality of materials, and the thoughtful design that honors heritage without compromising on contemporary aesthetics.
                </p>
                <p>
                  We believe luxury is not about excess. It is about intention, quality, and the stories woven into each piece.
                </p>
                <p>
                  From the ancient medinas of Tunis to ateliers that have perfected their art across generations, our collections bridge the gap between tradition and modernity.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <p className="text-label text-accent tracking-widest">Our Values</p>
            <h2 className="text-display-2">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="text-5xl text-accent">◆</div>
              <h3 className="text-heading-3">Handcrafted Heritage</h3>
              <p className="text-body-sm text-foreground-muted">
                Every piece is meticulously crafted by skilled artisans in Tunis, preserving centuries of tradition in modern silhouettes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl text-accent">◆</div>
              <h3 className="text-heading-3">Premium Materials</h3>
              <p className="text-body-sm text-foreground-muted">
                We source the finest natural fabrics and materials, ensuring each garment feels as luxurious as it appears.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl text-accent">◆</div>
              <h3 className="text-heading-3">Timeless Design</h3>
              <p className="text-body-sm text-foreground-muted">
                Collections designed to transcend seasons and trends, creating pieces you will treasure for years to come.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <Container>
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-display-2">Experience the Collection</h2>
            <p className="text-body text-foreground-muted">
              Explore our latest designs and discover the artistry of MAISON TUNIS
            </p>
            <a
              href="/collections"
              className="inline-block px-8 py-3 bg-accent hover:bg-accent-dark text-accent-foreground font-serif text-base transition-colors"
            >
              Discover Collections
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}
