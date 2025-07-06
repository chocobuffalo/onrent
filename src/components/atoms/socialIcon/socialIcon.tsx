import { RouteItem } from '@/types/menu'
import React from 'react'

export default  function SocialIcon({socialLink}:{socialLink:RouteItem}) {
    const target = socialLink.target ? "_blank" : "_self"
    const rel = socialLink.target ? "noreferrer" : ""
    return (
        <div className='w-8 h-8'>
            <a href={socialLink.slug} target={target} rel={rel}>
            {
                socialLink.icon && <socialLink.icon className="w-9 h-9 text-primary transition-all duration-300 hover:text-secondary" />
            }
            </a>
        </div>
  )
}

