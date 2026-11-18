import './globals.css';

export const metadata = {
  title: 'Gestão de Estoque',
  description: 'Controle de estoque de produtos do supermercado',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}