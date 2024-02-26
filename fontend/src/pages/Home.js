// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';

import MainFooter from '../layouts/main/MainFooter';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from '../sections/home';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="OrchidArena">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          {/* <HomeMinimal /> */}

          {/* <HomeHugePackElements /> */}

          {/* <HomeDarkMode /> */}

          <HomeColorPresets />

          {/* <HomeCleanInterfaces /> */}

          {/* <HomePricingPlans /> */}

          {/* <HomeLookingFor /> */}

          {/* <HomeAdvertisement /> */}
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
