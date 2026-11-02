import './user.scss';
import { createTextInputField } from '../../../../components/auth-modals/text-input-field/text-input-field.ts';
import { auth } from '../../../../firebase.ts';
import profile from '../../../../assets/images/profile.jpg';

export function createUser(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'user';

  const title = document.createElement('h1');
  title.className = 'user__title';
  title.textContent = 'Profile';

  const avatar = document.createElement('img');
  avatar.className = 'user__avatar';
  avatar.src = auth.currentUser?.photoURL || profile;
  avatar.alt = 'avatar';

  const fields = document.createElement('div');
  fields.className = 'user__fields';

  const email = createTextInputField({
    label: 'Email',
    type: 'email',
    icon: 'email',
    value: auth.currentUser?.email || '',
    readonly: true,
  });

  const fullName = createTextInputField({
    label: 'Full Name',
    type: 'text',
    icon: 'text',
    value: auth.currentUser?.displayName || '',
    readonly: true,
  });

  fields.append(email, fullName);

  section.append(title, avatar, fields);

  return section;
}
