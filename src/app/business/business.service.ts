import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business, BusinessDocument } from './entities/business.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}
  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const foundBusiness = await this.businessModel.findOne({
      name: createBusinessDto.name,
    });
    if (foundBusiness) {
      throw new HttpException(
        'Business is already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdBusiness = this.businessModel.create(createBusinessDto);
    return createdBusiness;
  }

  findAll() {
    return `This action returns all business`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
