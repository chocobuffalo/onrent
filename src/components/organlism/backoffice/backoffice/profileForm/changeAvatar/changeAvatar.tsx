import useChangeAvatar from "@/hooks/backend/useChangeAvatar";
import Image from "next/image";
import  './changeAvatar.scss';

export default function ChangeAvatar(){

  const {avatar} = useChangeAvatar();
     return(
      <div className="tfcl_choose_avatar  profile-inner">
        <h2 className="mb-2">Cambiar imagen</h2>
                    <div className="avatar">
                      <div className="form-group">
                        <Image
                          loading="lazy"
                          decoding="async"
                          width={158}
                          height={138}
                          id="tfcl_avatar_thumbnail"
                          alt="avatar"
                          src={avatar || '/profile-placeholder.svg'}
                        />
                      </div>
                      <div className="choose-box">
                        <label>Cambiar imagen</label>
                        <div className="form-group relative pb-2 pt-2">
                          <input
                            type="file"
                            className="form-control ip-file"
                            accept="image/*"
                            
                          />
                          <label htmlFor="tfcl_avatar">
                            <button type="button">Elegir imagen</button>
                          </label>
                        </div>
                        <span className="notify-avatar">
                          PNG, JPG, SVG dimensiones (400 x 400) tamaño máximo de archivo 4 MB
                        </span>
                      </div>
                    </div>
                  </div>)
}