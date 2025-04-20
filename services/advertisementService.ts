import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  AdvertisementImageType
} from '@/types/advertisements';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type CreateAdvertisementRequest = {
  vendor_id: number;
  position: AdvertisementPosition;
  target_url: string;
  alt_text: string;
  start_date: Date;
  end_date?: Date | null;
  is_active?: boolean;
};

export type UpdateAdvertisementRequest = Partial<CreateAdvertisementRequest>;

export type CreateAdvertisementImageRequest = {
  advertisement_id: number;
  image_type: AdvertisementImageType;
  image_url: string;
  is_active?: boolean;
};

export type PresignedUrlRequest = {
  fileType: string;
  fileName: string;
  imageType: AdvertisementImageType;
};

export type PresignedUrlResponse = {
  presignedUrl: string;
  publicUrl: string;
  objectKey: string;
  imageType: AdvertisementImageType;
  advertisementId: number;
  expiresIn: number;
};

export type ConfirmUploadRequest = {
  publicUrl: string;
  imageType: AdvertisementImageType;
  isActive: boolean;
};

export class AdvertisementService {
  async getAllAdvertisements(): Promise<AdvertisementWithImages[]> {
    const response = await axios.get(
      `${BASE_URL}/api/v1/vendor/advertisements?with=images`
    );
    return response.data.data || ([] as AdvertisementWithImages[]);
  }

  async getAdvertisementsByVendorId(
    vendorId: number | null,
    skipCache: boolean = false
  ): Promise<AdvertisementWithImages[]> {
    try {
      const url = vendorId
        ? `${BASE_URL}/api/v1/vendor/advertisements?with=images&vendor_id=${vendorId}`
        : `${BASE_URL}/api/v1/vendor/advertisements?with=images`;
      const response = await axios.get(url, {
        headers: {
          'x-skip-cache': skipCache ? 'true' : 'false'
        }
      });
      return response.data.data || ([] as AdvertisementWithImages[]);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      return [] as AdvertisementWithImages[];
    }
  }

  async createAdvertisement(
    advertisement: CreateAdvertisementRequest
  ): Promise<AdvertisementWithImages> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/vendor/advertisements`,
      advertisement
    );
    return response.data.data;
  }

  async updateAdvertisement(
    advertisementId: number,
    advertisement: UpdateAdvertisementRequest
  ): Promise<AdvertisementWithImages> {
    console.log(
      'Updating advertisement with only changed fields:',
      advertisement
    );
    const response = await axiosInstance.patch(
      `${BASE_URL}/api/v1/vendor/advertisements/${advertisementId}`,
      advertisement
    );
    return response.data.data;
  }

  async deleteAdvertisement(advertisementId: number): Promise<void> {
    try {
      await axiosInstance.delete(
        `${BASE_URL}/api/v1/vendor/advertisements/${advertisementId}`
      );
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      throw error;
    }
  }

  async createAdvertisementImage(
    imageData: CreateAdvertisementImageRequest
  ): Promise<any> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/vendor/advertisement-images`,
      imageData
    );
    return response.data.data;
  }

  async deleteAdvertisementImage(imageId: number): Promise<void> {
    try {
      await axiosInstance.delete(
        `${BASE_URL}/api/v1/vendor/advertisements/images/${imageId}`
      );
    } catch (error) {
      console.error('Error deleting advertisement image:', error);
      throw error;
    }
  }

  async requestPresignedUrl(
    advertisementId: number,
    data: PresignedUrlRequest
  ): Promise<PresignedUrlResponse> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/vendor/advertisements/${advertisementId}/images/presigned-url`,
      data
    );
    return response.data.data;
  }

  async confirmImageUpload(
    advertisementId: number,
    data: ConfirmUploadRequest
  ): Promise<any> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/vendor/advertisements/${advertisementId}/images/confirm-upload`,
      data
    );
    return response.data.data;
  }

  async uploadImageToS3(presignedUrl: string, file: File): Promise<void> {
    try {
      console.log('Uploading file to S3:', {
        fileType: file.type,
        fileSize: file.size,
        url: presignedUrl.split('?')[0] // Log the base URL without query params for security
      });

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
          // Removed x-amz-acl header as it should be included in the presigned URL if needed
        }
      });

      console.log('File successfully uploaded to S3');
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          'S3 response:',
          error.response.status,
          error.response.data
        );
      }
      throw new Error(
        'Failed to upload image to S3. Check server logs for details.'
      );
    }
  }
}

export const advertisementService = new AdvertisementService();
