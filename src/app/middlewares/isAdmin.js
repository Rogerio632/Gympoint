import User from '../models/User';

export default async (req, res, next) => {
  const isAdmin = await User.findOne({
    where: {
      id: req.userId,
      isAdmin: true,
    },
  });
};
