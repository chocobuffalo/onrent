import { Metadata } from "next";

export interface CustomMetadata extends Metadata {
    siteName: string
}

export interface FileInterface{
    filename: string,
    content_base64: string,  // sin encabezado "data:image/png;base64,"
    mimetype: string
}