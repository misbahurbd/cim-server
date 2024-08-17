import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { User } from '../user/user.model';
import { IProfile } from './profile.interface';
import { Profile } from './profile.model';
import { Types } from 'mongoose';

const updateProfile = async (userId: string, payload: IProfile) => {
  const user = await User.findById(new Types.ObjectId(userId));

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', null);
  }

  const { name, mobile, profilePhoto, address, city, country } = payload;

  const isProfileExist = await Profile.findOne({
    user: new Types.ObjectId(userId),
  });

  let profile;

  if (isProfileExist) {
    profile = await Profile.findOneAndUpdate(
      { user: user._id },
      {
        name,
        mobile,
        address,
        profilePhoto,
        city,
        country,
      },
      {
        new: true,
      },
    );
  } else {
    profile = await Profile.create({
      name,
      mobile,
      profilePhoto,
      email: user.email,
      address,
      city,
      country,
      user: user._id,
    });
  }

  return profile;
};

const getProfile = async (userId: string) => {
  const profile = await Profile.findOne({
    user: new Types.ObjectId(userId),
  });

  return profile;
};

export const profileService = {
  updateProfile,
  getProfile,
};
