import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class FileService {
  public async moveFilesToDirectory(
    files: string[],
    destination: string,
  ): Promise<void> {
    for (const file of files) {
      await this.moveFileToDirectory(file, destination);
    }
  }

  public async moveFileToDirectory(
    source: string,
    destination: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.mkdirSync(destination, { recursive: true });
      fs.rename(
        source,
        path.join(destination, path.basename(source)),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(path.join(destination, path.basename(source)));
          }
        },
      );
    });
  }

  public deleteFile(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(file, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async deleteFiles(files: string[]): Promise<void> {
    for (const file of files) {
      await this.deleteFile(file);
    }
  }
}
