import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { portableTextToHtml } from './portableText';

function createLinkBlock(href: string, text: string) {
  return [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text,
          marks: ['link123']
        }
      ],
      markDefs: [
        {
          _key: 'link123',
          _type: 'link',
          href
        }
      ]
    }
  ];
}

test('portableTextToHtml - Safe URLs are rendered as <a> tags', () => {
  const safeUrls = [
    'https://example.com',
    'http://example.com',
    'mailto:test@example.com',
    'tel:+1234567890',
    '/recipe/pasta',
    './local/path'
  ];

  for (const url of safeUrls) {
    const blocks = createLinkBlock(url, 'Click here');
    const html = portableTextToHtml(blocks);
    assert.ok(html.includes(`<a href="${url}"`), `URL ${url} should generate an <a> tag`);
  }
});

test('portableTextToHtml - Unsafe URLs are rendered as plain text', () => {
  const unsafeUrls = [
    'javascript:alert("xss")',
    'javascript://%250Aalert("xss")',
    'data:text/html,<script>alert("xss")</script>',
    'vbscript:msgbox("xss")',
    '  javascript:alert(1)',
    'Javascript:alert(1)'
  ];

  for (const url of unsafeUrls) {
    const blocks = createLinkBlock(url, 'Click here');
    const html = portableTextToHtml(blocks);
    assert.ok(!html.includes('<a'), `Unsafe URL ${url} should NOT generate an <a> tag`);
    assert.ok(html.includes('Click here'), `Unsafe URL ${url} should still render the text content`);
  }
});
