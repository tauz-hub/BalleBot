import mongoose from 'mongoose';
import User from '../Schemas/User.js';

class UserRepository {
  constructor() {
    try {
      this.repository = mongoose.model('users', User);
    } catch (error) {
      console.error(error);
    }
  }

  async insertOne(user) {
    try {
      await this.repository.create(user);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  }

  async listAll() {
    const list = await this.repository.find().exec();
    return list;
  }

  async getLength() {
    const length = await this.repository.countDocuments();
    return length;
  }

  async getRandomGroup() {
    const userList = await this.repository.aggregate([
      {
        $match: {
          hasGroup: false,
        },
      },
      {
        $sample: {
          size: 4,
        },
      },
      {
        $set: {
          hasGroup: true,
        },
      },
    ]);
    const promiseList = userList.map((user) =>
      // eslint-disable-next-line no-underscore-dangle
      this.repository.updateOne({ _id: user._id }, user)
    );
    await Promise.all(promiseList);
    return userList;
  }

  async countUsers() {
    const [result] = await this.repository.aggregate([
      {
        $group: {
          _id: null,
          levelTotal: { $sum: '$level' },
          countUsers: { $sum: 1 },
          average: { $avg: '$level' },
          countLevel1: {
            $sum: {
              $cond: { if: { $eq: ['$level', 1] }, then: { $sum: 1 }, else: 0 },
            },
          },
          countLevel2: {
            $sum: {
              $cond: { if: { $eq: ['$level', 2] }, then: { $sum: 1 }, else: 0 },
            },
          },
          countLevel3: {
            $sum: {
              $cond: { if: { $eq: ['$level', 3] }, then: { $sum: 1 }, else: 0 },
            },
          },
          countLevel4: {
            $sum: {
              $cond: { if: { $eq: ['$level', 4] }, then: { $sum: 1 }, else: 0 },
            },
          },
          countLevel5: {
            $sum: {
              $cond: { if: { $eq: ['$level', 5] }, then: { $sum: 1 }, else: 0 },
            },
          },
        },
      },
    ]);
    return result;
  }
}

export default UserRepository;
