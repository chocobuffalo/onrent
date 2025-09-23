'use client'
import useDashboardAvatar from "@/hooks/backend/useDashboardAvatar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardAvatar(){
  const { avatarUrl, name, email } = useDashboardAvatar();
  return(
  <div className="db-content db-author pad-30">
    <h6 className="db-title">Perfil</h6>
    <div className="author">
      <div className="avatar">
        <Link href="/dashboard/profile" title={name} className="avatar-link">
        </Link>
      </div>
      <Link href="/dashboard/profile" className="content" title="Ir al perfil">
        <div className="name">{name}</div>
        <div className="author-email">{email}</div>
      </Link>
    </div>
  </div>
  )
}