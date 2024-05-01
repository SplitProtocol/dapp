import { Helmet } from 'react-helmet-async';
import { PortfolioView } from "@/widgets/PortfolioView/ui/PortfolioView";

export const PortfolioPage = () => (
  <>
    <Helmet>
      <title>Portfolio – Split</title>
    </Helmet>
    <PortfolioView />
  </>
);
