export interface Region {
  id: number;
  name: string;
}

export interface RegionsApiResponse {
  regions: Region[];
}

export interface GetRegionsResult {
  success: boolean;
  data?: Region[];
  error?: string;
  message: string;
}

export interface UpdateRegionPayload {
  regionId: number;
}

export interface UpdateRegionApiResponse {
  success: boolean;
  message: string;
}

export interface UpdateRegionResult {
  success: boolean;
  error?: string;
  message: string;
}