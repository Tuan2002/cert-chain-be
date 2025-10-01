import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { HttpStatusCode } from 'axios';
import FormData from 'form-data';
import { IPFSUploadResponse } from '../types';

@Injectable()
export class IPFSService {
  private readonly ipfsUrl: string;
  private readonly ipfsGatewayUrl: string;

  constructor() {
    this.ipfsUrl = process.env.IPFS_URL;
    this.ipfsGatewayUrl = process.env.IPFS_GATEWAY_URL;
  }

  /**
   * Uploads a file to IPFS and returns the upload response.
   * @param fileBuffer - The file buffer to upload.
   * @returns A promise that resolves to the IPFS upload response.
   * @throws InternalServerErrorException if the upload fails.
   */
  async uploadFileAsync(fileBuffer: Buffer): Promise<IPFSUploadResponse> {
    const formData = new FormData();
    formData.append('file', Buffer.from(fileBuffer), {
      filename: 'file',
    });

    const response = await axios.post(`${this.ipfsUrl}/api/v0/add`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.status !== HttpStatusCode.Ok) {
      throw new InternalServerErrorException(
        `Failed to upload file to IPFS: ${response.statusText}`,
      );
    }

    const { Hash: hash, Name: name, Size: size } = response.data;
    return {
      hash,
      name,
      size,
    };
  }

  /**
   * Gets the public URL of a file stored in IPFS.
   * @param hash - The IPFS hash of the file.
   * @returns The public URL of the file.
   * @throws InternalServerErrorException if the IPFS gateway URL is not configured.
   */
  getFileUrl(hash: string): string {
    if (!this.ipfsGatewayUrl) {
      throw new InternalServerErrorException(
        'IPFS gateway URL is not configured',
      );
    }
    return `${this.ipfsGatewayUrl}/ipfs/${hash}`;
  }

  /**
   * Gets the file data from IPFS.
   * @param hash - The IPFS hash of the file.
   * @returns A promise that resolves to the file data as a Buffer.
   * @throws InternalServerErrorException if the file cannot be retrieved.
   */
  async getFileDataAsync(hash: string): Promise<Buffer> {
    if (!this.ipfsGatewayUrl) {
      throw new InternalServerErrorException(
        'IPFS gateway URL is not configured',
      );
    }

    const response = await axios.get(`${this.ipfsGatewayUrl}/ipfs/${hash}`, {
      responseType: 'arraybuffer',
    });

    if (response.status !== HttpStatusCode.Ok) {
      throw new InternalServerErrorException(
        `Failed to retrieve file from IPFS: ${response.statusText}`,
      );
    }

    return Buffer.from(response.data);
  }
}
