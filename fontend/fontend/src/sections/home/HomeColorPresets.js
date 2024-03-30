import { capitalCase } from 'change-case';
import { m } from 'framer-motion';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Radio,
  Grid,
  Tooltip,
  Container,
  Typography,
  RadioGroup,
  CardActionArea,
  FormControlLabel,
} from '@mui/material';
import { ContactForm } from '../contact';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(15, 0),
}));

const RootStyle1 = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  const { themeColorPresets, onChangeColor, colorOption } = useSettings();

  return (
    <RootStyle>
      <Container component={MotionViewport} sx={{ position: 'relative', textAlign: 'center' }}>
        <RadioGroup name="themeColorPresets" value={themeColorPresets} onChange={onChangeColor} sx={{ my: 1 }}>
          <Stack
            direction={{ xs: 'row', lg: 'column' }}
            justifyContent="center"
            spacing={1}
            sx={{
              position: { lg: 'absolute' },
              right: { lg: 0 },

              paddingTop: 20,
            }}
          >
            {colorOption.map((color) => {
              const colorName = color.name;
              const colorValue = color.value;
              const isSelected = themeColorPresets === colorName;

              return (
                <Tooltip key={colorName} title={capitalCase(colorName)} placement="right">
                  <CardActionArea sx={{ color: colorValue, borderRadius: '50%', width: 32, height: 32 }}>
                    <Box
                      sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        ...(isSelected && {
                          borderStyle: 'solid',
                          borderWidth: 4,
                          borderColor: alpha(colorValue, 0.24),
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: colorValue,
                          ...(isSelected && {
                            width: 14,
                            height: 14,
                            transition: (theme) =>
                              theme.transitions.create('all', {
                                easing: theme.transitions.easing.easeInOut,
                                duration: theme.transitions.duration.shorter,
                              }),
                          }),
                        }}
                      />
                      <FormControlLabel
                        label=""
                        value={colorName}
                        control={<Radio sx={{ display: 'none' }} />}
                        sx={{
                          top: 0,
                          left: 0,
                          margin: 0,
                          width: 1,
                          height: 1,
                          position: 'absolute',
                        }}
                      />
                    </Box>
                  </CardActionArea>
                </Tooltip>
              );
            })}
          </Stack>
        </RadioGroup>

        <Grid item xs={12} md={6}>
          <ContactForm />
        </Grid>
      </Container>
    </RootStyle>
  );
}
