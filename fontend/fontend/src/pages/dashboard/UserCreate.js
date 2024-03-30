import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function UserCreate() {
  
  const { themeStretch } = useSettings();

  const [tableData, setTableData] = useState([]);

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  useEffect(() => {
    axios.get('/users/')
      .then((response) =>  {
        const modifiedData = response.data.data.map(user => {
          const roleName = user.role.name;
          const { role, ...rest } = user;
          return { ...rest, role: roleName };
        });
        setTableData(modifiedData);
        console.log("modifiedData", modifiedData)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  console.log("table", tableData);

  const currentUser = tableData.find((user) => (user.displayName) === name);

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : (name) },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
