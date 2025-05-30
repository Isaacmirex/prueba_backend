import { Injectable,NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService ) {

  }
  async create(createProductDto: CreateProductDto) {
    try {
   return  await this.prismaService.product.create({
      data: createProductDto})
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Product with name ${createProductDto.name} already exists`);
        }
      }
    }
  }

  findAll() {
    this.prismaService.product.findMany()
      .then((products) => { 
        console.log('Products found:', products);
        return products;
      })
      .catch((error) => {
        console.error('Error finding products:', error);
        return [];
      } );
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
   const productFount = await this.prismaService.product.findUnique({
      where: { id: id }});
    if (!productFount) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return productFount;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productFount = await this.prismaService.product.update({
      where: { id: id },
      data: updateProductDto
    })
    if (!productFount) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return productFount;
  }

  async remove(id: number) {
   const deleteProduct =  await this.prismaService.product.delete({
      where: { id: id }})
       if (!deleteProduct) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  return deleteProduct;
  }
 
}
