// routes
import { PATH_AUTH, PATH_HOME, PATH_PAGE } from '../../routes/paths';
// components
import { PATH_AFTER_LOGIN } from '../../config';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Shop',
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: '/shop',
  },
  {
    title: 'Auction',
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.comingSoon,
  },
  {
    title: 'Start Selling',
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: PATH_HOME.loginSeller,
  },

  {
    title: 'More',
    path: '/pages',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Order',
        items: [
          { title: 'About us', path: PATH_PAGE.about },
          { title: 'Contact us', path: PATH_PAGE.contact },
          { title: 'FAQs', path: PATH_PAGE.faqs },
        ],
      },
    ],
  }

];

export default menuConfig;
