import React, { useContext } from 'react';
import './SettingsAccount.scss';
import MobileTitle from '../../components/title/Title';
import SettingsItem from '../../components/settingsItem/SettingsItem';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { Route } from 'react-router-dom';
import DeleteAccount
    from '../../components/authentication/deleteAccount/DeleteAccount';
import Modal from '../../components/modal/Modal';
import { Context } from '../../context/store';
import HeaderModal from '../../components/headerModal/HeaderModal';
import SetEmail from '../../components/authentication/setEmail/SetEmail';

const SettingsAccountRouter = (props: any) =>
  (
    <div>
        <Route path={'/settings/account/email'}>
            <Modal >
                <SetEmail />
            </Modal>
        </Route>
      <Route path={'/settings/account/delete'}>
        <Modal >
          <DeleteAccount />
        </Modal>
      </Route>
    </div>
  );

const SettingsAccountView = () => {
    const [store] = useContext(Context);
    const { isDark } = store;

    return (
    <div className={`column${isDark ? '-dark' : ''}`}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Account'} />
          {/*<SettingsItem*/}
          {/*    icon={*/}
          {/*        <EvaIcons.Email*/}
          {/*            className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}*/}
          {/*        />*/}
          {/*    }*/}
          {/*    title={'Email'}*/}
          {/*    link={'account/email'}*/}
          {/*/>*/}
        <SettingsItem
          icon={
            <EvaIcons.Trash
              className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
            />
          }
          title={'Delete account'}
          link={'account/delete'}
        />
      </div>
      <SettingsAccountRouter />
    </div>
  );
};

const SettingsAccount = () =>
  <SettingsAccountView />;

export default SettingsAccount;
