import axios from 'axios';

import type {
  AdvertisementImage,
  AdvertisementImageType,
  AdvertisementPosition,
  AdvertisementWithImages
} from '@/types/advertisements';
import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateAdvertisementRequest = {
  vendorId: number;
  position: AdvertisementPosition;
  targetUrl: string;
  altText: string;
  startDate: Date;
  endDate?: Date | null;
  isActive?: boolean;
};

export type UpdateAdvertisementRequest = Partial<CreateAdvertisementRequest>;

export type CreateAdvertisementImageRequest = {
  advertisementId: number;
  imageType: AdvertisementImageType;
  imageUrl: string;
  isActive?: boolean;
};

export type UpdateAdvertisementImageRequest = {
  isActive?: boolean;
};

type PresignedUrlRequest = {
  fileType: string;
  fileName: string;
  imageType: AdvertisementImageType;
};

type PresignedUrlResponse = {
  presignedUrl: string;
  publicUrl: string;
  objectKey: string;
  imageType: AdvertisementImageType;
  advertisementId: number;
  expiresIn: number;
};

type ConfirmUploadRequest = {
  publicUrl: string;
  imageType: AdvertisementImageType;
  isActive: boolean;
  width: number;
  height: number;
  fileSize: number;
  fileType: string;
  metadata: Record<string, any>;
};

class AdvertisementService {
  async getAllAdvertisements(): Promise<AdvertisementWithImages[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/vendor/advertisements?with=images`
      );
      const data = response.data.data || [];
      
      // Transform API response to match frontend expectations and add missing images field
      return data.map((ad: any) => ({
        ...ad,
        images: ad.images || [] // Add empty images array if missing
      }));
    } catch (error) {
      console.warn('Error fetching advertisements:', error);
      return [] as AdvertisementWithImages[];
    }
  }

  async getAllAdImages(): Promise<AdvertisementImage[]> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/vendor/advertisements/images`
    );
    return response.data.data || ([] as AdvertisementImage[]);
  }

  async getAdvertisementsByVendorId(
    vendorId: number | null,
    skipCache: boolean = false
  ): Promise<AdvertisementWithImages[]> {
    try {
      const url = vendorId
        ? `${BASE_URL}/api/v1/vendor/advertisements?with=images&vendor_id=${vendorId}`
        : `${BASE_URL}/api/v1/vendor/advertisements?with=images`;
      const response = await axiosInstance.get(url, {
        headers: {
          'x-skip-cache': skipCache ? 'true' : 'false'
        }
      });
      const data = response.data.data || [];
      
      // Transform API response to match frontend expectations and add missing images field
      return data.map((ad: any) => ({
        ...ad,
        images: ad.images || [] // Add empty images array if missing
      }));
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

  async updateAdvertisementImage(
    imageId: number,
    image: UpdateAdvertisementImageRequest
  ): Promise<any> {
    const response = await axiosInstance.patch(
      `${BASE_URL}/api/v1/vendor/advertisements/images/${imageId}`,
      image
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
      {
        publicUrl: data.publicUrl,
        imageType: data.imageType,
        fileSize: data.fileSize,
        fileType: data.fileType,
        width: data.width,
        height: data.height
      }
    );
    return response.data.data;
  }

  async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = reject;
    });
  }

  async uploadImageToS3(
    presignedUrl: string,
    file: File
  ): Promise<{
    fileType: string;
    fileSize: number;
    width: number;
    height: number;
  }> {
    try {
      // get the dimensions for the image
      const dimensions = await this.getImageDimensions(file);
      console.log('Uploading file to S3:', {
        fileType: file.type,
        fileSize: file.size,
        width: dimensions.width,
        height: dimensions.height,
        url: presignedUrl.split('?')[0] // Log the base URL without query params for security
      });

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      console.log('File successfully uploaded to S3');
      return {
        fileType: file.type,
        fileSize: file.size,
        width: dimensions.width,
        height: dimensions.height
      };
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
