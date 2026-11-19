import { siteContent } from '../content'
import { MapleMark } from './MapleMark'
export function Footer() { return <footer className="site-footer"><span className="end-credit">{siteContent.footerCredit}</span><a className="brand" href="#top"><MapleMark/>{siteContent.brand.slice(0, 1)}<span>{siteContent.brand.slice(1)}</span></a><p>{siteContent.footer}</p><a href="#top" aria-label={siteContent.labels.backTop}>{siteContent.labels.backTop} ↑</a><small>{siteContent.labels.footerCopyright} {new Date().getFullYear()} {siteContent.hero.name}</small></footer> }
