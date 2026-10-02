import './play-or-details-button.scss';

export type PlayOrDetailsButtonVariant = 'play' | 'details' | 'purchase';

const buttonLabels: Record<PlayOrDetailsButtonVariant, string> = {
  play: 'Play Now',
  details: 'Details',
  purchase: 'Buy',
};

interface PlayOrDetailsButtonOptions {
  variant: PlayOrDetailsButtonVariant;
  title?: string;
  price?: string;
  onClick: () => void;
}

export function createPlayOrDetailsButton({
  variant,
  onClick,
  title,
  price,
}: PlayOrDetailsButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = `play-or-details-button play-or-details-button--${variant}`;

  button.textContent =
    variant === 'purchase' && price
      ? `Buy for ${price}`
      : (title ?? buttonLabels[variant]);

  button.addEventListener('click', onClick);

  return button;
}
