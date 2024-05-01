import { Helmet } from 'react-helmet-async';
import { Container } from "@/shared/ui";
import { TradeView } from "@/widgets/TradeView";

export const TradePage = () => {
  return (
    <>
      <Helmet>
        <title>Trade – Split</title>
      </Helmet>
      <Container className="items-center">
        <TradeView />
      </Container>
    </>
  );
};
