import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_HOME, PATH_PRODUCTOWNER } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------
const MENU_OPTIONS = (role) => [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: role === 'Customer' ? PATH_HOME.account : PATH_DASHBOARD.user.account,
  },
  {
    label: 'Bid',
    linkTo: role === 'Customer' ? PATH_HOME.bid : PATH_PRODUCTOWNER.eCommerce.bid,
  },
  {
    label: 'Order',
    linkTo: role === 'Customer' ? PATH_HOME.order : PATH_PRODUCTOWNER.eCommerce.order,
  }
];
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  console.log("role", user.role.name)

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();

      if (isMountedRef.current) {
        // Điều hướng người dùng dựa trên role sau khi đăng xuất
        if (['Admin', 'Staff', 'Manager'].includes(user.role.name)) {
          // Điều hướng đến trang đăng nhập cho Admin, Staff, và Manager
          navigate(PATH_HOME.loginBuyer, { replace: true });
        } else {
          // Điều hướng tất cả các role khác đến trang chủ
          navigate(PATH_HOME.root, { replace: true });
        }
      }

      handleClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };




  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS(user?.role.name).map((option) => (
            <MenuItem key={option.linkTo} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
