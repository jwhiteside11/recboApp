import React, { useState, useMemo } from 'react';
import './SettingsPage.scss';
import { User } from '../../types';
import { userJDW } from '../../globals';
import { useHistory } from 'react-router';
import SettingsIcon from '../svgFCs/SettingsIcon';
import BubbleOptions from '../BubbleOptions/BubbleOptions';
import InputBar from '../InputBar/InputBar';
import CheckIcon from '../svgFCs/CheckIcon';
import { useAppDispatch } from '../../redux/hooks';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';

type SettingsPageProps = {
  user: User
}

const SettingsPage = ({user}: SettingsPageProps) => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  // Input bars
  const [primaryEmailInput, setPrimaryEmailInput] = useState<string>(user.email)
  const [secondaryEmailInput, setSecondaryEmailInput] = useState<string>('')
  const [newPasswordInput, setNewPasswordInput] = useState<string>('')
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('')

  return (
    <div className="SettingsPage">
      <div className="settings-upper">
        <div className="image-contain">
          <img />
        </div>
        <h2>{user.displayName}</h2>
        <h3>{user.occupation}</h3>
      </div>

      <div className="cuisine">
        <h2>Cuisine Settings</h2>
        {/* <BubbleOptions title="Flavor Preferences" options={useMemo(() => [...user.flavorPreferences].map(pref => pref.name), [user])} /> */}
        <BubbleOptions title="Favorite Foods" options={useMemo(() => [...user.favoriteFoods].map(fav => fav.name), [user])} />
        <BubbleOptions title="Allergies" options={useMemo(() => [...user.allergies].map(allerg => allerg.name), [user])} />
      </div>

      <div className="personal">
        <h2>Personal Settings</h2>
        <h3>Email Address</h3>
        <div className="input-sect email">
          <h4>Primary:</h4>
          <InputBar data={primaryEmailInput} setter={setPrimaryEmailInput} placeholder={user.email} />
          <h4>Secondary:</h4>
          <InputBar data={secondaryEmailInput} setter={setSecondaryEmailInput} placeholder={''} />
        </div>
        <h3>Change Password</h3>
        <div className="input-sect pw">
          <h4>New password:</h4>
          <InputBar data={newPasswordInput} setter={setNewPasswordInput} placeholder={''} type='password' />
          <h4>Re-enter password:</h4>
          <InputBar data={confirmPasswordInput} setter={setConfirmPasswordInput} placeholder={''} type='password' />
        </div>
        <div className="private">
          <h3>Private Account</h3>
          <CheckIcon fill="#3C3C3C" size={18} /> 
        </div>
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(SettingsPage);
