import mongoose from 'mongoose';
import Group from '../Schemas/Group.js';

class GroupRepository {
  constructor() {
    this.repository = mongoose.model('groups', Group);
  }

  async insertMany(list) {
    try {
      await this.repository.insertMany(list);
    } catch (error) {
      console.error(error);
    }
  }

  async insertOne(group) {
    try {
      const findedGroup = await this.repository.findOne(
        { name: group.name },
        { noCursorTimeout: false }
      );
      if (findedGroup) {
        throw new Error('Já existe um grupo com esse nome');
      }
      await this.repository.create(group);
    } catch (error) {
      if (error) {
        console.error(error);
      }
      throw error;
    }
  }

  async findOne(name) {
    const item = await this.repository.findOne(
      { name },
      { noCursorTimeout: false }
    );
    if (item !== undefined) {
      return item;
    }
    throw new Error('Group not found');
  }

  async listAll() {
    const list = await this.repository
      .find({}, { noCursorTimeout: false })
      .map((item) => item);
    return list;
  }

  async listAcceptedGroups() {
    const list = await this.repository
      .find({ status: 'aproved' }, { noCursorTimeout: false })
      .map((item) => item);
    return list;
  }

  async updateOne(name, data) {
    try {
      await this.repository.updateOne(
        {
          name,
        },
        {
          $set: {
            name: data.group?.name,
            inviteMessageId: data.inviteMessageId,
            status: data.accepted
              ? 'aproved'
              : data.group?.status || 'unvalued',
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default GroupRepository;
