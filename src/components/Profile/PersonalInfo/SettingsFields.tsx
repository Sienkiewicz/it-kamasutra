import React, { ChangeEvent, FC } from 'react'
import { useFormik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import s from './PersonalInfo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { actions, updateUserSettings } from '../../../redux/profile-reducer'
import { useState, useEffect } from 'react'
import StandardField from '../../common/FormsControl/StandardField'
import * as Yup from 'yup'
import { AppStateType } from '../../../redux/redux-store'
import { ChangedSettingsType } from '../../common/Types'

const SettingsFields: FC = () => {
  const errorMessages = useSelector(
    (state: AppStateType) => state.profilePage.errorMessages
  )
  const contacts = useSelector(
    (state: AppStateType) =>
      state.profilePage.profile && state.profilePage.profile.contacts
  )
  const profile = useSelector(
    (state: AppStateType) => state.profilePage.profile
  )
  const isEditMode = useSelector(
    (state: AppStateType) => state.profilePage.isEditMode
  )
  const dispatch = useDispatch()

  // LOCAL STATE
  const [error, setError] = useState<string[]>([])
  const [doesShowErrorButtons, setDoesShowErrorButtons] = useState(false)

  useEffect((): void => {
    setError(errorMessages)
  }, [errorMessages])
  useEffect((): void => {
    showErrorButton(error)
  }, [error])

  const showErrorButton = (error: string[]): void => {
    error.length > 0 && setDoesShowErrorButtons(true)
  }

  const initialValues: ChangedSettingsType = {
    aboutMe: profile && profile.aboutMe ? profile.aboutMe : '',
    lookingForAJob: false,
    lookingForAJobDescription:
      profile && profile.lookingForAJobDescription
        ? profile.lookingForAJobDescription
        : '',
    fullName: profile && profile.fullName ? profile.fullName : '',
    contacts: {
      github: contacts && contacts.github ? contacts.github : '',
      vk: contacts && contacts.vk ? contacts.vk : '',
      facebook: contacts && contacts.facebook ? contacts.facebook : '',
      instagram: contacts && contacts.instagram ? contacts.instagram : '',
      twitter: contacts && contacts.twitter ? contacts.twitter : '',
      website: contacts && contacts.website ? contacts.website : '',
      youtube: contacts && contacts.youtube ? contacts.youtube : '',
      mainLink: contacts && contacts.mainLink ? contacts.mainLink : '',
    },
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      aboutMe: Yup.string()
        .max(300, 'Must be 300 characters or less')
        .required('Required'),
      lookingForAJobDescription: Yup.string()
        .max(300, 'Must be 300 characters or less')
        .required('Required'),
      fullName: Yup.string().required('Required'),
      contacts: Yup.object().shape({
        github: Yup.string().url('Invalid url format'),
        vk: Yup.string().url('Invalid url format'),
        facebook: Yup.string().url('Invalid url format'),
        instagram: Yup.string().url('Invalid url format'),
        twitter: Yup.string().url('Invalid url format'),
        website: Yup.string().url('Invalid url format'),
        youtube: Yup.string().url('Invalid url format'),
        mainLink: Yup.string().url('Invalid url format'),
      }),
    }),
    onSubmit: (values: ChangedSettingsType) => {
      dispatch(updateUserSettings(values))
    },
  })

  // HANDLERS
  const handlerCloseTab = (): void => {
    dispatch(actions.setErrorMessages([]))
    dispatch(actions.toggleEditMode(!isEditMode))
  }
  const handlerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    formik.handleChange(e)
    setDoesShowErrorButtons(false)
  }

  return (
    <form className={s.overlaySettingsField} onSubmit={formik.handleSubmit}>
      {error.length > 0 && <div>ERROR</div>}
      <FontAwesomeIcon
        className={s.closeTabContainer}
        icon={faTimes}
        onClick={handlerCloseTab}
      />
      <div className={s.overlayContent}>
        <StandardField
          nameOfField='fullName'
          nameOfError='fullName'
          textOfLabelField='Full name'
          typeOfField='text'
          handleChange={handlerChange}
          valueOfField={formik.values.fullName}
          error={error}
          formik={formik}
        />
        <StandardField
          nameOfField='lookingForAJob'
          nameOfError='lookingForAJob'
          textOfLabelField='Are you looking for a job?'
          typeOfField='checkbox'
          handleChange={handlerChange}
          error={error}
          formik={formik}
        />
        <StandardField
          nameOfField='lookingForAJobDescription'
          nameOfError='lookingForAJobDescription'
          textOfLabelField='My professional skills'
          typeOfField='input'
          handleChange={handlerChange}
          valueOfField={formik.values.lookingForAJobDescription}
          error={error}
          formik={formik}
        />
        <StandardField
          nameOfField='aboutMe'
          nameOfError='aboutMe'
          textOfLabelField='About Me'
          typeOfField='input'
          handleChange={handlerChange}
          valueOfField={formik.values.aboutMe}
          error={error}
          formik={formik}
        />
        {contacts &&
          Object.keys(contacts).map((key) => {
            return (
              <StandardField
                key={key}
                nameOfField={'contacts.' + key}
                nameOfError={'Contacts->' + key}
                textOfLabelField={key}
                typeOfField='input'
                handleChange={handlerChange}
                valueOfField={formik.values.contacts[key]}
                error={error}
                formik={formik}
              />
            )
          })}
        {!doesShowErrorButtons && <button type='submit'>Submit</button>}
        {doesShowErrorButtons && (
          <button style={{ color: 'white', background: 'red' }} type='submit'>
            ERROR
          </button>
        )}
      </div>
    </form>
  )
}

export default SettingsFields
