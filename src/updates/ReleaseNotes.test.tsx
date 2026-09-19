import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ReleaseNotes from './ReleaseNotes'

const render = (body: string) => renderToStaticMarkup(<ReleaseNotes body={body} />)

describe('ReleaseNotes', () => {
  it('renders headings, lists, emphasis, code and secure links', () => {
    const html = render('## Improvements\n- **Faster** `Qwen` startup\n- [Details](https://example.com/notes)')
    expect(html).toContain('<h4>Improvements</h4>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<strong>Faster</strong>')
    expect(html).toContain('<code>Qwen</code>')
    expect(html).toContain('href="https://example.com/notes"')
  })

  it('escapes source HTML and angle-bracket placeholders, and rejects unsafe links', () => {
    const html = render('<script>alert(1)</script>\n\nUse <model> now. [Bad](javascript:alert(1)) ![track](https://example.com/pixel)')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('href="javascript:')
    expect(html).toContain('&lt;model&gt;')
    expect(html).toContain('&lt;script&gt;')
  })

  it('keeps English visible and puts Chinese in native details without losing its content', () => {
    const html = render('## English\n### Added\n- Better capture.\n\n## 中文\n### 新增\n- 更好的录音。')
    expect(html).toContain('Better capture.')
    expect(html).toMatch(/<details[^>]*>[\s\S]*<summary>中文原文<\/summary>[\s\S]*更好的录音。/)
    expect(html).not.toContain('<h4>English</h4>')
  })

  it('recognizes the alternate Chinese heading used by the model release notes', () => {
    const html = render("## What's new\n- Two local models.\n\n## 更新内容\n- 两种本地模型。")
    expect(html).toMatch(/<details[^>]*>[\s\S]*两种本地模型。/)
    expect(html.indexOf('Two local models.')).toBeLessThan(html.indexOf('<details'))
  })

  it('removes repeated download boilerplate sections but keeps product release content', () => {
    const html = render('## English\n- Added **Download progress** in Settings.\n\n## Downloads\nDownload the installer for your platform below.\n\n## 中文\n- 新增下载进度。\n\n## 下载\n请下载对应平台的安装包。')
    expect(html).toContain('Download progress')
    expect(html).not.toContain('installer for your platform')
    expect(html).not.toContain('请下载对应平台')
    expect(html).toContain('新增下载进度')
  })
})
