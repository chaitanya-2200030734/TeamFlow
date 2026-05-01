const palette = ['#C0622F', '#4A7C6F', '#D4A847', '#B84040', '#8C8278'];

const initials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'TF';

const colorFromName = (name = '') => {
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
};

export const Avatar = ({ user, size = 'md', title }) => {
  const name = user?.name || title || 'TeamFlow';
  if (user?.avatar) {
    return <img className={`avatar avatar-${size}`} src={user.avatar} alt={name} title={name} />;
  }

  return (
    <span className={`avatar avatar-${size}`} style={{ background: colorFromName(name) }} title={name}>
      {initials(name)}
    </span>
  );
};
