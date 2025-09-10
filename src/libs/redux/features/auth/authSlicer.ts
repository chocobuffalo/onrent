import { getCompanyInfo } from '@/services/getCompanyInfo';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../uistore";
import { AuthStateInterface } from "@/types/auth";
import { set } from "react-hook-form";

export const initialAuth: AuthStateInterface = {
  isLogin: false,
  profile: {
    name: "",
    email: "",
    avatarUrl: "/profile-placeholder.svg",
    role: "",
    userID: "",
    token: "",
    phone: "",
    profileInfo:{
          constancia_pdf:"",
          direccion_fiscal:"",
          razon_social:"",
          rfc:""
        },
    companyInfo:{
      empresa: "",
      rfc_empresa: "",
      direccion_empresa: "",
      contacto_fiscal: "",
      telefono_contacto: "",
      representante_legal: "",
      empleados: 0
    }
  },
};

const authSlicer = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAvatar: (state, action) => {
      state.profile.avatarUrl = action.payload;
    },
    setName: (state, action) => {
      state.profile.name = action.payload;
    },
    setRole: (state, action) => {
      state.profile.role = action.payload;
    },
    setUserID: (state, action) => {
      state.profile.userID = action.payload;
    },
    setEmail: (state, action) => {
      state.profile.email = action.payload;
    },
    setPhone: (state, action) => {
      state.profile.phone = action.payload;
    },

    setProfileInfo: (state, action) => {
      state.profile.profileInfo = action.payload;
    },
    setConstanciaPDF: (state, action) => {
      state.profile.profileInfo.constancia_pdf = action.payload;
    },
    setDireccionFiscal: (state, action) => {
      state.profile.profileInfo.direccion_fiscal = action.payload;
    },
    setRazonSocial: (state, action) => {
      state.profile.profileInfo.razon_social = action.payload;
    },
    setRFC: (state, action) => {
      state.profile.profileInfo.rfc = action.payload;
    },

   /**
             * {
             * "empresa": false,
             * "rfc_empresa": false,
             * "direccion_empresa": false,
             * "contacto_fiscal": false,
             * "telefono_contacto": false,
             * "representante_legal": false,
             * "empleados": 0
             */
    setEmpresa: (state, action) => {
      state.profile.companyInfo.empresa = action.payload;
    },
    setRfcEmpresa: (state, action) => {
      state.profile.companyInfo.rfc_empresa = action.payload;
    },
    setDireccionEmpresa: (state, action) => {
      state.profile.companyInfo.direccion_empresa = action.payload;
    },
    setContactoFiscal: (state, action) => {
      state.profile.companyInfo.contacto_fiscal = action.payload;
    },
    setTelefonoContacto: (state, action) => {
      state.profile.companyInfo.telefono_contacto = action.payload;
    },
    setRepresentanteLegal: (state, action) => {
      state.profile.companyInfo.representante_legal = action.payload;
    },
    setEmpleados: (state, action) => {
      state.profile.companyInfo.empleados = action.payload;
    },
  
    forceLogout: (state) => {
      state.isLogin = false;
      state.profile = initialAuth.profile;
    },
  },
});


export const { 
  setLogin, 
  setProfile, 
  setAvatar, 
  setName, 
  setEmail,
  setRole,
  setPhone,
  setUserID,
  setProfileInfo,
  setConstanciaPDF,
  setDireccionFiscal,
  setRazonSocial,
  setRFC,
  setEmpresa,
  setRfcEmpresa,
  setDireccionEmpresa,
  setContactoFiscal,
  setTelefonoContacto,
  setRepresentanteLegal,
  setEmpleados,
  forceLogout 
} = authSlicer.actions;

export const selectProfile = (state: RootState) =>
  (state.auth as AuthStateInterface).profile;
export const selectAuth = (state: RootState) =>
  (state.auth as AuthStateInterface).isLogin;

export default authSlicer.reducer;