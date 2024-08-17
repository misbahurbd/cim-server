import express from 'express';
import { profileController } from './profile.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.get('/', checkAuth(), profileController.getProfile);

router.post('/', checkAuth(), profileController.updateProfile);

export const profileRoutes = router;
