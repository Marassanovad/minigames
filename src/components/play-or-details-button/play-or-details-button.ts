import './play-or-details-button.scss';

export type PlayOrDetailsButtonVariant = 'play' | 'details';

const buttonLabels: Record<PlayOrDetailsButtonVariant, string> = {
  play: 'Play Now',
  details: 'Details',
};

interface PlayOrDetailsButtonOptions {
  variant: PlayOrDetailsButtonVariant;
  title?: string;
  onClick: () => void;
}

export function createPlayOrDetailsButton({
  variant,
  onClick,
  title,
}: PlayOrDetailsButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = `play-or-details-button play-or-details-button--${variant}`;
  button.textContent = title ?? buttonLabels[variant];

  button.addEventListener('click', onClick);

  return button;
}
