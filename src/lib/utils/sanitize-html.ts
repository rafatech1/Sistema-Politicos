import sanitizeHtml from 'sanitize-html';

// Usado para renderizar conteúdo rich text (Post/Proposta/ProjetoDeLei e os
// textos de site_settings) via dangerouslySetInnerHTML. Mesmo o conteúdo só
// vindo de admins autenticados nesta fase (sem editor Tiptap ainda), sanitiza
// por padrão de segurança — este é o mesmo caminho que o editor rich text vai
// usar quando for implementado.
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
    },
  });
}
