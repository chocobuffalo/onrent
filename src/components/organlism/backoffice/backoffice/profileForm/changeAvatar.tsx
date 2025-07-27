export default function ChangeAvatar(){
     return(<div className="tfcl_choose_avatar">
      <h3>Avatar</h3>
                    <div className="avatar">
                      <div className="form-group">
                        <img
                          loading="lazy"
                          decoding="async"
                          width={158}
                          height={138}
                          id="tfcl_avatar_thumbnail"
                          alt="avatar"
                         
                        />
                      </div>
                      <div className="choose-box">
                        <label>Upload a new Avatar</label>
                        <div className="form-group relative pb-2 pt-2">
                          <input
                            type="file"
                            className="form-control ip-file"
                            accept="image/*"
                            
                          />
                          <label htmlFor="tfcl_avatar">
                            <button type="button">Choose file</button>
                          </label>
                        </div>
                        <span className="notify-avatar">
                          PNG, JPG, SVG dimension (400 * 400) max file not more
                          then size 4 mb
                        </span>
                      </div>
                    </div>
                  </div>)
}