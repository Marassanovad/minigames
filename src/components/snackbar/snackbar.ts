import './snackbar.scss';

export function createSnackbar(
  message: string,
  container: HTMLElement = document.body,
): void {
  const snackbar = document.createElement('div');

  snackbar.className = 'snackbar';
  snackbar.textContent = message;

  container.append(snackbar);

  setTimeout(() => {
    snackbar.remove();
  }, 3000);
}
