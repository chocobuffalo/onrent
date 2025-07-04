'use client'
import Image from "next/image";

export default function DashboardAvatar(){
    return(
        <div className="db-content db-author pad-30">
                  <h6 className="db-title">Profile</h6>
                  <div className="author">
                    <div className="avatar">
                      <Image
                        loading="lazy"
                        id="tfre_avatar_thumbnail"
                        alt="admin"
                        title="admin"
                        src="/assets/images/dashboard/avatar.png"
                        width={52}
                        height={52}
                      />
                    </div>
                    <div className="content">
                      <div className="name">Account</div>
                      <div className="author-email">themesflat@gmail...</div>
                    </div>
                  </div>
                </div>
    )
}