export default function ProfileForm() {
    return (
         <div className="tfcl-add-listing profile-inner">
                  <h3>Avatar</h3>
                  <div className="tfcl_choose_avatar">
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
                  </div>
                  <h3 className="form-title">Information</h3>
                  <div className="form-group">
                    <label htmlFor="listing_title">Full name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="listing_title"
                      placeholder="Your name"
                      defaultValue=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="listing_title">Description</label>
                    <textarea
                      name=""
                      id=""
                      placeholder="Your description"
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-group-4">
                    <div className="form-group">
                      <label htmlFor="listing_title">Your company</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        defaultValue=""
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="listing_title">Job</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        defaultValue=""
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="listing_title">Email address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        defaultValue=""
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="listing_title">Your phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>
    );
}
