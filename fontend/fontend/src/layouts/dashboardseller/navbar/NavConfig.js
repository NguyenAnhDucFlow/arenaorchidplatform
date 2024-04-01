// routes
import { PATH_DASHBOARD, PATH_PRODUCTOWNER } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'e-commerce', path: PATH_PRODUCTOWNER.general.ecommerce, icon: ICONS.ecommerce },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'e-commerce',
        path: PATH_PRODUCTOWNER.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'list', path: PATH_PRODUCTOWNER.eCommerce.list },
          { title: 'bid', path: PATH_PRODUCTOWNER.eCommerce.bid },
          { title: 'order', path: PATH_PRODUCTOWNER.eCommerce.order },
          { title: 'order details', path: PATH_PRODUCTOWNER.eCommerce.order },
        ],
      },
    ],
  },
];

export default navConfig;
