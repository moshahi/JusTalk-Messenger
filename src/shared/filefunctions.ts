import { randomUUID } from 'crypto';
import * as path from 'path';

export function destination(req, file, cb) {
  cb(null, path.join(__dirname, '..', '..', 'uploads'));
}

export function filename(req, file, cb) {
  cb(null, randomUUID() + file.originalname);
}
