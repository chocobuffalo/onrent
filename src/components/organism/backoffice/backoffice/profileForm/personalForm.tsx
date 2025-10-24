import usePersonalForm from "@/hooks/backend/usePersonalForm";
import { ImSpinner8 } from "react-icons/im";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

interface PersonalFormProps {
  showOperatorForm: boolean;
  onOperatorFormReset: () => void;
}

export default function PersonalForm({ showOperatorForm, onOperatorFormReset }: PersonalFormProps) {
  const {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    isLoading,
    authEmail,
    regions,
    isLoadingRegions,
    selectedRegion,
    setSelectedRegion,
    hasChanges,
    locationStatus,
    cityError,
    setCityError,
    // listas dinámicas del hook
    licenseTypes,
    experienceLevels,
    trainingStatuses,
    availabilities,
    providers,
    machines,
  } = usePersonalForm({ showOperatorForm, onOperatorFormReset });

  return (
    <div className="">
      <h2 className="form-title mb-2">Información Personal</h2>
      <form
        onSubmit={handleSubmit(
          (data) => {
            // validación de región manual
            if (!selectedRegion) {
              setCityError(true);
              toast.error("El campo ciudad es obligatorio");
              return;
            }
            setCityError(false);
            onSubmit(data);
          },
          (validationErrors) => {
            const missingFields: string[] = [];
            if (validationErrors.fullName) missingFields.push("nombre completo");
            if (validationErrors.telephone) missingFields.push("teléfono");
            if (!selectedRegion) {
              setCityError(true);
              missingFields.push("ciudad");
            }

            if (missingFields.length > 0) {
              let errorMessage = "";
              if (missingFields.length === 1) {
                errorMessage = `El campo ${missingFields[0]} es obligatorio`;
              } else if (missingFields.length === 2) {
                errorMessage = `Los campos ${missingFields[0]} y ${missingFields[1]} son obligatorios`;
              } else {
                errorMessage = `Los campos ${missingFields[0]}, ${missingFields[1]} y ${missingFields[2]} son obligatorios`;
              }
              toast.error(errorMessage);
            }
          }
        )}
        className=""
      >
        <div className="profile-personal">
          <div className="row">
            {/* Nombre */}
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="fullName">Nombre Completo</label>
                <input
                  {...register("fullName")}
                  type="text"
                  className="form-control"
                  placeholder="Tu nombre"
                />
                {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
              </div>
            </div>

            {/* Teléfono */}
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="telephone">Teléfono</label>
                <input
                  {...register("telephone")}
                  type="text"
                  className="form-control"
                  placeholder="Tu teléfono"
                />
                {errors.telephone && <span className="text-danger">{errors.telephone.message}</span>}
              </div>
            </div>

            {/* Email (solo lectura) */}
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  disabled
                  type="text"
                  className="form-control disabled"
                  placeholder="Tu correo electrónico"
                  value={authEmail}
                />
              </div>
            </div>

            {/* Región */}
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="region">Ciudad (Región)</label>
                {isLoadingRegions ? (
                  <div className="form-control d-flex align-items-center">
                    <ImSpinner8 color="#6c757d" size={16} className="animate-spin me-2" />
                    <span>Cargando regiones...</span>
                  </div>
                ) : (
                  <>
                    <select
                      className="form-control"
                      value={selectedRegion || ""}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value ? Number(e.target.value) : null);
                        setCityError(false);
                      }}
                      style={{
                        fontSize: "14px",
                        color: selectedRegion ? "#212529" : "#6c757d",
                        borderRadius: "1rem",
                        padding: "0.75rem 0.90rem",
                        height: "auto",
                        minHeight: "55px",
                      }}
                    >
                      <option value="" disabled style={{ color: "#6c757d" }}>
                        Selecciona tu región
                      </option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id} className="text-gray-900">
                          {region.name}
                        </option>
                      ))}
                    </select>
                    {cityError && <span className="text-danger">La ciudad es obligatoria</span>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Información de Operador */}
          {showOperatorForm && (
            <div className="mt-4">
              <h2 className="form-title mb-2">Información de Operador</h2>

              {/* Estado de ubicación */}
              <div className="mb-4">
                {locationStatus === "loading" && (
                  <div className="alert alert-info d-flex align-items-center" style={{ borderRadius: "0.5rem" }}>
                    <ImSpinner8 size={20} className="animate-spin me-2" />
                    <span>Obteniendo tu ubicación...</span>
                  </div>
                )}
                {locationStatus === "success" && (
                  <div className="alert alert-success d-flex align-items-center" style={{ borderRadius: "0.5rem" }}>
                    <FaCheckCircle size={20} className="me-2" />
                    <span>✓ Ubicación obtenida correctamente</span>
                  </div>
                )}
                {locationStatus === "error" && (
                  <div className="alert alert-warning d-flex align-items-center" style={{ borderRadius: "0.5rem" }}>
                    <FaExclamationTriangle size={20} className="me-2" />
                    <span>No se pudo obtener la ubicación. Por favor, permite el acceso en el navegador.</span>
                  </div>
                )}
              </div>

              <div className="row">
                {/* CURP */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="curp">CURP</label>
                    <input
                      {...register("curp")}
                      type="text"
                      className="form-control"
                      placeholder="CURP (18 caracteres)"
                      maxLength={18}
                    />
                    {errors.curp && <span className="text-danger">{errors.curp.message}</span>}
                  </div>
                </div>

                {/* Número de licencia */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="licenseNumber">Número de Licencia</label>
                    <input
                      {...register("licenseNumber")}
                      type="text"
                      className="form-control"
                      placeholder="Número de licencia"
                    />
                    {errors.licenseNumber && <span className="text-danger">{errors.licenseNumber.message}</span>}
                  </div>
                </div>

                {/* Tipo de licencia (select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="licenseType">Tipo de Licencia</label>
                    <select {...register("licenseType")} className="form-control">
                      <option value="">Selecciona tipo</option>
                      {licenseTypes.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.licenseType && <span className="text-danger">{errors.licenseType.message}</span>}
                  </div>
                </div>

                {/* Años de experiencia */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="experienceYears">Años de Experiencia</label>
                    <input
                      {...register("experienceYears")}
                      type="number"
                      className="form-control"
                      placeholder="Años de experiencia"
                      min="0"
                    />
                    {errors.experienceYears && <span className="text-danger">{errors.experienceYears.message}</span>}
                  </div>
                </div>

                {/* Nivel de experiencia (select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="experienceLevel">Nivel de Experiencia</label>
                    <select {...register("experienceLevel")} className="form-control">
                      <option value="">Selecciona nivel</option>
                      {experienceLevels.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.experienceLevel && <span className="text-danger">{errors.experienceLevel.message}</span>}
                  </div>
                </div>

                {/* Estado de capacitación (select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="trainingStatus">Estado de Capacitación</label>
                    <select {...register("trainingStatus")} className="form-control">
                      <option value="">Selecciona estado</option>
                      {trainingStatuses.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.trainingStatus && <span className="text-danger">{errors.trainingStatus.message}</span>}
                  </div>
                </div>

                {/* Disponibilidad (select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="availability">Disponibilidad</label>
                    <select {...register("availability")} className="form-control">
                      <option value="">Selecciona disponibilidad</option>
                      {availabilities.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.availability && <span className="text-danger">{errors.availability.message}</span>}
                  </div>
                </div>

                {/* Proveedor (select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="providerId">Proveedor</label>
                    <select {...register("providerId")} className="form-control">
                      <option value="">Selecciona un proveedor</option>
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.providerId && <span className="text-danger">{errors.providerId.message}</span>}
                  </div>
                </div>

                {/* Máquinas compatibles (multi-select) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="compatibleMachinesIds">Máquinas Compatibles</label>
                    <select {...register("compatibleMachinesIds")} multiple className="form-control">
                      {machines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">Usa Ctrl/Cmd para seleccionar varias</small>
                    {errors.compatibleMachinesIds && (
                      <span className="text-danger">{(errors.compatibleMachinesIds as any)?.message}</span>
                    )}
                  </div>
                </div>

                {/* EPP */}
                <div className="col-md-6">
                  <div className="form-group d-flex align-items-center" style={{ marginTop: "32px" }}>
                    <input
                      {...register("hasEpp")}
                      type="checkbox"
                      id="hasEpp"
                      style={{ width: "20px", height: "20px", marginRight: "10px", cursor: "pointer" }}
                    />
                    <label htmlFor="hasEpp" style={{ marginBottom: 0, cursor: "pointer" }}>
                      ¿Cuenta con EPP (Equipo de Protección Personal)?
                    </label>
                  </div>
                </div>

                {/* GPS ocultos */}
                <input {...register("gpsLat")} type="hidden" />
                <input {...register("gpsLng")} type="hidden" />
              </div>
            </div>
          )}

          {/* Botón submit */}
          <div className="group-button-submit left mb-0">
            <button className="pre-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto" />
              ) : (
                <span>Actualizar</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
