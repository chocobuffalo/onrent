// src/services/setProfileForm.ts
export default async function setProfileForm({
    token,
    fullName,
    telephone,
    avatar,
    curp,
    licenseNumber,
    licenseType,
    experienceYears,
    experienceLevel,
    trainingStatus,
    hasEpp,
    availability,
    gpsLat,
    gpsLng,
}: {
    token: string;
    fullName?: string;
    telephone?: string;
    avatar?: string;
    curp?: string;
    licenseNumber?: string;
    licenseType?: string;
    experienceYears?: number;
    experienceLevel?: string;
    trainingStatus?: string;
    hasEpp?: boolean;
    availability?: string;
    gpsLat?: number;
    gpsLng?: number;
}) {
    const body: any = {};

    if (fullName) body.name = fullName;
    if (telephone) body.phone = telephone;
    if (avatar) body.image_base64 = avatar;
    if (curp) body.curp = curp;
    if (licenseNumber) body.license_number = licenseNumber;
    if (licenseType) body.license_type = licenseType;
    if (experienceYears !== undefined) body.experience_years = experienceYears;
    if (experienceLevel) body.experience_level = experienceLevel;
    if (trainingStatus) body.training_status = trainingStatus;
    if (hasEpp !== undefined) body.has_epp = hasEpp;
    if (availability) body.availability = availability;
    if (gpsLat !== undefined) body.gps_lat = gpsLat;
    if (gpsLng !== undefined) body.gps_lng = gpsLng;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/update_profile`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
    const data = await res.json();
    return data;
}