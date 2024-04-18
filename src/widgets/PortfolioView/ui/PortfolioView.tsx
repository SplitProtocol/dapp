import { PortfolioCard } from "@/entities/Portfolio"
import { Container } from "@/shared/ui"

export const PortfolioView = () => {
  return (
    <section className="flex flex-col w-full items-center">
      <Container>
        <PortfolioCard />
      </Container>
    </section>
  )
}