function isSafeUrl(url: string): boolean {
  if (!url) return false;

  const trimmedUrl = url.trim();

  // Deny protocol-relative URLs (starts with //)
  if (trimmedUrl.startsWith('//')) {
    return false;
  }

  // Allow relative URLs starting with / or ./
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./')) {
    return true;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    return allowedProtocols.includes(parsedUrl.protocol);
  } catch (e) {
    // If new URL() throws, it's an invalid URL (e.g. malformed or missing base)
    return false;
  }
}

function escapeAttribute(value: string): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

export function portableTextToHtml(blocks: unknown[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  let html = '';
  let inList = false;
  let listType = ''; // 'bullet' or 'number'

  for (const block of blocks) {
    if (block._type !== 'block') {
      continue;
    }

    const isListItem = !!block.listItem;
    
    // Close previous list if we transitioned out
    if (inList && (!isListItem || block.listItem !== listType)) {
      html += listType === 'number' ? '</ol>' : '</ul>';
      inList = false;
    }

    // Open new list if we transitioned in
    if (isListItem && !inList) {
      listType = block.listItem;
      html += listType === 'number' ? '<ol class="roundup-ol">' : '<ul class="roundup-ul">';
      inList = true;
    }

    // Resolve children styles
    let blockContent = '';
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child._type === 'span') {
          let text = child.text;
          
          // Escape HTML entities to prevent XSS while allowing rich marks
          text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

          // Apply marks
          if (child.marks && Array.isArray(child.marks)) {
            for (const markKey of child.marks) {
              // Check if mark is an annotation defined in markDefs
              const markDef = block.markDefs?.find((def: Record<string, unknown>) => def._key === markKey);
              if (markDef && markDef._type === 'link') {
                if (isSafeUrl(markDef.href)) {
                  const safeHref = escapeAttribute(markDef.href.trim());
                  text = `<a href="${safeHref}" class="roundup-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
                }
              } else if (markKey === 'strong') {
                text = `<strong>${text}</strong>`;
              } else if (markKey === 'em') {
                text = `<em>${text}</em>`;
              } else if (markKey === 'underline') {
                text = `<u>${text}</u>`;
              }
            }
          }
          blockContent += text;
        }
      }
    }

    if (isListItem) {
      html += `<li>${blockContent}</li>`;
    } else {
      const style = block.style || 'normal';
      if (style === 'h2') {
        html += `<h2 class="roundup-h2">${blockContent}</h2>`;
      } else if (style === 'h3') {
        html += `<h3 class="roundup-h3">${blockContent}</h3>`;
      } else if (style === 'h4') {
        html += `<h4 class="roundup-h4">${blockContent}</h4>`;
      } else {
        html += `<p class="roundup-p">${blockContent}</p>`;
      }
    }
  }

  // Close any open lists at the end
  if (inList) {
    html += listType === 'number' ? '</ol>' : '</ul>';
  }

  return html;
}
