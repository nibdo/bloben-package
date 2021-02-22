import React, { useContext } from 'react';
import './SettingsAccount.scss';
import MobileTitle from '../../components/title/Title';
import SettingsItem from '../../components/settingsItem/SettingsItem';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { Route } from 'react-router-dom';
import DeleteAccount
    from './subScreens/deleteAccount/DeleteAccount';
import Modal from '../../components/modal/Modal';
import { Context } from '../../context/store';
import HeaderModal from '../../components/headerModal/HeaderModal';
import SetEmail from './subScreens/setEmail/SetEmail';
import SettingsSubtitle from '../../components/settings/settingsSubtitle/SettingsSubtitle';
import SetEmailPublicKey from './subScreens/setEmailPublicKey/SetEmailPublicKey';
import SetPublicName from './subScreens/setPublicName/SetPublicName';

const SettingsAccountRouter = (props: any) =>
  (
    <div>
        <Route path={'/settings/account/email'}>
            <Modal >
                <SetEmail />
            </Modal>
        </Route>
        <Route path={'/settings/account/email-key'}>
            <Modal>
                <SetEmailPublicKey />
            </Modal>
        </Route>
        <Route path={'/settings/account/public-name'}>
            <Modal>
                <SetPublicName />
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
          <SettingsSubtitle text={'Email'} />
          <SettingsItem
              icon={
                  <EvaIcons.Email
                      className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                  />
              }
              title={'Set email'}
              link={'account/email'}
          />
          <SettingsItem
              icon={<EvaIcons.Globe className={'svg-icon settings__icon-hidden'} />}
              title={'Public PGP key'}
              description={'Encrypt email notifications'}
              link={'account/email-key'}
          />
          <SettingsItem
              icon={<EvaIcons.Globe className={'svg-icon settings__icon-hidden'} />}
              title={'Public name'}
              description={'Use public name in emails'}
              link={'account/public-name'}
          />
          <SettingsSubtitle text={'Other'} />
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
