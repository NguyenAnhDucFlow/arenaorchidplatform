import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@mui/material';
import { PATH_HOME } from '../../routes/paths';
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import { MotionContainer, varFade } from '../../components/animate';

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
    perspective: '1000px', // Thêm perspective để tạo hiệu ứng 3D
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}));

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  transformStyle: 'preserve-3d', 
  transform: 'rotateY(20deg) rotateX(-10deg)', 
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh',
  },
}));

export default function HomeHero() {
  return (
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle
          alt="overlay"
          src="https://mutantorchid.s3.ap-southeast-1.amazonaws.com/8619272.png"
          variants={varFade().in}
        />
        <HeroImgStyle
          alt="hero"
          src="https://mutantorchid.s3.ap-southeast-1.amazonaws.com/man-about-hit-with-gavel-removebg-preview.png"
          variants={varFade().inUp}
          whileHover={{ scale: 1.05 }}
        />

        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight} whileHover={{ y: [-5, 5, -5, 0] }}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Discover <br />
                Rare Orchids at<br />
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  &nbsp;OrchidArena
                </Typography>
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight} whileHover={{ y: [-5, 5, -5, 0] }}>
              <Typography sx={{ color: 'common.white' }}>
                Your ultimate platform for buying and auctioning unique orchid variations. Dive into a world where rarity and beauty meet.
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight} whileHover={{ y: [-5, 5, -5, 0] }}>
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to={PATH_HOME.shop}
                startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                whileHover={{ scale: 1.1 }}
              >
                Shop now
              </Button>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
